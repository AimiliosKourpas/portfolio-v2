// Tiny node illustrations. Each draws in a 100 x 80 design space; the caller
// scales the context. Every layer is a flat color: nodes on a layer take its
// color, and later layers sit on top of earlier ones. Keep shapes chunky: the
// lattice is only ~24 columns wide.

import { INK, PALETTE } from "./palette";

export const ART_W = 100;
export const ART_H = 80;

export type Layer = { color: string; draw: (c: CanvasRenderingContext2D) => void };
export type Illustration = Layer[];

const rr = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fill();
};

/** BirthDiary: a two-tier cake with a lit candle. */
const cake: Illustration = [
  { color: PALETTE.pink, draw: (c) => rr(c, 4, 50, 92, 28, 7) },
  { color: PALETTE.cyan, draw: (c) => rr(c, 20, 30, 60, 17, 6) },
  { color: PALETTE.violet, draw: (c) => c.fillRect(44, 14, 12, 15) },
  {
    color: PALETTE.orange,
    draw: (c) => {
      c.beginPath();
      c.moveTo(50, 0);
      c.bezierCurveTo(64, 7, 62, 17, 50, 17);
      c.bezierCurveTo(38, 17, 36, 7, 50, 0);
      c.fill();
    },
  },
];

/** Sorting Visualizer: bars mid-sort, each in its own color. */
const barColors = [PALETTE.cyan, PALETTE.pink, PALETTE.yellow, PALETTE.green, PALETTE.violet, PALETTE.orange];
const barHeights = [30, 52, 22, 70, 42, 60];
const bars: Illustration = barColors.map((color, i) => ({
  color,
  draw: (c) => rr(c, 3 + i * 16, 78 - barHeights[i], 13, barHeights[i], 4),
}));

/** Pathfinding Visualizer: a stepped route from start to goal between walls. */
const path: Illustration = [
  {
    color: INK,
    draw: (c) => {
      c.fillRect(56, 52, 18, 18); // walls
      c.fillRect(6, 24, 18, 18);
      c.fillRect(30, 4, 14, 14);
    },
  },
  {
    color: PALETTE.pink,
    draw: (c) => {
      c.lineWidth = 12;
      c.lineJoin = "round";
      c.lineCap = "round";
      c.strokeStyle = "#000";
      c.beginPath();
      c.moveTo(14, 68);
      c.lineTo(44, 68);
      c.lineTo(44, 40);
      c.lineTo(78, 40);
      c.lineTo(78, 20);
      c.stroke();
    },
  },
  { color: PALETTE.cyan, draw: (c) => { c.beginPath(); c.arc(12, 68, 11, 0, Math.PI * 2); c.fill(); } },
  { color: PALETTE.orange, draw: (c) => rr(c, 66, 0, 26, 26, 7) },
];

/** GreekBERT: lines of text, each tagged with a sentiment color. */
const text: Illustration = [
  {
    color: INK,
    draw: (c) => {
      rr(c, 30, 6, 64, 11, 5.5);
      rr(c, 30, 34, 44, 11, 5.5);
      rr(c, 30, 62, 56, 11, 5.5);
    },
  },
  { color: PALETTE.green, draw: (c) => { c.beginPath(); c.arc(11, 11.5, 9, 0, Math.PI * 2); c.fill(); } },
  { color: PALETTE.cyan, draw: (c) => { c.beginPath(); c.arc(11, 39.5, 9, 0, Math.PI * 2); c.fill(); } },
  { color: PALETTE.pink, draw: (c) => { c.beginPath(); c.arc(11, 67.5, 9, 0, Math.PI * 2); c.fill(); } },
];

export const illustrations = { cake, bars, path, text } as const;
export type IllustrationName = keyof typeof illustrations;
