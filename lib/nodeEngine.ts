import { sampleLattice } from "./nodeSampler";
import { RIPPLE, sampleRipple, type Ripple, type RippleParams, type RippleSample } from "./ripple";

import { INK, REVEAL } from "./palette";

export { INK };

/** What a caller hands the engine once it has rendered its alpha mask. */
export type Prepared = {
  w: number;
  h: number;
  mask: Uint8ClampedArray;
  maskW: number;
  maskH: number;
  maskScale: number;
  spacing: number;
  radius: number;
  /** Optional colored masks: a node on layer k is drawn in colors[k]; later layers win. */
  layers?: Uint8ClampedArray[];
  colors?: string[];
  /**
   * Optional order for the entrance color sweep: maps a node's home position (CSS px) to
   * `letterIndex + progress`. `waveColors[letterIndex]` is the accent that letter takes.
   */
  waveOrder?: (x: number, y: number) => number;
  waveColors?: string[];
};

export type WaveTiming = {
  /** Seconds between the sweep reaching one letter and the next. */
  stagger: number;
  /** Seconds a letter takes to go from ink to accent and back. */
  duration: number;
};

export type EngineOptions = {
  canvas: HTMLCanvasElement;
  /** Element that measures the artwork and receives pointer/keyboard events. */
  host: HTMLElement;
  trigger: HTMLElement;
  prepare: (host: HTMLElement) => Promise<Prepared | null>;
  pointerRadius: (w: number) => number;
  pointerPush: (w: number) => number;
  ripple: (w: number) => RippleParams;
  minNodes: number;
  maxNodes: number;
  /** Hero mode: nodes near the pointer or a ripple take these colors; otherwise they stay ink. */
  reveal?: boolean;
  /** Colors used by `reveal`; defaults to the full palette. */
  revealColors?: string[];
  onReady: () => void;
  /** Entrance color sweep; played once, skipped under reduced motion. */
  wave?: WaveTiming;
  /** Where a keyboard-triggered ripple starts, as fractions of w/h. */
  keyOrigin?: [number, number];
};

const K = 120;
const C = 2 * Math.sqrt(K);

/**
 * Shared node-typography engine: lattice of dots that springs back to its home
 * position. Pointer pushes nodes (bounded), a click launches a time-based
 * ripple. The rAF loop only runs while something is moving.
 */
export function createNodeEngine(opts: EngineOptions): () => void {
  const { canvas, host, trigger } = opts;
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let sim: {
    count: number;
    hx: Float32Array;
    hy: Float32Array;
    r: Float32Array;
    base: Uint8Array; // color index per node (0 = ink)
    reveal: Uint8Array; // palette index used when revealed
    palette: string[];
    dx: Float32Array;
    dy: Float32Array;
    vx: Float32Array;
    vy: Float32Array;
    w: number;
    h: number;
    rp: RippleParams;
    radius: number;
    push: number;
  } | null = null;
  let dpr = 1;
  let raf = 0;
  let last = 0;
  let disposed = false;
  let buildToken = 0;
  let waveStart: Float32Array | null = null; // seconds after waveT0 at which each node's letter lights up
  let waveLetter: Uint8Array | null = null;
  let waveRgb: [number, number, number][] = [];
  let waveT0 = 0;
  let waveTotal = 0;
  let wavePlayed = false;
  const WL = 6; // intensity steps while the sweep runs
  const waveStyle = new Map<number, string>();
  const ripples: Ripple[] = [];
  const pointer = { x: -9999, y: -9999, active: false };
  const sample: RippleSample = { dx: 0, dy: 0, glow: 0 };

  const build = async () => {
    const token = ++buildToken;
    const p = await opts.prepare(host);
    if (!p || disposed || token !== buildToken) return;

    const field = sampleLattice(p.mask, p.maskW, p.maskH, p.maskScale, p.spacing, p.radius);
    if (field.count < opts.minNodes || field.count > opts.maxNodes) return; // keep fallback visible

    const palette = [INK, ...(p.colors ?? [])];
    const base = new Uint8Array(field.count);
    if (p.layers) {
      for (let i = 0; i < field.count; i++) {
        const px = Math.round(field.x[i] * p.maskScale);
        const py = Math.round(field.y[i] * p.maskScale);
        for (let k = 0; k < p.layers.length; k++) {
          if (p.layers[k][py * p.maskW + px] > 127) base[i] = k + 1;
        }
      }
    }
    const revealColors = opts.revealColors ?? REVEAL;
    // Reveal color sweeps diagonally across the artwork instead of looking random.
    const reveal = new Uint8Array(field.count);
    const band = Math.max(40, p.w / 7);
    for (let i = 0; i < field.count; i++) {
      reveal[i] = Math.floor((field.x[i] + field.y[i] * 0.6) / band) % revealColors.length;
    }
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    sim = {
      count: field.count,
      hx: field.x,
      hy: field.y,
      r: field.r,
      base,
      reveal,
      palette,
      dx: new Float32Array(field.count),
      dy: new Float32Array(field.count),
      vx: new Float32Array(field.count),
      vy: new Float32Array(field.count),
      w: p.w,
      h: p.h,
      rp: opts.ripple(p.w),
      radius: opts.pointerRadius(p.w),
      push: opts.pointerPush(p.w),
    };
    if (opts.wave && p.waveOrder && p.waveColors && !wavePlayed && !reduced.matches) {
      wavePlayed = true;
      const start = new Float32Array(field.count);
      const letter = new Uint8Array(field.count);
      let max = 0;
      for (let i = 0; i < field.count; i++) {
        const o = p.waveOrder(field.x[i], field.y[i]);
        const idx = Math.floor(o);
        letter[i] = idx;
        start[i] = (idx + (o - idx) * 0.6) * opts.wave.stagger; // the front also moves a little within a letter
        if (start[i] > max) max = start[i];
      }
      waveRgb = p.waveColors.map((c) => [1, 3, 5].map((k) => parseInt(c.slice(k, k + 2), 16)) as [number, number, number]);
      waveStart = start;
      waveLetter = letter;
      waveTotal = max + opts.wave.duration;
      waveT0 = performance.now() / 1000;
    }
    canvas.width = Math.round(p.w * dpr);
    canvas.height = Math.round(p.h * dpr);
    canvas.style.width = `${p.w}px`;
    canvas.style.height = `${p.h}px`;
    opts.onReady();
    draw();
    if (waveStart) wake();
  };

  const draw = () => {
    if (!sim) return;
    const { count, hx, hy, r, dx, dy, w, h, base, reveal, palette, rp, radius } = sim;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const now = performance.now() / 1000;
    const colorOf = new Uint8Array(count);
    const size = new Float32Array(count);
    const revealR = radius * 0.6;
    const sweeping = waveStart !== null && waveLetter !== null;
    const wt = now - waveT0;
    const waveDur = opts.wave?.duration ?? 1;
    const lit: number[] = []; // nodes tinted by the sweep this frame, as (index, letter, step) triples
    for (let i = 0; i < count; i++) {
      let glow = 0;
      for (const rpl of ripples) {
        glow = Math.max(glow, sampleRipple(hx[i], hy[i], rpl.x, rpl.y, now - rpl.start, sample, rp).glow);
      }
      let c = base[i];
      let scale = 1 + 0.4 * glow;
      if (opts.reveal) {
        const hot = glow > 0.18;
        let near = 0;
        if (pointer.active) {
          const d = Math.hypot(hx[i] - pointer.x, hy[i] - pointer.y);
          if (d < revealR) near = 1 - d / revealR;
        }
        if (hot || near > 0.15) c = palette.length + reveal[i]; // index into the reveal colors after the palette
        scale += near * 0.35;
      }
      if (sweeping && c === 0) {
        const u = (wt - waveStart![i]) / waveDur;
        if (u > 0 && u < 1) {
          const step = Math.round(Math.sin(Math.PI * u) * WL);
          if (step > 0) {
            lit.push(i, waveLetter![i], step);
            c = 255; // drawn separately below
          }
        }
      }
      colorOf[i] = c;
      size[i] = r[i] * scale;
    }
    const all = opts.reveal ? [...palette, ...(opts.revealColors ?? REVEAL)] : palette;
    for (let k = 0; k < all.length; k++) {
      ctx.fillStyle = all[k];
      ctx.beginPath();
      let any = false;
      for (let i = 0; i < count; i++) {
        if (colorOf[i] !== k) continue;
        any = true;
        const x = hx[i] + dx[i];
        const y = hy[i] + dy[i];
        ctx.moveTo(x + size[i], y);
        ctx.arc(x, y, size[i], 0, Math.PI * 2);
      }
      if (any) ctx.fill();
    }
    if (lit.length) {
      // Group by letter and intensity so each group is one fill; mix ink toward the letter's accent.
      const groups = new Map<number, number[]>();
      for (let n = 0; n < lit.length; n += 3) {
        const key = lit[n + 1] * 16 + lit[n + 2];
        const g = groups.get(key);
        if (g) g.push(lit[n]);
        else groups.set(key, [lit[n]]);
      }
      for (const [key, nodes] of groups) {
        let style = waveStyle.get(key);
        if (!style) {
          const [ar, ag, ab] = waveRgb[Math.floor(key / 16)] ?? [23, 23, 23];
          const m = (key % 16) / WL;
          style = `rgb(${Math.round(23 + (ar - 23) * m)} ${Math.round(23 + (ag - 23) * m)} ${Math.round(23 + (ab - 23) * m)})`;
          waveStyle.set(key, style);
        }
        ctx.fillStyle = style;
        ctx.beginPath();
        for (const i of nodes) {
          const x = hx[i] + dx[i];
          const y = hy[i] + dy[i];
          ctx.moveTo(x + size[i], y);
          ctx.arc(x, y, size[i], 0, Math.PI * 2);
        }
        ctx.fill();
      }
    }
    if (sweeping && wt >= waveTotal) {
      waveStart = null; // finished: later frames take the plain path
      waveLetter = null;
    }
  };

  const tick = (ts: number) => {
    raf = 0;
    if (!sim || disposed) return;
    const dt = Math.min(0.033, last ? (ts - last) / 1000 : 0.016);
    last = ts;
    const now = performance.now() / 1000;
    while (ripples.length && now - ripples[0].start > sim.rp.duration) ripples.shift();

    const { count, hx, hy, dx, dy, vx, vy, rp, radius, push } = sim;
    let energy = 0;
    for (let i = 0; i < count; i++) {
      let tx = 0;
      let ty = 0;
      if (pointer.active) {
        const px = hx[i] - pointer.x;
        const py = hy[i] - pointer.y;
        const d = Math.hypot(px, py);
        if (d < radius && d > 0.001) {
          const f = 1 - d / radius;
          const amount = f * f * push;
          tx += (px / d) * amount;
          ty += (py / d) * amount;
        }
      }
      for (const rpl of ripples) {
        const s = sampleRipple(hx[i], hy[i], rpl.x, rpl.y, now - rpl.start, sample, rp);
        tx += s.dx;
        ty += s.dy;
      }
      vx[i] += (K * (tx - dx[i]) - C * vx[i]) * dt;
      vy[i] += (K * (ty - dy[i]) - C * vy[i]) * dt;
      dx[i] += vx[i] * dt;
      dy[i] += vy[i] * dt;
      energy += Math.abs(dx[i]) + Math.abs(dy[i]) + Math.abs(vx[i]) + Math.abs(vy[i]);
    }
    draw();
    if (pointer.active || ripples.length || waveStart || energy > count * 0.001) {
      raf = requestAnimationFrame(tick);
    } else {
      // Snap exactly home so nothing lingers off-lattice.
      dx.fill(0);
      dy.fill(0);
      vx.fill(0);
      vy.fill(0);
      last = 0;
      draw();
    }
  };
  const wake = () => {
    if (!raf && sim) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  };

  const local = (e: PointerEvent) => {
    const b = host.getBoundingClientRect();
    return { x: e.clientX - b.left, y: e.clientY - b.top };
  };
  const onMove = (e: PointerEvent) => {
    if (reduced.matches || e.pointerType === "touch") return;
    const p = local(e);
    pointer.x = p.x;
    pointer.y = p.y;
    pointer.active = true;
    wake();
  };
  const onLeave = () => {
    pointer.active = false;
    wake();
  };
  const fire = (x: number, y: number) => {
    if (reduced.matches || !sim) return;
    ripples.push({ x, y, start: performance.now() / 1000 });
    if (ripples.length > 3) ripples.shift();
    wake();
  };
  const onDown = (e: PointerEvent) => {
    const p = local(e);
    fire(p.x, p.y);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const [fx, fy] = opts.keyOrigin ?? [0.15, 0.5];
      fire(host.clientWidth * fx, host.clientHeight * fy);
    }
  };

  trigger.addEventListener("pointermove", onMove);
  trigger.addEventListener("pointerleave", onLeave);
  trigger.addEventListener("pointerdown", onDown);
  trigger.addEventListener("keydown", onKey);

  let resizeRaf = 0;
  let lastW = 0;
  const ro = new ResizeObserver((entries) => {
    const w = Math.round(entries[0].contentRect.width);
    if (w === lastW) return; // ignore height-only wobble (mobile toolbars)
    lastW = w;
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => void build());
  });
  ro.observe(host);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    cancelAnimationFrame(resizeRaf);
    ro.disconnect();
    trigger.removeEventListener("pointermove", onMove);
    trigger.removeEventListener("pointerleave", onLeave);
    trigger.removeEventListener("pointerdown", onDown);
    trigger.removeEventListener("keydown", onKey);
  };
}

export { RIPPLE };
