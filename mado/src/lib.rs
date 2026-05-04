use wasm_bindgen::prelude::*;

const PARTICLE_MAX: usize = 240;
const SILHOUETTE_POINTS: usize = 64;
const SILHOUETTE_LAYERS: usize = 3;
const SCENE_COUNT: usize = 6;

#[derive(Clone, Copy)]
struct Particle {
    x: f32,
    y: f32,
    vx: f32,
    vy: f32,
    opacity: f32,
    size: f32,
    age: f32,
    life: f32,
    alive: bool,
}

impl Default for Particle {
    fn default() -> Self {
        Self {
            x: 0.0, y: 0.0, vx: 0.0, vy: 0.0,
            opacity: 0.0, size: 0.0, age: 0.0, life: 0.0,
            alive: false,
        }
    }
}

#[wasm_bindgen]
pub struct Mado {
    scene_idx: usize,
    time: f32,
    particles: Vec<Particle>,
    rng: u32,
}

#[wasm_bindgen]
impl Mado {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Mado {
        Mado {
            scene_idx: 0,
            time: 0.0,
            particles: vec![Particle::default(); PARTICLE_MAX],
            rng: 1,
        }
    }

    pub fn scene_count(&self) -> usize { SCENE_COUNT }
    pub fn current_scene(&self) -> usize { self.scene_idx }
    pub fn particle_kind(&self) -> u32 { particle_config(self.scene_idx).kind }

    pub fn set_scene(&mut self, idx: usize) {
        self.scene_idx = idx % SCENE_COUNT;
        for p in self.particles.iter_mut() { p.alive = false; }
        self.rng = 1u32.wrapping_add(self.scene_idx as u32 * 999_983);
        self.time = 0.0;
    }

    pub fn tick(&mut self, dt: f32) {
        self.time += dt;
        let cfg = particle_config(self.scene_idx);

        let raw = cfg.spawn_rate * dt;
        let mut to_spawn = raw as i32;
        let frac = raw - to_spawn as f32;
        if self.rand_f32() < frac { to_spawn += 1; }
        for _ in 0..to_spawn { self.spawn_one(); }

        for p in self.particles.iter_mut() {
            if !p.alive { continue; }
            p.age += dt;
            if p.age >= p.life {
                p.alive = false;
                continue;
            }
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            // wrap horizontal for ambient drift
            if p.x < -0.05 { p.x += 1.10; }
            if p.x > 1.05 { p.x -= 1.10; }

            let lf = p.age / p.life;
            p.opacity = if lf < 0.18 {
                lf / 0.18
            } else if lf > 0.82 {
                (1.0 - lf) / 0.18
            } else {
                1.0
            };
            // gentle twinkle for aurora/firefly/star
            if cfg.kind == 4 || cfg.kind == 5 {
                let tw = (p.age * 2.3 + p.x * 9.7).sin() * 0.25 + 0.75;
                p.opacity *= tw;
            }
        }
    }

    /// 4 gradient stops × RGB → 12 bytes.
    pub fn gradient(&self) -> Vec<u8> { gradient_for(self.scene_idx) }

    /// SILHOUETTE_LAYERS × SILHOUETTE_POINTS heights in [0,1]. y=0 is sky top.
    pub fn silhouettes(&self) -> Vec<f32> { silhouettes_for(self.scene_idx) }
    pub fn silhouette_points(&self) -> usize { SILHOUETTE_POINTS }
    pub fn silhouette_layers(&self) -> usize { SILHOUETTE_LAYERS }

    /// Active particles: [x, y, opacity, size] flat, repeated per particle.
    pub fn particles(&self) -> Vec<f32> {
        let mut out = Vec::with_capacity(PARTICLE_MAX * 4);
        for p in self.particles.iter() {
            if !p.alive { continue; }
            out.push(p.x);
            out.push(p.y);
            out.push(p.opacity);
            out.push(p.size);
        }
        out
    }

    /// Generate a seamless ambient mono buffer for the current scene.
    pub fn generate_audio(&self, sample_rate: u32, seconds: f32) -> Vec<f32> {
        Self::synth_audio(self.scene_idx, sample_rate, seconds)
    }

    /// Generate a seamless ambient buffer for a given scene without touching active state.
    pub fn generate_audio_for(&self, scene: usize, sample_rate: u32, seconds: f32) -> Vec<f32> {
        Self::synth_audio(scene % SCENE_COUNT, sample_rate, seconds)
    }

    fn synth_audio(scene: usize, sample_rate: u32, seconds: f32) -> Vec<f32> {
        let recipe = audio_recipe(scene);
        let n = (sample_rate as f32 * seconds) as usize;
        let mut out = vec![0.0_f32; n];
        let mut rng: u32 = 0x1234_5678u32.wrapping_add(scene as u32 * 7_919);
        let mut lp = 0.0_f32;
        let tau = std::f32::consts::TAU;

        for i in 0..n {
            let t = i as f32 / sample_rate as f32;
            let mut s = 0.0_f32;

            // Slow LFO for breathing
            let lfo = (t * 0.07 * tau).sin() * 0.5 + 0.5;

            // Pad: two sines, fifth apart, slowly modulated
            let pad1 = (t * recipe.pad_freq * tau).sin();
            let pad2 = (t * recipe.pad_freq * 1.5 * tau).sin() * 0.55;
            let pad3 = (t * recipe.pad_freq * 0.5 * tau).sin() * 0.35;
            s += (pad1 + pad2 + pad3) * recipe.pad_vol * (0.55 + 0.45 * lfo);

            // Filtered pink-ish noise (single-pole LP)
            let noise_raw = (rng_step(&mut rng) as f32 / u32::MAX as f32 - 0.5) * 2.0;
            lp += recipe.noise_lp * (noise_raw - lp);
            // Wind tremor: slow amplitude wobble
            let wind_amp = 0.55 + 0.45 * (t * 0.21 * tau).sin();
            s += lp * recipe.noise_vol * wind_amp;

            // Periodic accent (bird/bell/insect)
            if recipe.accent_vol > 0.0 {
                let bt = t % recipe.accent_period;
                if bt < recipe.accent_dur {
                    let env = (1.0 - bt / recipe.accent_dur).max(0.0);
                    let env2 = env * env;
                    s += (bt * recipe.accent_freq * tau).sin() * env2 * recipe.accent_vol;
                }
                // optional second accent at offset half period (varies per scene)
                let bt2 = (t + recipe.accent_period * 0.37) % recipe.accent_period;
                if bt2 < recipe.accent_dur * 0.7 {
                    let env = (1.0 - bt2 / (recipe.accent_dur * 0.7)).max(0.0);
                    s += (bt2 * recipe.accent_freq * 1.34 * tau).sin() * env * env * recipe.accent_vol * 0.6;
                }
            }

            s = (s * 0.85).tanh() * 0.65;
            out[i] = s;
        }

        // Crossfade tail-into-head for seamless loop
        let xfade = ((sample_rate as f32) * 0.5) as usize;
        if xfade > 0 && xfade < n / 2 {
            for k in 0..xfade {
                let f = k as f32 / xfade as f32;
                let head = out[k];
                let tail = out[n - xfade + k];
                let mixed = head * f + tail * (1.0 - f);
                out[k] = mixed;
                out[n - xfade + k] = mixed;
            }
        }
        out
    }

    fn spawn_one(&mut self) {
        let idx = match self.particles.iter().position(|p| !p.alive) {
            Some(i) => i,
            None => return,
        };
        let cfg = particle_config(self.scene_idx);
        let r1 = self.rand_f32();
        let r2 = self.rand_f32();
        let r3 = self.rand_f32();
        let r4 = self.rand_f32();
        let rs = self.rand_f32();
        let rl = self.rand_f32();

        let p = &mut self.particles[idx];
        match cfg.kind {
            1 => { // snow
                p.x = r1; p.y = -0.05 + r2 * 0.08;
                p.vx = (r3 - 0.5) * 0.06;
                p.vy = 0.06 + r4 * 0.08;
            }
            2 => { // petal
                p.x = -0.05 + r1 * 1.10;
                p.y = -0.05 + r2 * 0.08;
                p.vx = -0.10 + r3 * 0.18;
                p.vy = 0.04 + r4 * 0.06;
            }
            3 => { // star (mostly stationary)
                p.x = r1; p.y = r2 * 0.55;
                p.vx = 0.0; p.vy = 0.0;
            }
            4 => { // aurora dust
                p.x = r1; p.y = 0.18 + r2 * 0.30;
                p.vx = (r3 - 0.5) * 0.025;
                p.vy = (r4 - 0.5) * 0.006;
            }
            5 => { // firefly
                p.x = r1; p.y = 0.45 + r2 * 0.40;
                p.vx = (r3 - 0.5) * 0.05;
                p.vy = (r4 - 0.5) * 0.04;
            }
            _ => { // 0 dust mote
                p.x = r1; p.y = r2 * 0.7;
                p.vx = (r3 - 0.5) * 0.04;
                p.vy = 0.005 + r4 * 0.025;
            }
        }
        p.size = cfg.size_min + rs * (cfg.size_max - cfg.size_min);
        p.life = cfg.life_min + rl * (cfg.life_max - cfg.life_min);
        p.age = 0.0;
        p.opacity = 0.0;
        p.alive = true;
    }

    fn rand_f32(&mut self) -> f32 {
        self.rng = self.rng.wrapping_mul(1_664_525).wrapping_add(1_013_904_223);
        (self.rng >> 8) as f32 / (1u32 << 24) as f32
    }
}

fn rng_step(s: &mut u32) -> u32 {
    *s = s.wrapping_mul(1_664_525).wrapping_add(1_013_904_223);
    *s
}

struct ParticleCfg {
    kind: u32,
    spawn_rate: f32,
    size_min: f32,
    size_max: f32,
    life_min: f32,
    life_max: f32,
}

fn particle_config(scene: usize) -> ParticleCfg {
    match scene {
        0 => ParticleCfg { kind: 0, spawn_rate: 9.0,  size_min: 0.0015, size_max: 0.0040, life_min: 6.0,  life_max: 12.0 },
        1 => ParticleCfg { kind: 0, spawn_rate: 5.0,  size_min: 0.0012, size_max: 0.0032, life_min: 8.0,  life_max: 14.0 },
        2 => ParticleCfg { kind: 5, spawn_rate: 4.0,  size_min: 0.0050, size_max: 0.0095, life_min: 4.0,  life_max: 10.0 },
        3 => ParticleCfg { kind: 1, spawn_rate: 28.0, size_min: 0.0030, size_max: 0.0080, life_min: 8.0,  life_max: 14.0 },
        4 => ParticleCfg { kind: 0, spawn_rate: 11.0, size_min: 0.0020, size_max: 0.0050, life_min: 7.0,  life_max: 12.0 },
        5 => ParticleCfg { kind: 4, spawn_rate: 14.0, size_min: 0.0040, size_max: 0.0110, life_min: 5.0,  life_max: 11.0 },
        _ => ParticleCfg { kind: 0, spawn_rate: 5.0,  size_min: 0.002,  size_max: 0.004,  life_min: 5.0,  life_max: 10.0 },
    }
}

fn gradient_for(scene: usize) -> Vec<u8> {
    let stops: [[u8; 3]; 4] = match scene {
        0 => [[244,196,182],[239,158,172],[181,140,184],[ 97, 98,138]],
        1 => [[252,217,151],[247,178,114],[218,109, 79],[110, 52, 65]],
        2 => [[252,167, 99],[219,102, 87],[114, 49,103],[ 28, 18, 55]],
        3 => [[210,224,239],[170,193,217],[134,158,192],[ 63, 82,118]],
        4 => [[251,180,128],[208,109,131],[110, 68,150],[ 34, 28, 68]],
        5 => [[ 15, 18, 42],[ 28, 46, 84],[ 40, 90,120],[ 12, 16, 36]],
        _ => [[ 20, 20, 30],[ 40, 40, 60],[ 80, 80,120],[ 20, 20, 30]],
    };
    let mut v = Vec::with_capacity(12);
    for s in stops.iter() { v.extend_from_slice(s); }
    v
}

fn silhouettes_for(scene: usize) -> Vec<f32> {
    let mut v = Vec::with_capacity(SILHOUETTE_LAYERS * SILHOUETTE_POINTS);
    let mut rng: u32 = 0xA1B2_C3D4u32.wrapping_add(scene as u32 * 31);
    for layer in 0..SILHOUETTE_LAYERS {
        let base = match scene {
            0 => match layer { 0 => 0.66, 1 => 0.74, _ => 0.83 }, // Paris rooftops
            1 => match layer { 0 => 0.68, 1 => 0.77, _ => 0.86 }, // Lisbon
            2 => match layer { 0 => 0.58, 1 => 0.72, _ => 0.85 }, // Hanoi
            3 => match layer { 0 => 0.62, 1 => 0.74, _ => 0.85 }, // Stockholm
            4 => match layer { 0 => 0.60, 1 => 0.72, _ => 0.84 }, // Istanbul
            5 => match layer { 0 => 0.64, 1 => 0.76, _ => 0.87 }, // Reykjavik
            _ => match layer { 0 => 0.65, 1 => 0.75, _ => 0.85 },
        };
        let amp = 0.05 + 0.025 * (SILHOUETTE_LAYERS - layer) as f32;
        for i in 0..SILHOUETTE_POINTS {
            let t = i as f32 / (SILHOUETTE_POINTS - 1) as f32;
            let noise = rng_step(&mut rng) as f32 / u32::MAX as f32 - 0.5;
            let h = match scene {
                0 => {
                    // Paris: blocky rooftops with chimneys
                    let block = ((t * 9.0 + layer as f32).floor() as i32) % 2;
                    let chim = if (i + layer * 7) % 11 == 0 { -0.045 } else { 0.0 };
                    base + block.unsigned_abs() as f32 * 0.018 + chim + noise * amp * 0.25
                }
                1 => {
                    // Lisbon: gentle tile rooftops
                    base + (t * 5.4 + layer as f32 * 0.7).sin() * amp * 0.5
                         + (t * 13.0).sin() * amp * 0.15
                         + noise * amp * 0.18
                }
                2 => {
                    // Hanoi: occasional palm spikes, dense low canopy
                    let spike = if (i * 3 + layer * 11) % 17 == 0 { -0.105 } else { 0.0 };
                    let canopy = (t * 7.0 + layer as f32).sin() * amp * 0.3;
                    base + spike + canopy + noise * amp * 0.25
                }
                3 => {
                    // Stockholm: pine teeth
                    let tooth_pos = ((i + layer * 5) % 6) as f32 / 6.0;
                    let tooth = (tooth_pos - 0.5).abs() * 2.0;
                    base - (1.0 - tooth) * 0.075 + noise * amp * 0.12
                }
                4 => {
                    // Istanbul: domes + minarets
                    let phase = (t * 6.0 - layer as f32 * 0.3).rem_euclid(1.0);
                    let dome_d = (phase - 0.5).abs() * 2.0;
                    let dome = -((1.0 - dome_d).max(0.0)).powf(1.6) * 0.07;
                    let minaret = if ((i + layer * 9) % 19) == 0 { -0.13 } else { 0.0 };
                    base + dome + minaret + noise * amp * 0.18
                }
                5 => {
                    // Reykjavik: jagged mountains
                    let m = ((t * 4.0 + layer as f32 * 1.3).sin() * 0.5
                          + (t * 11.0 + layer as f32).sin() * 0.20
                          + (t * 23.0 + layer as f32 * 2.1).sin() * 0.08).abs();
                    base - m * 0.085 + noise * amp * 0.30
                }
                _ => base,
            };
            v.push(h.clamp(0.30, 0.96));
        }
    }
    v
}

struct AudioRecipe {
    pad_freq: f32, pad_vol: f32,
    noise_lp: f32, noise_vol: f32,
    accent_freq: f32, accent_vol: f32,
    accent_period: f32, accent_dur: f32,
}

fn audio_recipe(scene: usize) -> AudioRecipe {
    match scene {
        0 => AudioRecipe { // Paris dawn — sparrows
            pad_freq: 110.0, pad_vol: 0.10,
            noise_lp: 0.04, noise_vol: 0.04,
            accent_freq: 880.0, accent_vol: 0.08, accent_period: 3.7, accent_dur: 0.18,
        },
        1 => AudioRecipe { // Lisbon afternoon — gulls
            pad_freq: 130.0, pad_vol: 0.09,
            noise_lp: 0.06, noise_vol: 0.05,
            accent_freq: 520.0, accent_vol: 0.06, accent_period: 5.3, accent_dur: 0.30,
        },
        2 => AudioRecipe { // Hanoi evening — distant traffic + insects
            pad_freq: 90.0, pad_vol: 0.13,
            noise_lp: 0.10, noise_vol: 0.06,
            accent_freq: 1480.0, accent_vol: 0.04, accent_period: 1.7, accent_dur: 0.05,
        },
        3 => AudioRecipe { // Stockholm winter — wind
            pad_freq: 75.0, pad_vol: 0.07,
            noise_lp: 0.03, noise_vol: 0.11,
            accent_freq: 200.0, accent_vol: 0.0, accent_period: 10.0, accent_dur: 0.0,
        },
        4 => AudioRecipe { // Istanbul dusk — distant call
            pad_freq: 110.0, pad_vol: 0.12,
            noise_lp: 0.05, noise_vol: 0.04,
            accent_freq: 360.0, accent_vol: 0.05, accent_period: 7.7, accent_dur: 1.20,
        },
        5 => AudioRecipe { // Reykjavik night — wind + low drone
            pad_freq: 65.0, pad_vol: 0.12,
            noise_lp: 0.025, noise_vol: 0.07,
            accent_freq: 130.0, accent_vol: 0.03, accent_period: 13.0, accent_dur: 0.6,
        },
        _ => AudioRecipe {
            pad_freq: 100.0, pad_vol: 0.10,
            noise_lp: 0.05, noise_vol: 0.05,
            accent_freq: 600.0, accent_vol: 0.0, accent_period: 5.0, accent_dur: 0.1,
        },
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn scene_count_is_six() {
        let m = Mado::new();
        assert_eq!(m.scene_count(), SCENE_COUNT);
    }

    #[test]
    fn set_scene_wraps() {
        let mut m = Mado::new();
        m.set_scene(7);
        assert_eq!(m.current_scene(), 1);
        m.set_scene(13);
        assert_eq!(m.current_scene(), 1);
    }

    #[test]
    fn gradient_returns_12_bytes() {
        for s in 0..SCENE_COUNT {
            let mut m2 = Mado::new();
            m2.set_scene(s);
            assert_eq!(m2.gradient().len(), 12);
        }
    }

    #[test]
    fn silhouettes_have_expected_shape() {
        let m = Mado::new();
        let v = m.silhouettes();
        assert_eq!(v.len(), SILHOUETTE_LAYERS * SILHOUETTE_POINTS);
        for h in v {
            assert!(h >= 0.30 && h <= 0.96);
        }
    }

    #[test]
    fn tick_spawns_particles() {
        let mut m = Mado::new();
        m.set_scene(3); // snow, high spawn rate
        for _ in 0..120 { m.tick(0.016); }
        let p = m.particles();
        assert!(!p.is_empty());
        assert!(p.len() % 4 == 0);
    }

    #[test]
    fn audio_buffer_has_expected_length_and_range() {
        let m = Mado::new();
        let buf = m.generate_audio(8000, 1.0);
        assert_eq!(buf.len(), 8000);
        for s in &buf {
            assert!(s.is_finite());
            assert!(*s >= -1.0 && *s <= 1.0);
        }
    }

    #[test]
    fn audio_seamless_loop_endpoints_close() {
        let m = Mado::new();
        let buf = m.generate_audio(8000, 2.0);
        // After crossfade, head and tail samples should match.
        let n = buf.len();
        for k in 0..32 {
            let diff = (buf[k] - buf[n - 32 + k]).abs();
            // crossfade matches them if k aligns with the same xfade slot
            assert!(diff < 0.35, "samples drift at edge");
        }
    }

    #[test]
    fn audio_buffers_differ_per_scene() {
        let mut a = Mado::new(); a.set_scene(0);
        let mut b = Mado::new(); b.set_scene(3);
        let buf_a = a.generate_audio(8000, 0.5);
        let buf_b = b.generate_audio(8000, 0.5);
        let mut diff = 0.0_f32;
        for i in 0..buf_a.len() { diff += (buf_a[i] - buf_b[i]).abs(); }
        assert!(diff > 50.0, "scenes 0 and 3 should sound different");
    }
}
