export type Ripple = { x: number; y: number; start: number };

export const RIPPLE = {
  /** Seconds the ring takes to cross the heading. */
  duration: 1.15,
  /** Ring travel speed in CSS px per second. */
  speed: 900,
  /** Gaussian half-width of the ring in px. */
  band: 46,
  /** Max outward displacement in px at the ring's crest. */
  amplitude: 9,
} as const;

export type RippleParams = {
  duration: number;
  speed: number;
  band: number;
  amplitude: number;
};

/** Ripple tuned for a small artwork `size` px wide (same shape, scaled). */
export function rippleFor(size: number): RippleParams {
  return { duration: 0.85, speed: size * 1.5, band: size * 0.16, amplitude: size * 0.035 };
}

export type RippleSample = { dx: number; dy: number; glow: number };

/**
 * Deterministic displacement + glow of a node at (px, py) for a ripple at time
 * `t` (seconds since the ripple started). Time-based and bounded, so letters can
 * never be flung apart: the largest offset is `RIPPLE.amplitude`.
 */
export function sampleRipple(
  px: number,
  py: number,
  ox: number,
  oy: number,
  t: number,
  out: RippleSample,
  params: RippleParams = RIPPLE,
): RippleSample {
  out.dx = 0;
  out.dy = 0;
  out.glow = 0;
  if (t < 0 || t > params.duration) return out;

  const ddx = px - ox;
  const ddy = py - oy;
  const dist = Math.hypot(ddx, ddy);
  const front = t * params.speed;
  const u = (dist - front) / params.band;
  const ring = Math.exp(-u * u);
  // Fade the whole effect out over the last 40% of the duration.
  const k = t / params.duration;
  const envelope = k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4;
  const w = ring * envelope;
  if (dist > 0.001) {
    out.dx = (ddx / dist) * params.amplitude * w;
    out.dy = (ddy / dist) * params.amplitude * w;
  }
  out.glow = w;
  return out;
}
