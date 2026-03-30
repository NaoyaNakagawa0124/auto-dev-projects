use serde::{Deserialize, Serialize};

pub const GRID_SIZE: usize = 5;

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum RoomType {
    Company,
    Study,
    Networking,
    Rest,
    Crisis,
    Treasure,
    Exit,
    Boss,
    Empty,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Room {
    pub room_type: RoomType,
    pub visited: bool,
    pub x: usize,
    pub y: usize,
    /// Which neighbors are connected (north, south, east, west)
    pub connections: [bool; 4],
    pub encounter_seed: u64,
    pub has_encounter: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Dungeon {
    pub rooms: Vec<Vec<Room>>,
    pub floor: usize,
}

impl Dungeon {
    pub fn generate(floor: usize, seed: u64) -> Dungeon {
        let mut rooms = Vec::new();
        let mut s = seed.wrapping_mul(floor as u64 + 1).wrapping_add(12345);

        // Initialize all rooms as empty
        for y in 0..GRID_SIZE {
            let mut row = Vec::new();
            for x in 0..GRID_SIZE {
                row.push(Room {
                    room_type: RoomType::Empty,
                    visited: false,
                    x,
                    y,
                    connections: [false; 4],
                    encounter_seed: next_seed(&mut s),
                    has_encounter: true,
                });
            }
            rooms.push(row);
        }

        // Place mandatory rooms
        // Start is (0,0) - make it a rest room
        rooms[0][0].room_type = RoomType::Rest;
        rooms[0][0].visited = true;
        rooms[0][0].has_encounter = false;

        // Exit at (4,4)
        rooms[4][4].room_type = RoomType::Exit;

        // Boss room near exit
        rooms[4][3].room_type = RoomType::Boss;

        // Place required rooms
        let mut placed = vec![(0, 0), (4, 4), (4, 3)];

        // 2 company rooms
        for _ in 0..2 {
            let (x, y) = find_empty_spot(&rooms, &placed, &mut s);
            rooms[y][x].room_type = RoomType::Company;
            placed.push((x, y));
        }

        // 1 study room
        {
            let (x, y) = find_empty_spot(&rooms, &placed, &mut s);
            rooms[y][x].room_type = RoomType::Study;
            placed.push((x, y));
        }

        // 1 rest room (besides start)
        {
            let (x, y) = find_empty_spot(&rooms, &placed, &mut s);
            rooms[y][x].room_type = RoomType::Rest;
            placed.push((x, y));
        }

        // Fill remaining empty rooms randomly
        for y in 0..GRID_SIZE {
            for x in 0..GRID_SIZE {
                if rooms[y][x].room_type == RoomType::Empty {
                    let t = next_seed(&mut s) % 100;
                    rooms[y][x].room_type = match t {
                        0..=24 => RoomType::Company,
                        25..=39 => RoomType::Study,
                        40..=54 => RoomType::Networking,
                        55..=64 => RoomType::Rest,
                        65..=79 => RoomType::Crisis,
                        80..=94 => RoomType::Treasure,
                        _ => RoomType::Networking,
                    };
                }
            }
        }

        // Generate corridors: connect rooms using a random walk from (0,0) to (4,4)
        // First, ensure a path exists from start to exit
        generate_path(&mut rooms, &mut s);

        // Then add extra random connections for exploration
        add_extra_connections(&mut rooms, &mut s, 8);

        Dungeon { rooms, floor }
    }

    pub fn get_room(&self, x: usize, y: usize) -> Option<&Room> {
        if x < GRID_SIZE && y < GRID_SIZE {
            Some(&self.rooms[y][x])
        } else {
            None
        }
    }

    pub fn get_room_mut(&mut self, x: usize, y: usize) -> Option<&mut Room> {
        if x < GRID_SIZE && y < GRID_SIZE {
            Some(&mut self.rooms[y][x])
        } else {
            None
        }
    }

    pub fn can_move(&self, x: usize, y: usize, direction: usize) -> bool {
        if x >= GRID_SIZE || y >= GRID_SIZE {
            return false;
        }
        self.rooms[y][x].connections[direction]
    }

    pub fn visit_room(&mut self, x: usize, y: usize) {
        if x < GRID_SIZE && y < GRID_SIZE {
            self.rooms[y][x].visited = true;
        }
    }

    pub fn count_rooms_of_type(&self, room_type: RoomType) -> usize {
        self.rooms
            .iter()
            .flat_map(|row| row.iter())
            .filter(|r| r.room_type == room_type)
            .count()
    }

    /// Check if there's a path from (0,0) to (4,4) using BFS
    pub fn is_exit_reachable(&self) -> bool {
        let mut visited = [[false; GRID_SIZE]; GRID_SIZE];
        let mut queue = vec![(0usize, 0usize)];
        visited[0][0] = true;

        while let Some((x, y)) = queue.pop() {
            if x == 4 && y == 4 {
                return true;
            }

            // North (0): y-1
            if self.rooms[y][x].connections[0] && y > 0 && !visited[y - 1][x] {
                visited[y - 1][x] = true;
                queue.push((x, y - 1));
            }
            // South (1): y+1
            if self.rooms[y][x].connections[1] && y + 1 < GRID_SIZE && !visited[y + 1][x] {
                visited[y + 1][x] = true;
                queue.push((x, y + 1));
            }
            // East (2): x+1
            if self.rooms[y][x].connections[2] && x + 1 < GRID_SIZE && !visited[y][x + 1] {
                visited[y][x + 1] = true;
                queue.push((x + 1, y));
            }
            // West (3): x-1
            if self.rooms[y][x].connections[3] && x > 0 && !visited[y][x - 1] {
                visited[y][x - 1] = true;
                queue.push((x - 1, y));
            }
        }
        false
    }
}

fn next_seed(s: &mut u64) -> u64 {
    *s = s.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
    (*s >> 33) ^ *s
}

fn find_empty_spot(
    rooms: &[Vec<Room>],
    placed: &[(usize, usize)],
    s: &mut u64,
) -> (usize, usize) {
    for _ in 0..100 {
        let x = (next_seed(s) % GRID_SIZE as u64) as usize;
        let y = (next_seed(s) % GRID_SIZE as u64) as usize;
        if rooms[y][x].room_type == RoomType::Empty && !placed.contains(&(x, y)) {
            return (x, y);
        }
    }
    // Fallback: find first empty
    for y in 0..GRID_SIZE {
        for x in 0..GRID_SIZE {
            if rooms[y][x].room_type == RoomType::Empty && !placed.contains(&(x, y)) {
                return (x, y);
            }
        }
    }
    (2, 2) // should never reach here on 5x5
}

/// Connect two adjacent rooms bidirectionally
fn connect(rooms: &mut [Vec<Room>], x1: usize, y1: usize, x2: usize, y2: usize) {
    if x2 == x1 + 1 && y2 == y1 {
        // east
        rooms[y1][x1].connections[2] = true;
        rooms[y2][x2].connections[3] = true;
    } else if x1 > 0 && x2 == x1 - 1 && y2 == y1 {
        // west
        rooms[y1][x1].connections[3] = true;
        rooms[y2][x2].connections[2] = true;
    } else if y2 == y1 + 1 && x2 == x1 {
        // south
        rooms[y1][x1].connections[1] = true;
        rooms[y2][x2].connections[0] = true;
    } else if y1 > 0 && y2 == y1 - 1 && x2 == x1 {
        // north
        rooms[y1][x1].connections[0] = true;
        rooms[y2][x2].connections[1] = true;
    }
}

/// Generate a guaranteed path from (0,0) to (4,4) using random walk
fn generate_path(rooms: &mut [Vec<Room>], s: &mut u64) {
    let mut x: usize = 0;
    let mut y: usize = 0;

    while x != 4 || y != 4 {
        let go_right = next_seed(s) % 2 == 0;
        if go_right && x < 4 {
            connect(rooms, x, y, x + 1, y);
            x += 1;
        } else if y < 4 {
            connect(rooms, x, y, x, y + 1);
            y += 1;
        } else if x < 4 {
            connect(rooms, x, y, x + 1, y);
            x += 1;
        }
    }
}

/// Add random extra connections for more exploration options
fn add_extra_connections(rooms: &mut [Vec<Room>], s: &mut u64, count: usize) {
    for _ in 0..count {
        let x = (next_seed(s) % GRID_SIZE as u64) as usize;
        let y = (next_seed(s) % GRID_SIZE as u64) as usize;
        let dir = (next_seed(s) % 4) as usize;

        match dir {
            0 if y > 0 => connect(rooms, x, y, x, y - 1),
            1 if y + 1 < GRID_SIZE => connect(rooms, x, y, x, y + 1),
            2 if x + 1 < GRID_SIZE => connect(rooms, x, y, x + 1, y),
            3 if x > 0 => connect(rooms, x, y, x - 1, y),
            _ => {}
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_dungeon_has_correct_size() {
        let d = Dungeon::generate(0, 42);
        assert_eq!(d.rooms.len(), GRID_SIZE);
        for row in &d.rooms {
            assert_eq!(row.len(), GRID_SIZE);
        }
    }

    #[test]
    fn test_start_room_is_visited() {
        let d = Dungeon::generate(0, 42);
        assert!(d.rooms[0][0].visited);
    }

    #[test]
    fn test_exit_exists() {
        let d = Dungeon::generate(0, 42);
        assert!(d.count_rooms_of_type(RoomType::Exit) >= 1);
    }

    #[test]
    fn test_boss_exists() {
        let d = Dungeon::generate(0, 42);
        assert!(d.count_rooms_of_type(RoomType::Boss) >= 1);
    }

    #[test]
    fn test_company_rooms_exist() {
        let d = Dungeon::generate(0, 42);
        assert!(d.count_rooms_of_type(RoomType::Company) >= 2);
    }

    #[test]
    fn test_study_room_exists() {
        let d = Dungeon::generate(0, 42);
        assert!(d.count_rooms_of_type(RoomType::Study) >= 1);
    }

    #[test]
    fn test_rest_room_exists() {
        let d = Dungeon::generate(0, 42);
        assert!(d.count_rooms_of_type(RoomType::Rest) >= 1);
    }

    #[test]
    fn test_exit_reachable() {
        for seed in 0..20 {
            let d = Dungeon::generate(0, seed);
            assert!(
                d.is_exit_reachable(),
                "Exit not reachable with seed {}",
                seed
            );
        }
    }

    #[test]
    fn test_no_empty_rooms() {
        let d = Dungeon::generate(0, 42);
        assert_eq!(d.count_rooms_of_type(RoomType::Empty), 0);
    }

    #[test]
    fn test_different_seeds_different_dungeons() {
        let d1 = Dungeon::generate(0, 42);
        let d2 = Dungeon::generate(0, 999);
        // Check that at least some rooms differ
        let mut differences = 0;
        for y in 0..GRID_SIZE {
            for x in 0..GRID_SIZE {
                if d1.rooms[y][x].room_type != d2.rooms[y][x].room_type {
                    differences += 1;
                }
            }
        }
        assert!(differences > 0, "Different seeds should produce different dungeons");
    }

    #[test]
    fn test_connections_are_bidirectional() {
        let d = Dungeon::generate(0, 42);
        for y in 0..GRID_SIZE {
            for x in 0..GRID_SIZE {
                // If room connects east, neighbor should connect west
                if x + 1 < GRID_SIZE && d.rooms[y][x].connections[2] {
                    assert!(
                        d.rooms[y][x + 1].connections[3],
                        "Connection not bidirectional at ({},{}) east",
                        x,
                        y
                    );
                }
                // If room connects south, neighbor should connect north
                if y + 1 < GRID_SIZE && d.rooms[y][x].connections[1] {
                    assert!(
                        d.rooms[y + 1][x].connections[0],
                        "Connection not bidirectional at ({},{}) south",
                        x,
                        y
                    );
                }
            }
        }
    }

    #[test]
    fn test_can_move() {
        let d = Dungeon::generate(0, 42);
        // Start room (0,0) should have at least one connection
        let has_connection = d.can_move(0, 0, 0)
            || d.can_move(0, 0, 1)
            || d.can_move(0, 0, 2)
            || d.can_move(0, 0, 3);
        assert!(has_connection);
    }

    #[test]
    fn test_get_room() {
        let d = Dungeon::generate(0, 42);
        assert!(d.get_room(0, 0).is_some());
        assert!(d.get_room(4, 4).is_some());
        assert!(d.get_room(5, 5).is_none());
    }

    #[test]
    fn test_all_floors_generate() {
        for floor in 0..5 {
            let d = Dungeon::generate(floor, 42);
            assert!(d.is_exit_reachable());
            assert_eq!(d.floor, floor);
        }
    }
}
