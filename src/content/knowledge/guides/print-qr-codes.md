---
title: "How to Print QR Codes from JavaScript"
slug: "print-qr-codes"
description: "Generate a QR Code from validated data, render it at integer module dimensions, print through HTML or ESC/POS, and verify physical scanning."
quickAnswer: "Validate and minimize the QR payload, generate the matrix with a maintained library, render each module to an exact integer number of pixels or printer dots, preserve the quiet zone, and print without smoothing. For browser output, use SVG or canvas in a prepared print document. For compatible ESC/POS printers, use verified native QR commands or a precisely packed raster image through an authorized runtime."
contentType: "guide"
category: "javascript"
primaryTopic: "printing QR codes from JavaScript"
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
  src: "/images/knowledge/print-qr-codes.svg"
  alt: "A validated payload rendered as a QR Code matrix and printed on a receipt"
entities:
  - "QR Code"
  - "error correction"
  - "quiet zone"
  - "Portix"
tags:
  - "javascript"
  - "QR codes"
  - "Portix"
relatedArticles:
  - "esc-pos-qr-codes"
  - "print-images"
  - "print-raw-esc-pos"
references:
  - title: "GS ( k QR functions"
    url: "https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/gs_lparen_lk.html"
    publisher: "Epson"
    accessedAt: 2026-07-19
  - title: "GS1 Barcode Quality Checks"
    url: "https://support.gs1.org/support/solutions/articles/43000734141-what-should-i-check-to-ensure-good-quality-barcodes-"
    publisher: "GS1"
    accessedAt: 2026-07-19
featured: false
---

A printable QR Code needs a valid payload, integer-sized modules, a clear quiet zone, sufficient contrast, and physical verification. Generating a correct matrix is only the first step.

## 1. Define the payload

```js
const payload = new URL("https://example.com/r/8472").toString();
```

Use HTTPS, avoid secrets and unnecessary parameters, and version structured payloads.

## 2. Generate the matrix

Use a maintained QR encoder and pin/test its version. The exact library choice is project-specific; do not copy an unverified matrix algorithm into production.

Conceptual interface:

```js
const matrix = qrEncoder.encode(payload, { errorCorrection: "M" });
```

## 3. Render without smoothing

```js
const modulePixels = 6;
const quietModules = 4;
const size = (matrix.size + quietModules * 2) * modulePixels;

canvas.width = canvas.height = size;
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, size, size);
ctx.fillStyle = "black";
// Draw each true matrix cell at an integer coordinate.
```

Do not resize the finished canvas with fractional CSS dimensions.

## 4. Print

Browser path:

```js
await document.fonts.ready;
window.print();
```

Portix/native printer path:

```js
// [PORTIX DOCS REQUIRED]
// Submit a native QR instruction or verified monochrome raster payload.
```

## 5. Verify

Test printed output with target scanners at realistic distance, angle, light, paper curl, handling, and aging. A single phone scan is only a smoke test. Use formal verification when the applicable standard requires it.

## Common failures

| Problem | Check |
|---|---|
| QR appears blurry | Fractional scaling or smoothing |
| Clipped | Symbol plus quiet zone exceeds printable width |
| Wrong destination | Payload construction and visible fallback |
| Some scanners fail | Module size, contrast, damage, quiet zone |
| ESC/POS prints nothing | Unsupported function, length, model, or size |

## Frequently asked questions

### Should I use SVG or canvas?

Both can work in browser printing. Ensure exact module geometry, contrast, and asset readiness.

### Which error correction should I use?

Choose by expected damage, payload length, available width, and verification results—not maximum by default.

### Native QR or image?

Use a verified native command for efficiency; use a precise raster fallback for compatibility.
