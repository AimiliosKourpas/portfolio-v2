// "AK" monogram for the favicon and touch icon: Titan One outlines (SIL OFL 1.1, same face as the
// hero name) on an ink tile, with two node dots in the free corners. Outlines are drawn at a
// 100 px em with the baseline at y = 0; each is scaled to fit a square cell and centred in it.
import { INK, PALETTE } from "./palette";

type Outline = { d: string; x1: number; x2: number; y1: number; y2: number };

const A: Outline = { d: "M31.6-5.1Q31.4-2.2 28.6-1.1Q25.7 0 18.3 0Q10.9 0 6.0-1.4Q1-2.7 1-4.8L1-4.8Q1-7.2 9.9-35.5Q18.8-63.7 20.1-68L20.1-68Q20.6-69.3 28.2-70.2Q35.7-71 44.4-71Q53-71 53.9-68L53.9-68Q72.8-5.2 72.8-4.2Q72.8-3.2 71.6-2.2L71.6-2.2Q68.8 0 60.5 0L60.5 0Q42.8 0 42.4-4.2L42.4-4.2L41.7-10.7L32.1-10.7L31.6-5.1ZM34.2-29.7L39.6-29.7L38.1-47.7L35.9-47.7L34.2-29.7Z", x1: 1, x2: 72.8, y1: -71, y2: 0 };
const K: Outline = { d: "M31.9-3.1Q31.9-1.8 25.8-1Q19.6-0.2 13.5-0.2Q7.4-0.2 5.7-0.9Q4-1.6 4-3.1L4-3.1L4-64.4Q4-67 9.7-69Q15.3-71 22.7-71L22.7-71Q28.8-71 30.6-68.6L30.6-68.6Q31.9-66.9 31.9-65.5L31.9-65.5L31.9-49L32.7-49Q32.7-49.5 35.7-57.3L35.7-57.3Q41.4-72 44-72L44-72Q48.9-72 57.8-69.1L57.8-69.1Q62.1-67.7 65.2-65.0Q68.3-62.4 68.3-59.2L68.3-59.2Q68.3-57.2 64.3-51.5Q60.2-45.7 52-36.1L52-36.1Q53.9-34.1 56.8-31Q59.7-27.9 64.5-21.8Q69.4-15.6 69.4-13Q69.4-10.4 64.7-7.0Q60-3.5 54.7-1.4Q49.4 0.8 46.8 0.8L46.8 0.8Q45.1 0.8 42.2-4.4Q39.2-9.5 35-19.8L35-19.8L31.9-16.1L31.9-3.1Z", x1: 4, x2: 69.4, y1: -72, y2: 0.8 };

/** Scales an outline to `cell` units tall and centres it in the square cell whose top-left is (x, y). */
function glyph(o: Outline, x: number, y: number, cell: number, fill: string) {
  const s = cell / (o.y2 - o.y1);
  const w = (o.x2 - o.x1) * s;
  const tx = x + (cell - w) / 2 - o.x1 * s;
  const ty = y - o.y1 * s;
  return `<path d="${o.d}" fill="${fill}" transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})"/>`;
}

/** Square monogram as an SVG string on a 64-unit canvas. */
export function markSvg(): string {
  const cell = 27;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">`,
    `<rect width="64" height="64" rx="14" fill="${INK}"/>`,
    glyph(A, 6, 6, cell, PALETTE.pink),
    glyph(K, 31, 31, cell, PALETTE.yellow),
    `<circle cx="44.5" cy="19.5" r="7" fill="${PALETTE.cyan}"/>`,
    `<circle cx="19.5" cy="44.5" r="7" fill="${PALETTE.green}"/>`,
    `</svg>`,
  ].join("");
}

export function markDataUri(): string {
  return `data:image/svg+xml;base64,${Buffer.from(markSvg()).toString("base64")}`;
}
