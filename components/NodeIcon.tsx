"use client";

import { useEffect, useRef } from "react";
import { createNodeEngine, type Prepared } from "@/lib/nodeEngine";
import { ART_H, ART_W, illustrations, type IllustrationName } from "@/lib/illustrations";
import { rippleFor } from "@/lib/ripple";

function render(draw: (c: CanvasRenderingContext2D) => void, mw: number, mh: number, s: number) {
  const off = document.createElement("canvas");
  off.width = mw;
  off.height = mh;
  const c = off.getContext("2d", { willReadFrequently: true });
  if (!c) return null;
  c.scale(s, s);
  c.fillStyle = "#000";
  draw(c);
  const data = c.getImageData(0, 0, mw, mh).data;
  const mask = new Uint8ClampedArray(mw * mh);
  for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3];
  return mask;
}

/** Small decorative node illustration; the row's text carries the meaning. */
export function NodeIcon({ name }: { name: IllustrationName }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const art = illustrations[name];

    const prepare = async (el: HTMLElement): Promise<Prepared | null> => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (!w) return null;
      const h = Math.round((w * ART_H) / ART_W);
      const maskScale = Math.min(3, Math.max(2, window.devicePixelRatio || 1));
      const maskW = Math.round(w * maskScale);
      const maskH = Math.round(h * maskScale);
      const k = (w / ART_W) * maskScale; // design units -> mask pixels
      const layers: Uint8ClampedArray[] = [];
      for (const l of art) {
        const m = render(l.draw, maskW, maskH, k);
        if (!m) return null;
        layers.push(m);
      }
      const mask = new Uint8ClampedArray(maskW * maskH);
      for (const m of layers) for (let i = 0; i < mask.length; i++) mask[i] = Math.max(mask[i], m[i]);
      const spacing = Math.max(3, w / 24);
      return { w, h, mask, maskW, maskH, maskScale, spacing, radius: spacing * 0.46, layers, colors: art.map((l) => l.color) };
    };

    return createNodeEngine({
      canvas,
      host,
      trigger: host,
      prepare,
      pointerRadius: (w) => w * 0.45,
      pointerPush: (w) => w * 0.05,
      ripple: rippleFor,
      minNodes: 40,
      maxNodes: 1500,
      onReady: () => {
        host.dataset.nodes = "ready";
      },
    });
  }, [name]);

  return (
    <div ref={hostRef} className="node-icon" data-nodes="pending" aria-hidden="true">
      <canvas ref={canvasRef} className="node-icon-canvas" />
    </div>
  );
}
