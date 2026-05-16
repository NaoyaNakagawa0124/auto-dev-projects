// Default settings + validation. No Chrome API references.

export const DEFAULTS = {
  pattern: "f448",            // box / r478 / f448
  enabled: true,
  position: "bottom-right",    // bottom-right | bottom-left | top-right | top-left
  dot_size: 28,                // 18..48
  hide_on_fullscreen: true,
  hide_on_video: true,
  show_label: false,
};

export function normalize(input = {}) {
  const out = { ...DEFAULTS, ...input };
  if (!["box", "r478", "f448"].includes(out.pattern)) out.pattern = DEFAULTS.pattern;
  if (!["bottom-right", "bottom-left", "top-right", "top-left"].includes(out.position)) {
    out.position = DEFAULTS.position;
  }
  out.dot_size = Math.max(18, Math.min(48, Number(out.dot_size) || DEFAULTS.dot_size));
  out.enabled = !!out.enabled;
  out.hide_on_fullscreen = !!out.hide_on_fullscreen;
  out.hide_on_video = !!out.hide_on_video;
  out.show_label = !!out.show_label;
  return out;
}
