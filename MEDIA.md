# Media sources

All imagery and film are illustrative. No media is represented as documentary photography of STAR CLEANING Kuwait's employees, clients or completed projects.

## Kuwait governorate atlas

The atlas uses the [geoBoundaries Kuwait ADM1 gbOpen release](https://www.geoboundaries.org/api/current/gbOpen/KWT/ADM1/) ([pinned TopoJSON source](https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/9469f09/releaseData/gbOpen/KWT/ADM1/geoBoundaries-KWT-ADM1.topojson)). The dataset credits OpenStreetMap contributors and lists the [Open Database License 1.0](https://www.openstreetmap.org/copyright). The source and license are available at those links; visible OpenStreetMap attribution accompanies the map.

The locally rendered paths in `src/data/kuwaitBoundaries.ts` decode the source topology, project longitude and latitude to `x = 42 + (lon − 46.55) × 235` and `y = 457 − (lat − 28.52) × 270`, simplify shared arcs at 0.42 SVG units with Douglas–Peucker, and round to one decimal place. The pin anchors are representative locations inside the original and simplified governorate polygons, not branches or approved coverage areas. Callout leaders connect the numbered controls to those anchors, particularly where the coastal governorates sit close together.

## Generated photography

`public/img/cleaning-team.png` and `public/img/cleaning-detail.png` were generated through Netlify AI Gateway with the Google GenAI SDK and the `gemini-3.1-flash-image` model. These are static assets; no image-generation capability is shipped to visitors.

Hero prompt: Portrait 4:5 editorial commercial photograph of two male professional cleaners working in an elegant contemporary Kuwait villa. Main cleaner in a forest green polo, beige trousers and protective gloves carefully wipes a cream marble countertop. A second cleaner works on tall windows in the background. Bright warm daylight, ivory stone, plants, beige sofa, natural skin texture, uncluttered interior, no text or watermark.

Detail prompt: Landscape 4:3 editorial commercial photograph of a male cleaner in a forest green polo, beige trousers and protective gloves using professional upholstery extraction equipment on a cream sofa in a bright contemporary Kuwait home. Natural window light, warm neutral palette, realistic fabric texture, no text or watermark.

`public/img/star-cleaning-kuwait.jpg` is a 1200 × 630 JPEG crop of `cleaning-detail.png`, prepared for social sharing previews. It remains illustrative and does not depict a verified employee or completed project.

## Fonts

Cormorant Garamond, DM Sans and Noto Sans Arabic were downloaded from Google Fonts and self-hosted as WOFF2 subsets in `public/fonts` to remove external font requests. The original typefaces and variable weights were retained. Each family's SIL Open Font License is included alongside the font files.

## Stock photography

Downloaded from Unsplash for local delivery. Use is subject to the [Unsplash License](https://unsplash.com/license).

- `public/img/home.jpg`: https://images.unsplash.com/photo-1600210492486-724fe5c67fb0
- `public/img/office.jpg`: https://images.unsplash.com/photo-1497366811353-6870744d04b2
- `public/img/villa.jpg`: https://images.unsplash.com/photo-1613490493576-7fde63acd811

## Stock film

`public/video/carpet-care.mp4`: [POV of a handheld vacuum cleaner when cleaning a carpet](https://mixkit.co/free-stock-video/pov-of-a-handheld-vacuum-cleaner-when-cleaning-a-carpet-10340/), Mixkit item 10340. The source page designated this clip under the [Mixkit Stock Video Free License](https://mixkit.co/license/#videoFree), permitting commercial website use, when retrieved on 18 November 2026.

Download source: https://assets.mixkit.co/videos/10340/10340-720.mp4

The film has no spoken content and is presented as illustrative carpet-care footage with native playback controls.
