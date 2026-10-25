import { NAME_H, NAME_LETTERS, NAME_W } from "@/lib/nameGlyphs";
import { PALETTE } from "@/lib/palette";

// The pen takes a new accent for each letter.
const PEN = [PALETTE.pink, PALETTE.violet, PALETTE.orange, PALETTE.cyan, PALETTE.yellow];

/**
 * The hero name as real letter outlines. On load a "pen" traces each outline in an accent color
 * (stroke-dashoffset on the actual glyph path), then the letter fills in black. Pure CSS: it runs
 * once, needs no JavaScript, and is skipped under prefers-reduced-motion.
 */
export function HeroName() {
  return (
    <h1 className="name-h1">
      <span className="sr-only">Aimilianos Kourpas</span>
      <svg viewBox={`0 0 ${NAME_W} ${NAME_H}`} aria-hidden="true" focusable="false" className="name-svg">
        {NAME_LETTERS.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength={1}
            className="glyph"
            style={{ "--i": i, "--pen": PEN[i % PEN.length] } as React.CSSProperties}
          />
        ))}
      </svg>
    </h1>
  );
}
