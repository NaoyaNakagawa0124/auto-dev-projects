/**
 * Fluid Simulation Engine
 * Based on Jos Stam's "Stable Fluids" (1999) Navier-Stokes solver.
 * Optimized for real-time suminagashi rendering.
 */

class FluidSolver {
  constructor(n) {
    this.N = n;
    this.size = (n + 2) * (n + 2);
    this.dt = 0.1;
    this.diffusion = 0.0001;
    this.viscosity = 0.00001;

    // Velocity fields
    this.u = new Float32Array(this.size);
    this.v = new Float32Array(this.size);
    this.uPrev = new Float32Array(this.size);
    this.vPrev = new Float32Array(this.size);

    // Density fields (RGBA - 4 channels for colored ink)
    this.densityR = new Float32Array(this.size);
    this.densityG = new Float32Array(this.size);
    this.densityB = new Float32Array(this.size);
    this.densityA = new Float32Array(this.size);

    this.densityRPrev = new Float32Array(this.size);
    this.densityGPrev = new Float32Array(this.size);
    this.densityBPrev = new Float32Array(this.size);
    this.densityAPrev = new Float32Array(this.size);

    // Ink layers for suminagashi effect
    this.inkLayers = [];
  }

  IX(x, y) {
    return x + (this.N + 2) * y;
  }

  reset() {
    this.u.fill(0);
    this.v.fill(0);
    this.uPrev.fill(0);
    this.vPrev.fill(0);
    this.densityR.fill(0);
    this.densityG.fill(0);
    this.densityB.fill(0);
    this.densityA.fill(0);
    this.densityRPrev.fill(0);
    this.densityGPrev.fill(0);
    this.densityBPrev.fill(0);
    this.densityAPrev.fill(0);
    this.inkLayers = [];
  }

  addDensity(x, y, r, g, b, amount) {
    const idx = this.IX(x, y);
    this.densityR[idx] += r * amount;
    this.densityG[idx] += g * amount;
    this.densityB[idx] += b * amount;
    this.densityA[idx] = Math.min(1.0, this.densityA[idx] + amount);
  }

  addVelocity(x, y, amountX, amountY) {
    const idx = this.IX(x, y);
    this.u[idx] += amountX;
    this.v[idx] += amountY;
  }

  // Drop ink blob with Marangoni-like surface tension effect
  dropInk(cx, cy, radius, r, g, b, strength) {
    const N = this.N;
    const rad = Math.floor(radius);

    for (let i = -rad; i <= rad; i++) {
      for (let j = -rad; j <= rad; j++) {
        const x = Math.floor(cx) + i;
        const y = Math.floor(cy) + j;
        if (x < 1 || x > N || y < 1 || y > N) continue;

        const dist = Math.sqrt(i * i + j * j);
        if (dist > radius) continue;

        // Gaussian falloff for natural ink spread
        const falloff = Math.exp(-(dist * dist) / (radius * radius * 0.5));
        this.addDensity(x, y, r, g, b, strength * falloff);

        // Marangoni effect: push outward from center
        if (dist > 0.5) {
          const pushStrength = 0.3 * falloff * strength;
          const dx = i / dist;
          const dy = j / dist;
          this.addVelocity(x, y, dx * pushStrength, dy * pushStrength);
        }
      }
    }

    this.inkLayers.push({ cx, cy, radius, r, g, b, time: Date.now() });
  }

  setBounds(b, x) {
    const N = this.N;
    for (let i = 1; i <= N; i++) {
      x[this.IX(0, i)]     = b === 1 ? -x[this.IX(1, i)] : x[this.IX(1, i)];
      x[this.IX(N + 1, i)] = b === 1 ? -x[this.IX(N, i)] : x[this.IX(N, i)];
      x[this.IX(i, 0)]     = b === 2 ? -x[this.IX(i, 1)] : x[this.IX(i, 1)];
      x[this.IX(i, N + 1)] = b === 2 ? -x[this.IX(i, N)] : x[this.IX(i, N)];
    }
    x[this.IX(0, 0)]         = 0.5 * (x[this.IX(1, 0)] + x[this.IX(0, 1)]);
    x[this.IX(0, N + 1)]     = 0.5 * (x[this.IX(1, N + 1)] + x[this.IX(0, N)]);
    x[this.IX(N + 1, 0)]     = 0.5 * (x[this.IX(N, 0)] + x[this.IX(N + 1, 1)]);
    x[this.IX(N + 1, N + 1)] = 0.5 * (x[this.IX(N, N + 1)] + x[this.IX(N + 1, N)]);
  }

  diffuse(b, x, x0, diff, dt) {
    const N = this.N;
    const a = dt * diff * N * N;
    const c = 1 + 4 * a;

    for (let k = 0; k < 4; k++) {
      for (let i = 1; i <= N; i++) {
        for (let j = 1; j <= N; j++) {
          const idx = this.IX(i, j);
          x[idx] = (x0[idx] + a * (
            x[this.IX(i - 1, j)] +
            x[this.IX(i + 1, j)] +
            x[this.IX(i, j - 1)] +
            x[this.IX(i, j + 1)]
          )) / c;
        }
      }
      this.setBounds(b, x);
    }
  }

  advect(b, d, d0, u, v, dt) {
    const N = this.N;
    const dt0 = dt * N;

    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= N; j++) {
        let x = i - dt0 * u[this.IX(i, j)];
        let y = j - dt0 * v[this.IX(i, j)];

        x = Math.max(0.5, Math.min(N + 0.5, x));
        y = Math.max(0.5, Math.min(N + 0.5, y));

        const i0 = Math.floor(x);
        const i1 = i0 + 1;
        const j0 = Math.floor(y);
        const j1 = j0 + 1;

        const s1 = x - i0;
        const s0 = 1 - s1;
        const t1 = y - j0;
        const t0 = 1 - t1;

        d[this.IX(i, j)] =
          s0 * (t0 * d0[this.IX(i0, j0)] + t1 * d0[this.IX(i0, j1)]) +
          s1 * (t0 * d0[this.IX(i1, j0)] + t1 * d0[this.IX(i1, j1)]);
      }
    }
    this.setBounds(b, d);
  }

  project(u, v, p, div) {
    const N = this.N;
    const h = 1.0 / N;

    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= N; j++) {
        div[this.IX(i, j)] = -0.5 * h * (
          u[this.IX(i + 1, j)] - u[this.IX(i - 1, j)] +
          v[this.IX(i, j + 1)] - v[this.IX(i, j - 1)]
        );
        p[this.IX(i, j)] = 0;
      }
    }
    this.setBounds(0, div);
    this.setBounds(0, p);

    for (let k = 0; k < 4; k++) {
      for (let i = 1; i <= N; i++) {
        for (let j = 1; j <= N; j++) {
          p[this.IX(i, j)] = (div[this.IX(i, j)] +
            p[this.IX(i - 1, j)] +
            p[this.IX(i + 1, j)] +
            p[this.IX(i, j - 1)] +
            p[this.IX(i, j + 1)]
          ) / 4;
        }
      }
      this.setBounds(0, p);
    }

    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= N; j++) {
        u[this.IX(i, j)] -= 0.5 * (p[this.IX(i + 1, j)] - p[this.IX(i - 1, j)]) * N;
        v[this.IX(i, j)] -= 0.5 * (p[this.IX(i, j + 1)] - p[this.IX(i, j - 1)]) * N;
      }
    }
    this.setBounds(1, u);
    this.setBounds(2, v);
  }

  velocityStep() {
    const dt = this.dt;

    // Add forces
    for (let i = 0; i < this.size; i++) {
      this.u[i] += dt * this.uPrev[i];
      this.v[i] += dt * this.vPrev[i];
    }
    this.uPrev.fill(0);
    this.vPrev.fill(0);

    // Diffuse
    [this.u, this.uPrev] = [this.uPrev, this.u];
    this.diffuse(1, this.u, this.uPrev, this.viscosity, dt);

    [this.v, this.vPrev] = [this.vPrev, this.v];
    this.diffuse(2, this.v, this.vPrev, this.viscosity, dt);

    // Project
    this.project(this.u, this.v, this.uPrev, this.vPrev);

    // Advect
    [this.u, this.uPrev] = [this.uPrev, this.u];
    [this.v, this.vPrev] = [this.vPrev, this.v];
    this.advect(1, this.u, this.uPrev, this.uPrev, this.vPrev, dt);
    this.advect(2, this.v, this.vPrev, this.uPrev, this.vPrev, dt);

    // Project again
    this.project(this.u, this.v, this.uPrev, this.vPrev);

    // Damping for natural ink settling
    for (let i = 0; i < this.size; i++) {
      this.u[i] *= 0.999;
      this.v[i] *= 0.999;
    }
  }

  densityStep() {
    const dt = this.dt;
    const diff = this.diffusion;

    // Diffuse each channel
    [this.densityR, this.densityRPrev] = [this.densityRPrev, this.densityR];
    this.diffuse(0, this.densityR, this.densityRPrev, diff, dt);

    [this.densityG, this.densityGPrev] = [this.densityGPrev, this.densityG];
    this.diffuse(0, this.densityG, this.densityGPrev, diff, dt);

    [this.densityB, this.densityBPrev] = [this.densityBPrev, this.densityB];
    this.diffuse(0, this.densityB, this.densityBPrev, diff, dt);

    [this.densityA, this.densityAPrev] = [this.densityAPrev, this.densityA];
    this.diffuse(0, this.densityA, this.densityAPrev, diff, dt);

    // Advect each channel
    [this.densityR, this.densityRPrev] = [this.densityRPrev, this.densityR];
    this.advect(0, this.densityR, this.densityRPrev, this.u, this.v, dt);

    [this.densityG, this.densityGPrev] = [this.densityGPrev, this.densityG];
    this.advect(0, this.densityG, this.densityGPrev, this.u, this.v, dt);

    [this.densityB, this.densityBPrev] = [this.densityBPrev, this.densityB];
    this.advect(0, this.densityB, this.densityBPrev, this.u, this.v, dt);

    [this.densityA, this.densityAPrev] = [this.densityAPrev, this.densityA];
    this.advect(0, this.densityA, this.densityAPrev, this.u, this.v, dt);
  }

  step() {
    this.velocityStep();
    this.densityStep();
  }
}
