import { renderSocialImage, SOCIAL_ALT, SOCIAL_SIZE } from "@/lib/socialImage";

export const alt = SOCIAL_ALT;
export const size = SOCIAL_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderSocialImage();
}
