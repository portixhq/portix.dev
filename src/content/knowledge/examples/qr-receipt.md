---
title: "QR Receipt Example"
slug: "qr-receipt"
description: "Add a scannable QR code to a receipt using minimal opaque data, safe URL construction, native or raster rendering, and paper tests."
quickAnswer: "Encode a short HTTPS URL containing an opaque receipt token, not personal or payment data. Generate the URL on the server, render it natively or as a tested monochrome image, preserve the quiet zone, and scan the physical receipt."
contentType: "example"
category: "esc-pos"
primaryTopic: "QR receipt example"
searchIntent: "how-to"
audience: "web developers"
difficulty: "intermediate"
status: "published"
noindex: false
publishedAt: 2026-07-21
updatedAt: 2026-07-21
author:
  name: "Portix.One"
  type: "Organization"
cover:
  src: "/images/knowledge/qr-receipt.svg"
  alt: "A verification URL encoded as a QR code and printed on a receipt"
entities:
  - "QR Code"
  - "opaque token"
  - "error correction"
  - "quiet zone"
tags:
  - "examples"
  - "QR codes"
  - "ESC/POS"
relatedArticles:
  - "esc-pos-qr-codes"
  - "qr-code-not-printing"
  - "barcode-receipt"
references: []
featured: false
---

## Quick answer

Encode a short HTTPS URL containing an opaque receipt token, not personal or payment data. Generate the URL on the server, render it natively or as a tested monochrome image, preserve the quiet zone, and scan the physical receipt.

```ts
function receiptQr(baseUrl: URL, publicToken: string) {
  const url = new URL("/r/verify", baseUrl);
  url.searchParams.set("t", publicToken);
  if (url.protocol !== "https:") throw new Error("HTTPS required");
  return url.toString();
}
```

```ts
type QrReceiptBlock = {
  value: string;
  label: "View or verify this receipt";
  errorCorrection: "M";
};
```

Keep tokens random, revocable where appropriate, and limited to the minimum receipt view. Avoid placing customer names, email addresses, card data, session tokens, or internal numeric IDs directly in the QR code.

For ESC/POS, select a supported QR model, module size, correction level, store data with correct byte length, then print. For an image path, avoid scaling after rasterization. Portix QR payload support isn't documented yet.

## Verify

- Code scans on production paper at expected distance.
- Token reveals only authorized information.
- Expired/revoked behavior is intentional.
- Printed human-readable instructions are clear.
