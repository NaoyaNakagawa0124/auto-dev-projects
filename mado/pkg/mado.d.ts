/* tslint:disable */
/* eslint-disable */

export class Mado {
    free(): void;
    [Symbol.dispose](): void;
    current_scene(): number;
    /**
     * Generate a seamless ambient mono buffer for the current scene.
     */
    generate_audio(sample_rate: number, seconds: number): Float32Array;
    /**
     * Generate a seamless ambient buffer for a given scene without touching active state.
     */
    generate_audio_for(scene: number, sample_rate: number, seconds: number): Float32Array;
    /**
     * 4 gradient stops × RGB → 12 bytes.
     */
    gradient(): Uint8Array;
    constructor();
    particle_kind(): number;
    /**
     * Active particles: [x, y, opacity, size] flat, repeated per particle.
     */
    particles(): Float32Array;
    scene_count(): number;
    set_scene(idx: number): void;
    silhouette_layers(): number;
    silhouette_points(): number;
    /**
     * SILHOUETTE_LAYERS × SILHOUETTE_POINTS heights in [0,1]. y=0 is sky top.
     */
    silhouettes(): Float32Array;
    tick(dt: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_mado_free: (a: number, b: number) => void;
    readonly mado_current_scene: (a: number) => number;
    readonly mado_generate_audio: (a: number, b: number, c: number) => [number, number];
    readonly mado_generate_audio_for: (a: number, b: number, c: number, d: number) => [number, number];
    readonly mado_gradient: (a: number) => [number, number];
    readonly mado_new: () => number;
    readonly mado_particle_kind: (a: number) => number;
    readonly mado_particles: (a: number) => [number, number];
    readonly mado_scene_count: (a: number) => number;
    readonly mado_set_scene: (a: number, b: number) => void;
    readonly mado_silhouette_layers: (a: number) => number;
    readonly mado_silhouette_points: (a: number) => number;
    readonly mado_silhouettes: (a: number) => [number, number];
    readonly mado_tick: (a: number, b: number) => void;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
