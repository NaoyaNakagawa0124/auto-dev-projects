// 星のグロー＋twinkle シェーダ
shader_type canvas_item;

uniform vec4 core_color : source_color = vec4(1.0, 0.96, 0.85, 1.0);
uniform vec4 halo_color : source_color = vec4(0.9, 0.85, 0.6, 0.8);
uniform float intensity : hint_range(0.0, 4.0) = 1.0;
uniform float twinkle_speed : hint_range(0.0, 4.0) = 1.0;

void fragment() {
    vec2 c = UV - vec2(0.5);
    float d = length(c);

    // base circular falloff
    float core = smoothstep(0.18, 0.0, d);
    float halo = smoothstep(0.50, 0.10, d) * 0.6;
    // spike rays
    float ray_h = max(0.0, 1.0 - abs(c.y) * 16.0) * (1.0 - smoothstep(0.0, 0.45, abs(c.x)));
    float ray_v = max(0.0, 1.0 - abs(c.x) * 16.0) * (1.0 - smoothstep(0.0, 0.45, abs(c.y)));
    float rays = max(ray_h, ray_v) * 0.5;

    // twinkle
    float tw = 0.85 + 0.15 * sin(TIME * 3.0 * twinkle_speed + UV.x * 12.0);

    vec3 col = mix(halo_color.rgb, core_color.rgb, core);
    float alpha = clamp((core + halo + rays) * intensity * tw, 0.0, 1.0);
    COLOR = vec4(col, alpha);
}
