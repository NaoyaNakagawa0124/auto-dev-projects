use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

/// Prefecture data with coordinates for map rendering
#[derive(Clone, Serialize, Deserialize)]
pub struct Prefecture {
    pub code: u8,
    pub name: String,
    pub lat: f64,
    pub lng: f64,
    pub region: String,
}

/// An event at a location
#[derive(Clone, Serialize, Deserialize)]
pub struct OshiEvent {
    pub id: String,
    pub prefecture_code: u8,
    pub title: String,
    pub date: String,
    pub event_type: String, // "concert", "event", "pilgrimage", "other"
    pub note: String,
}

/// Route segment between two events
#[derive(Clone, Serialize, Deserialize)]
pub struct RouteSegment {
    pub from_code: u8,
    pub to_code: u8,
    pub distance_km: f64,
}

/// Main state managed in WASM
#[wasm_bindgen]
pub struct OshiMapState {
    prefectures: Vec<Prefecture>,
    events: Vec<OshiEvent>,
}

#[wasm_bindgen]
impl OshiMapState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> OshiMapState {
        OshiMapState {
            prefectures: init_prefectures(),
            events: Vec::new(),
        }
    }

    /// Get all prefectures as JSON
    #[wasm_bindgen]
    pub fn get_prefectures_json(&self) -> String {
        serde_json::to_string(&self.prefectures).unwrap_or_default()
    }

    /// Add an event
    #[wasm_bindgen]
    pub fn add_event(&mut self, json: &str) -> bool {
        match serde_json::from_str::<OshiEvent>(json) {
            Ok(event) => {
                self.events.push(event);
                true
            }
            Err(_) => false,
        }
    }

    /// Remove an event by ID
    #[wasm_bindgen]
    pub fn remove_event(&mut self, id: &str) -> bool {
        let before = self.events.len();
        self.events.retain(|e| e.id != id);
        self.events.len() < before
    }

    /// Get all events as JSON
    #[wasm_bindgen]
    pub fn get_events_json(&self) -> String {
        serde_json::to_string(&self.events).unwrap_or_default()
    }

    /// Get events for a specific prefecture
    #[wasm_bindgen]
    pub fn get_events_for_prefecture(&self, code: u8) -> String {
        let filtered: Vec<&OshiEvent> = self.events.iter()
            .filter(|e| e.prefecture_code == code)
            .collect();
        serde_json::to_string(&filtered).unwrap_or_default()
    }

    /// Get number of visited prefectures
    #[wasm_bindgen]
    pub fn visited_count(&self) -> u32 {
        let mut visited: Vec<u8> = self.events.iter().map(|e| e.prefecture_code).collect();
        visited.sort();
        visited.dedup();
        visited.len() as u32
    }

    /// Get total events count
    #[wasm_bindgen]
    pub fn event_count(&self) -> u32 {
        self.events.len() as u32
    }

    /// Get coverage percentage (visited / 47 prefectures)
    #[wasm_bindgen]
    pub fn coverage_percent(&self) -> f64 {
        (self.visited_count() as f64 / 47.0) * 100.0
    }

    /// Calculate route segments between events (sorted by date)
    #[wasm_bindgen]
    pub fn get_route_json(&self) -> String {
        let mut sorted = self.events.clone();
        sorted.sort_by(|a, b| a.date.cmp(&b.date));

        let mut segments: Vec<RouteSegment> = Vec::new();
        for i in 1..sorted.len() {
            let from = sorted[i - 1].prefecture_code;
            let to = sorted[i].prefecture_code;
            if from != to {
                let dist = self.distance_between(from, to);
                segments.push(RouteSegment {
                    from_code: from,
                    to_code: to,
                    distance_km: dist,
                });
            }
        }
        serde_json::to_string(&segments).unwrap_or_default()
    }

    /// Get total route distance in km
    #[wasm_bindgen]
    pub fn total_distance_km(&self) -> f64 {
        let route_json = self.get_route_json();
        let segments: Vec<RouteSegment> = serde_json::from_str(&route_json).unwrap_or_default();
        segments.iter().map(|s| s.distance_km).sum()
    }

    /// Get stats as JSON
    #[wasm_bindgen]
    pub fn get_stats_json(&self) -> String {
        let stats = serde_json::json!({
            "total_events": self.event_count(),
            "visited_prefectures": self.visited_count(),
            "coverage_percent": (self.coverage_percent() * 10.0).round() / 10.0,
            "total_distance_km": (self.total_distance_km() * 10.0).round() / 10.0,
        });
        stats.to_string()
    }

    /// Load events from JSON array
    #[wasm_bindgen]
    pub fn load_events(&mut self, json: &str) -> bool {
        match serde_json::from_str::<Vec<OshiEvent>>(json) {
            Ok(events) => {
                self.events = events;
                true
            }
            Err(_) => false,
        }
    }

    /// Export all events as JSON
    #[wasm_bindgen]
    pub fn export_events(&self) -> String {
        serde_json::to_string(&self.events).unwrap_or_default()
    }
}

impl OshiMapState {
    fn distance_between(&self, code1: u8, code2: u8) -> f64 {
        let p1 = self.prefectures.iter().find(|p| p.code == code1);
        let p2 = self.prefectures.iter().find(|p| p.code == code2);
        match (p1, p2) {
            (Some(a), Some(b)) => haversine(a.lat, a.lng, b.lat, b.lng),
            _ => 0.0,
        }
    }
}

/// Haversine formula for distance between two lat/lng points
fn haversine(lat1: f64, lng1: f64, lat2: f64, lng2: f64) -> f64 {
    let r = 6371.0; // Earth radius in km
    let dlat = (lat2 - lat1).to_radians();
    let dlng = (lng2 - lng1).to_radians();
    let a = (dlat / 2.0).sin().powi(2)
        + lat1.to_radians().cos() * lat2.to_radians().cos() * (dlng / 2.0).sin().powi(2);
    let c = 2.0 * a.sqrt().asin();
    r * c
}

fn init_prefectures() -> Vec<Prefecture> {
    let data = vec![
        (1, "北海道", 43.06, 141.35, "北海道"),
        (2, "青森", 40.82, 140.74, "東北"),
        (3, "岩手", 39.70, 141.15, "東北"),
        (4, "宮城", 38.27, 140.87, "東北"),
        (5, "秋田", 39.72, 140.10, "東北"),
        (6, "山形", 38.24, 140.34, "東北"),
        (7, "福島", 37.75, 140.47, "東北"),
        (8, "茨城", 36.34, 140.45, "関東"),
        (9, "栃木", 36.57, 139.88, "関東"),
        (10, "群馬", 36.39, 139.06, "関東"),
        (11, "埼玉", 35.86, 139.65, "関東"),
        (12, "千葉", 35.60, 140.12, "関東"),
        (13, "東京", 35.68, 139.69, "関東"),
        (14, "神奈川", 35.45, 139.64, "関東"),
        (15, "新潟", 37.90, 139.02, "中部"),
        (16, "富山", 36.70, 137.21, "中部"),
        (17, "石川", 36.59, 136.63, "中部"),
        (18, "福井", 36.07, 136.22, "中部"),
        (19, "山梨", 35.66, 138.57, "中部"),
        (20, "長野", 36.23, 138.18, "中部"),
        (21, "岐阜", 35.39, 136.72, "中部"),
        (22, "静岡", 34.98, 138.38, "中部"),
        (23, "愛知", 35.18, 136.91, "中部"),
        (24, "三重", 34.73, 136.51, "近畿"),
        (25, "滋賀", 35.00, 135.87, "近畿"),
        (26, "京都", 35.02, 135.76, "近畿"),
        (27, "大阪", 34.69, 135.52, "近畿"),
        (28, "兵庫", 34.69, 135.18, "近畿"),
        (29, "奈良", 34.69, 135.83, "近畿"),
        (30, "和歌山", 34.23, 135.17, "近畿"),
        (31, "鳥取", 35.50, 134.24, "中国"),
        (32, "島根", 35.47, 133.05, "中国"),
        (33, "岡山", 34.66, 133.93, "中国"),
        (34, "広島", 34.40, 132.46, "中国"),
        (35, "山口", 34.19, 131.47, "中国"),
        (36, "徳島", 34.07, 134.56, "四国"),
        (37, "香川", 34.34, 134.04, "四国"),
        (38, "愛媛", 33.84, 132.77, "四国"),
        (39, "高知", 33.56, 133.53, "四国"),
        (40, "福岡", 33.61, 130.42, "九州"),
        (41, "佐賀", 33.25, 130.30, "九州"),
        (42, "長崎", 32.74, 129.87, "九州"),
        (43, "熊本", 32.79, 130.74, "九州"),
        (44, "大分", 33.24, 131.61, "九州"),
        (45, "宮崎", 31.91, 131.42, "九州"),
        (46, "鹿児島", 31.56, 130.56, "九州"),
        (47, "沖縄", 26.34, 127.77, "九州"),
    ];

    data.into_iter().map(|(code, name, lat, lng, region)| Prefecture {
        code,
        name: name.to_string(),
        lat,
        lng,
        region: region.to_string(),
    }).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new_state() {
        let state = OshiMapState::new();
        assert_eq!(state.prefectures.len(), 47);
        assert_eq!(state.events.len(), 0);
    }

    #[test]
    fn test_add_event() {
        let mut state = OshiMapState::new();
        let json = r#"{"id":"e1","prefecture_code":13,"title":"東京ライブ","date":"2026-03-30","event_type":"concert","note":"最高だった"}"#;
        assert!(state.add_event(json));
        assert_eq!(state.event_count(), 1);
        assert_eq!(state.visited_count(), 1);
    }

    #[test]
    fn test_remove_event() {
        let mut state = OshiMapState::new();
        let json = r#"{"id":"e1","prefecture_code":13,"title":"test","date":"2026-01-01","event_type":"concert","note":""}"#;
        state.add_event(json);
        assert!(state.remove_event("e1"));
        assert_eq!(state.event_count(), 0);
    }

    #[test]
    fn test_coverage() {
        let mut state = OshiMapState::new();
        let e1 = r#"{"id":"e1","prefecture_code":13,"title":"t","date":"2026-01-01","event_type":"concert","note":""}"#;
        let e2 = r#"{"id":"e2","prefecture_code":27,"title":"t","date":"2026-02-01","event_type":"concert","note":""}"#;
        state.add_event(e1);
        state.add_event(e2);
        assert_eq!(state.visited_count(), 2);
        let cov = state.coverage_percent();
        assert!(cov > 4.0 && cov < 5.0); // 2/47 ≈ 4.25%
    }

    #[test]
    fn test_duplicate_prefecture() {
        let mut state = OshiMapState::new();
        let e1 = r#"{"id":"e1","prefecture_code":13,"title":"t1","date":"2026-01-01","event_type":"concert","note":""}"#;
        let e2 = r#"{"id":"e2","prefecture_code":13,"title":"t2","date":"2026-02-01","event_type":"event","note":""}"#;
        state.add_event(e1);
        state.add_event(e2);
        assert_eq!(state.event_count(), 2);
        assert_eq!(state.visited_count(), 1); // Same prefecture
    }

    #[test]
    fn test_route_calculation() {
        let mut state = OshiMapState::new();
        let e1 = r#"{"id":"e1","prefecture_code":13,"title":"東京","date":"2026-01-01","event_type":"concert","note":""}"#;
        let e2 = r#"{"id":"e2","prefecture_code":27,"title":"大阪","date":"2026-02-01","event_type":"concert","note":""}"#;
        state.add_event(e1);
        state.add_event(e2);
        let dist = state.total_distance_km();
        assert!(dist > 300.0 && dist < 600.0); // Tokyo-Osaka ~400km
    }

    #[test]
    fn test_haversine() {
        // Tokyo to Osaka ≈ 395km
        let d = haversine(35.68, 139.69, 34.69, 135.52);
        assert!(d > 350.0 && d < 450.0);
    }

    #[test]
    fn test_load_export() {
        let mut state = OshiMapState::new();
        let events = r#"[{"id":"e1","prefecture_code":1,"title":"札幌","date":"2026-01-01","event_type":"concert","note":""}]"#;
        assert!(state.load_events(events));
        assert_eq!(state.event_count(), 1);
        let exported = state.export_events();
        assert!(exported.contains("札幌"));
    }

    #[test]
    fn test_prefectures_data() {
        let state = OshiMapState::new();
        let json = state.get_prefectures_json();
        assert!(json.contains("東京"));
        assert!(json.contains("大阪"));
        assert!(json.contains("北海道"));
        assert!(json.contains("沖縄"));
    }

    #[test]
    fn test_invalid_event_json() {
        let mut state = OshiMapState::new();
        assert!(!state.add_event("invalid json"));
        assert_eq!(state.event_count(), 0);
    }

    #[test]
    fn test_stats() {
        let state = OshiMapState::new();
        let json = state.get_stats_json();
        assert!(json.contains("total_events"));
        assert!(json.contains("coverage_percent"));
    }
}
