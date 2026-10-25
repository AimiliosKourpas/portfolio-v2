"use client";

import { useEffect, useRef } from "react";
import { createNodeEngine, type Prepared } from "@/lib/nodeEngine";
import { BG_H, BG_W, backgroundArt } from "@/lib/backgroundArt";
import { rippleFor } from "@/lib/ripple";

function render(draw: (c: CanvasRenderingContext2D) => void, mw: number, mh: number, s: number, ox: number, oy: number) {
  const off = document.createElement("canvas");
  off.width = mw;
  off.height = mh;
  const c = off.getContext("2d", { willReadFrequently: true });
  if (!c) return null;
  c.translate(ox, oy);
  c.scale(s, s);
  c.fillStyle = "#000";
  draw(c);
  const data = c.getImageData(0, 0, mw, mh).data;
  const mask = new Uint8ClampedArray(mw * mh);
  for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3];
  return mask;
}

/**
 * Decorative artwork built from the same node lattice as the hero. It reacts to the pointer and
 * to taps, then settles. No loop runs while idle, and reduced-motion keeps it still.
 */
export function BackgroundArt() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const prepare = async (el: HTMLElement): Promise<Prepared | null> => {
      const b = el.getBoundingClientRect();
      const w = Math.round(b.width);
      const h = Math.round(b.height);
      if (!w || !h) return null;
      const maskScale = Math.min(2, Math.max(1.5, window.devicePixelRatio || 1));
      const maskW = Math.round(w * maskScale);
      const maskH = Math.round(h * maskScale);
      // Fit the 100 x 110 design into the box, centered, with a margin.
      const pad = Math.min(w, h) * 0.06;
      const k = Math.min((w - pad * 2) / BG_W, (h - pad * 2) / BG_H);
      const ox = ((w - BG_W * k) / 2) * maskScale;
      const oy = ((h - BG_H * k) / 2) * maskScale;
      const layers: Uint8ClampedArray[] = [];
      for (const l of backgroundArt) {
        const m = render(l.draw, maskW, maskH, k * maskScale, ox, oy);
        if (!m) return null;
        layers.push(m);
      }
      const mask = new Uint8ClampedArray(maskW * maskH);
      for (const m of layers) for (let i = 0; i < mask.length; i++) mask[i] = Math.max(mask[i], m[i]);
      const spacing = Math.max(4.6, Math.min(w, h) / 62);
      return {
        w,
        h,
        mask,
        maskW,
        maskH,
        maskScale,
        spacing,
        radius: spacing * 0.44,
        layers,
        colors: backgroundArt.map((l) => l.color),
      };
    };

    return createNodeEngine({
      canvas,
      host,
      trigger: host,
      prepare,
      pointerRadius: (w) => w * 0.3,
      pointerPush: (w) => w * 0.035,
      ripple: (w) => rippleFor(w * 0.8),
      minNodes: 100,
      maxNodes: 9000,
      onReady: () => {
        host.dataset.nodes = "ready";
      },
    });
  }, []);

  return (
    <div ref={hostRef} className="art-panel" data-nodes="pending" aria-hidden="true">
      <canvas ref={canvasRef} className="art-canvas" />
    </div>
  );
}
