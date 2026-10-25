// Large node artwork for the Background section. Drawn in a 100 x 160 design space and fitted
// ("contain") into whatever box the section gives it. Later layers sit on top of earlier ones.

import { INK, PALETTE } from "./palette";
import type { Layer } from "./illustrations";

export const BG_W = 100;
export const BG_H = 160;

const circle = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
};

export const backgroundArt: Layer[] = [
  // Top cluster: a dome and a circle that just overlap.
  {
    color: PALETTE.cyan,
    draw: (c) => {
      c.beginPath();
      c.moveTo(4, 54);
      c.arc(30, 54, 26, Math.PI, Math.PI * 2);
      c.closePath();
      c.fill();
    },
  },
  { color: PALETTE.pink, draw: (c) => circle(c, 74, 26, 20) },
  { color: PALETTE.green, draw: (c) => { c.beginPath(); c.roundRect(6, 6, 32, 11, 5.5); c.fill(); } },
  // Middle cluster: the big circle pair with its offset registration ring.
  { color: PALETTE.cyan, draw: (c) => circle(c, 40, 96, 30) },
  { color: PALETTE.yellow, draw: (c) => circle(c, 68, 122, 24) },
  { color: PALETTE.orange, draw: (c) => circle(c, 85, 92, 7) },
  {
    color: PALETTE.violet,
    draw: (c) => {
      c.beginPath(); // arch: flat base, round top
      c.moveTo(8, 160);
      c.lineTo(8, 125);
      c.arc(23, 125, 15, Math.PI, Math.PI * 2);
      c.lineTo(38, 160);
      c.closePath();
      c.fill();
    },
  },
  {
    color: PALETTE.pink,
    draw: (c) => {
      c.beginPath(); // quarter circle tucked into the bottom-right corner
      c.moveTo(100, 160);
      c.arc(100, 160, 46, Math.PI, Math.PI * 1.5);
      c.closePath();
      c.fill();
    },
  },
  {
    color: INK,
    draw: (c) => {
      c.lineWidth = 2.6;
      c.strokeStyle = "#000";
      c.beginPath();
      c.arc(44, 100, 36, 0, Math.PI * 2);
      c.stroke();
    },
  },
];
