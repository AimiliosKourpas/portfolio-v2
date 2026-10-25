# Third-party logos and badges

Used only to identify the organisations named on the page (employer, university, certification issuers).
All marks remain the property of their owners. Assets were downloaded once from the official sites below
and are served locally from `public/logos/` (no hotlinking). Retrieved 2026-10-25.

| File | Organisation | Source URL | Notes |
|---|---|---|---|
| `desquared.svg` | Desquared S.A. (thinkdesquared.com, not the fashion brand Dsquared2) | https://cdn.prod.website-files.com/64621897363076eb1720080a/6551cfdf99137cd616e28be2_desquared-light-on-dark.svg | The light-on-dark logo used in the navbar of https://www.thinkdesquared.com. Original SVG, unmodified. |
| `unipi-crest.png` | University of Piraeus | https://www.unipi.gr/wp-content/uploads/2023/11/cropped-favicon.png | The university crest from the site's own icon (512 px original, resized to 256 px). unipi.gr serves no SVG; the wordmark PNG has white text only. |
| `microsoft-associate-badge.svg` | Microsoft | https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-associate-badge.svg | Official "Microsoft Certified: Associate" badge from Microsoft Learn. Same artwork as printed on the certificates. Original SVG, unmodified. |
| `algoexpert-icon.png` | AlgoExpert | https://assets.algoexpert.io/static/images/main-favicon.png | AlgoExpert's own app icon (site favicon). AlgoExpert publishes no per-certificate badge or vector logo, so the issuer icon is used instead of invented artwork. |
| `microsoft.png` | Microsoft | https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31 | Official Microsoft logo (216 x 46 PNG) as used in the microsoft.com header. Unmodified. |
| `algoexpert.png` | AlgoExpert | https://assets.algoexpert.io/static/images/ae-social-logo.png | Logo area cropped from AlgoExpert's official social image (navy background kept) and scaled to 520 px wide. |

## Facts and their sources
- Certifications: the five Microsoft certifications (SQL AI Developer Associate, Azure AI Cloud Developer
  Associate, Azure AI Apps and Agents Developer Associate, Azure Administrator Associate, Azure Data Scientist
  Associate), with earned and expiry dates, were provided by the owner from their Microsoft Learn profile.
  The Azure AI Cloud Developer and Apps and Agents dates match the certificate PDFs on file.
- No public per-credential verification URLs or credential IDs could be confirmed, so none are shown.
  The page links the public Microsoft Learn profile: https://learn.microsoft.com/en-us/users/aimilianoskourpas-4181/
- AlgoExpert Front End Expert (Jul 2025) and Programming Expert (May 2023) are from the CV. AlgoExpert publishes no
  per-certificate badge, so its official icon and wordmark are used.
- Status chips (Active / Expired) are computed in the browser from the expiry date.

## Hero name lettering
- `lib/nameGlyphs.ts` holds glyph outlines of "Aimilianos Kourpas" in Titan One by Rodrigo Fuenzalida
  (SIL Open Font License 1.1, https://fonts.google.com/specimen/Titan+One), converted to SVG path data
  with opentype.js. The outlines are traced and filled by CSS only (`stroke-dashoffset`), once on load.
