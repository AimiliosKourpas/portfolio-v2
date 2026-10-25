import { ImageResponse } from "next/og";
import { markDataUri } from "@/lib/brandMark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <img src={markDataUri()} width={64} height={64} alt="" />,
    size,
  );
}
