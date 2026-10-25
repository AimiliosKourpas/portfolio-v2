export type NodeField = {
  /** Home positions in CSS px. */
  x: Float32Array;
  y: Float32Array;
  /** Base dot radius per node (halftone: smaller on glyph edges). */
  r: Float32Array;
  count: number;
};

/**
 * Samples an alpha mask onto a staggered (hex) lattice, the way a halftone
 * screen would. A node is kept where local coverage passes `minCoverage`, and
 * its radius scales with coverage so letter edges stay crisp.
 *
 * `alpha` is a single-channel mask of `width * height` samples (0-255) at
 * `scale` mask pixels per CSS pixel.
 */
export function sampleLattice(
  alpha: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  scale: number,
  spacing: number,
  maxRadius: number,
  minCoverage = 0.4,
): NodeField {
  const rowH = spacing * 0.866;
  const cssW = width / scale;
  const cssH = height / scale;
  const cap = Math.ceil((cssW / spacing + 1) * (cssH / rowH + 1));
  const xs = new Float32Array(cap);
  const ys = new Float32Array(cap);
  const rs = new Float32Array(cap);
  const reach = Math.max(1, Math.round((spacing * scale) / 3));
  let n = 0;

  for (let row = 0, cy = rowH / 2; cy < cssH; row++, cy += rowH) {
    const offset = row % 2 ? spacing / 2 : 0;
    for (let cx = spacing / 2 + offset; cx < cssW; cx += spacing) {
      const px = Math.round(cx * scale);
      const py = Math.round(cy * scale);
      let sum = 0;
      let total = 0;
      for (let oy = -reach; oy <= reach; oy += reach) {
        for (let ox = -reach; ox <= reach; ox += reach) {
          const sx = px + ox;
          const sy = py + oy;
          total++;
          if (sx >= 0 && sy >= 0 && sx < width && sy < height) {
            sum += alpha[sy * width + sx] / 255;
          }
        }
      }
      const coverage = sum / total;
      if (coverage < minCoverage) continue;
      xs[n] = cx;
      ys[n] = cy;
      rs[n] = maxRadius * (0.55 + 0.45 * coverage);
      n++;
    }
  }

  return { x: xs.slice(0, n), y: ys.slice(0, n), r: rs.slice(0, n), count: n };
}
