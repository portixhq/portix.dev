---
title: "How to Print Images from JavaScript"
slug: "print-images"
description: "Load and decode images before browser printing, or convert them into monochrome raster bytes for compatible thermal printers."
quickAnswer: "For browser printing, place the image in semantic HTML, constrain it with print CSS, wait for image.decode(), and call window.print(). For raw thermal printing, draw the source to a canvas at the target dot width, flatten transparency, convert to black-and-white pixels, pack rows into bytes, and use a supported printer command through a trusted transport. Never assume PNG/JPEG bytes are valid ESC/POS payloads."
contentType: "guide"
category: "javascript"
primaryTopic: "printing images from JavaScript"
searchIntent: "how-to"
audience: "web developers"
difficulty: "intermediate"
status: "draft"
noindex: true
publishedAt: 2026-07-19
updatedAt: 2026-07-19
author:
  name: "Portix.One"
  type: "Organization"
cover:
  src: "/images/knowledge/print-images.svg"
  alt: "A source image being decoded and converted to a one-bit raster for printing"
entities:
  - "image.decode()"
  - "monochrome raster"
  - "dithering"
  - "Portix"
tags:
  - "javascript"
  - "images"
  - "Portix"
relatedArticles:
  - "esc-pos-images"
  - "print-html"
  - "print-qr-codes"
  - "print-raw-esc-pos"
references:
  - title: "Printing — CSS"
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing"
    publisher: "MDN"
    accessedAt: 2026-07-19
  - title: "HTMLImageElement.decode()"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode"
    publisher: "MDN"
    accessedAt: 2026-07-19
featured: false
---

JavaScript can print images as part of an HTML document or preprocess them into printer-native monochrome raster data. Choose based on whether browser-rendered layout or direct thermal-printer control is required.

## Browser-rendered image

```html
<img id="logo" src="/assets/logo.png" alt="Demo Store">
```

```css
@media print {
  #logo { width: 32mm; height: auto; print-color-adjust: exact; }
}
```

```js
const logo = document.querySelector("#logo");
if (!logo.complete) await logo.decode();
window.print();
```

Background printing can remain a user/browser setting. Do not communicate essential meaning only through background images.

## Thermal raster pipeline

```text
Decode → resize to printer dots → flatten → grayscale
→ threshold/dither → pack 8 pixels per byte → command payload
```

```js
function packMonochromeRow(bits) {
  const bytes = new Uint8Array(Math.ceil(bits.length / 8));
  bits.forEach((black, i) => {
    if (black) bytes[i >> 3] |= 0x80 >> (i & 7);
  });
  return bytes;
}
```

The selected printer command defines dimensions, limits, and row order.

## Image preparation rules

- Use the verified printable dot width.
- Preserve aspect ratio.
- Flatten transparency onto white.
- Avoid rescaling barcodes or QR codes with smoothing.
- Limit solid black coverage and oversized logos.
- Chunk only at valid command/row boundaries.
- Cache preprocessed static logos by printer profile.
- Test real thermal media and darkness/speed settings.

## Portix integration

```js
// [PORTIX DOCS REQUIRED]
// Use the verified image or raw-byte API and supported formats.
```

Required facts: accepted source formats, maximum dimensions/bytes, runtime conversion behavior, dithering, chunking, model profiles, and status/errors.

## Common failures

| Symptom | Check |
|---|---|
| Blank browser image | Decode/load/authentication/CORS |
| Distorted aspect | CSS or canvas dimensions |
| Black background | Transparency flattening |
| Scrambled thermal image | Bit order, stride, width fields |
| Partial image | Buffer/chunk/transport limit |
| Slow receipt | Excessive dimensions or density |

## Frequently asked questions

### Can I send base64 directly to a printer?

Not unless the receiving API explicitly accepts and decodes that format. A raw printer expects its device protocol.

### Should logos be stored in printer memory?

It can reduce transfer on supported devices, but provisioning, versioning, capacity, and write endurance must be managed.

### Can I print SVG?

Browsers can render SVG. Raw thermal paths must rasterize or use a documented vector capability.
