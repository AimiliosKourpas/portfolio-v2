import { ImageResponse } from "next/og";
import { NAME_H, NAME_LETTERS, NAME_W } from "./nameGlyphs";
import { INK, PALETTE } from "./palette";

export const SOCIAL_SIZE = { width: 1200, height: 630 };
export const SOCIAL_ALT = "Aimilianos Kourpas, Frontend Software Engineer";

const BG = "#a8b5e8";
const NAME_SCALE = 1.2;

/** 1200x630 share card: the hero name over the flat geometric shapes of the poster. */
export function renderSocialImage() {
  const { width, height } = SOCIAL_SIZE;
  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width, height, background: BG }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={960} cy={190} r={135} fill="#ffffff" fillOpacity={0.3} />
          <circle cx={1050} cy={650} r={250} fill={PALETTE.pink} fillOpacity={0.85} />
          <path d={`M${width} 0 L${width} 190 A190 190 0 0 1 ${width - 190} 0 Z`} fill={PALETTE.cyan} />
          <rect x={780} y={470} width={150} height={26} rx={13} fill={PALETTE.violet} />
          <circle cx={845} cy={395} r={34} fill={PALETTE.yellow} />
          <circle cx={1130} cy={350} r={20} fill={PALETTE.orange} />
          <circle cx={700} cy={560} r={14} fill={PALETTE.green} />
          {[0, 1, 2].flatMap((r) =>
            [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={1010 + c * 34} cy={72 + r * 34} r={6} fill={INK} />),
          )}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", position: "absolute", left: 84, top: 120 }}>
          <svg
            width={NAME_W * NAME_SCALE}
            height={NAME_H * NAME_SCALE}
            viewBox={`0 0 ${NAME_W} ${NAME_H}`}
          >
            {NAME_LETTERS.map((d, i) => (
              <path key={i} d={d} fill={INK} />
            ))}
          </svg>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 56,
              padding: "14px 30px",
              borderRadius: 999,
              background: INK,
              color: "#ffffff",
              fontSize: 36,
              letterSpacing: "0.01em",
            }}
          >
            Frontend Software Engineer
          </div>
        </div>
      </div>
    ),
    SOCIAL_SIZE,
  );
}
