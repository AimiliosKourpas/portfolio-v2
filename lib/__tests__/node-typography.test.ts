import { describe, expect, it } from "vitest";
import { sampleLattice } from "../nodeSampler";
import { RIPPLE, sampleRipple } from "../ripple";

const out = () => ({ dx: 0, dy: 0, glow: 0 });

describe("sampleLattice", () => {
  it("returns no nodes for an empty mask", () => {
    const f = sampleLattice(new Uint8ClampedArray(200 * 100), 200, 100, 1, 8, 3);
    expect(f.count).toBe(0);
  });

  it("fills a solid rect at roughly the hex-lattice density, inside bounds", () => {
    const w = 400;
    const h = 200;
    const f = sampleLattice(new Uint8ClampedArray(w * h).fill(255), w, h, 1, 8, 3);
    const expected = (w * h) / (8 * 8 * 0.866);
    expect(f.count).toBeGreaterThan(expected * 0.85);
    expect(f.count).toBeLessThan(expected * 1.15);
    for (let i = 0; i < f.count; i++) {
      expect(f.x[i]).toBeGreaterThanOrEqual(0);
      expect(f.x[i]).toBeLessThanOrEqual(w);
      expect(f.y[i]).toBeLessThanOrEqual(h);
      expect(f.r[i]).toBeLessThanOrEqual(3);
    }
  });

  it("only keeps nodes on the filled half", () => {
    const w = 200;
    const h = 100;
    const a = new Uint8ClampedArray(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < 100; x++) a[y * w + x] = 255;
    const f = sampleLattice(a, w, h, 1, 8, 3);
    expect(f.count).toBeGreaterThan(0);
    for (let i = 0; i < f.count; i++) expect(f.x[i]).toBeLessThan(110);
  });
});

describe("sampleRipple", () => {
  it("is inert before the start and after the end", () => {
    expect(sampleRipple(50, 0, 0, 0, -0.1, out()).glow).toBe(0);
    const late = sampleRipple(50, 0, 0, 0, RIPPLE.duration + 0.1, out());
    expect(late.glow).toBe(0);
    expect(late.dx).toBe(0);
  });

  it("never exceeds the amplitude and pushes outward", () => {
    for (let t = 0; t <= RIPPLE.duration; t += 0.02) {
      for (let d = 0; d < 1200; d += 7) {
        const s = sampleRipple(d, 0, 0, 0, t, out());
        expect(Math.hypot(s.dx, s.dy)).toBeLessThanOrEqual(RIPPLE.amplitude + 1e-6);
        expect(s.dx).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
