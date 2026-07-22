---
title: "Barcode Receipt Example"
slug: "barcode-receipt"
description: "Print a receipt lookup barcode with validated data, appropriate symbology, human-readable fallback, quiet zones, and scan verification."
quickAnswer: "Encode a short opaque lookup identifier in a symbology supported by both printer and scanner. Validate the identifier before rendering, print a human-readable fallback, preserve quiet zones, and verify the decoded paper result exactly matches the source."
contentType: "example"
category: "esc-pos"
primaryTopic: "barcode receipt example"
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
  src: "/images/knowledge/barcode-receipt.svg"
  alt: "A validated lookup code encoded as a barcode and printed on a receipt"
entities:
  - "Code 128"
  - "lookup identifier"
  - "quiet zone"
  - "check digit"
tags:
  - "examples"
  - "barcodes"
  - "ESC/POS"
relatedArticles:
  - "esc-pos-barcodes"
  - "barcode-not-printing"
  - "qr-receipt"
references: []
featured: false
---

## Quick answer

Encode a short opaque lookup identifier in a symbology supported by both printer and scanner. Validate the identifier before rendering, print a human-readable fallback, preserve quiet zones, and verify the decoded paper result exactly matches the source.

```ts
function buildReceiptLookup(receiptId: string, publicCode: string) {
  if (!/^[A-Z0-9-]{8,24}$/.test(publicCode)) {
    throw new Error("Unsupported receipt lookup code");
  }
  return {
    receiptId,
    symbology: "CODE128" as const,
    value: publicCode,
    humanReadable: publicCode
  };
}
```

Code 128 is useful for compact alphanumeric identifiers, but the exact subset syntax and printer implementation must be tested. For numeric retail identifiers, use the applicable standard and calculate check digits correctly; do not relabel an internal value as GTIN/EAN/UPC without meeting its rules.

Render the validated barcode through a verified ESC/POS encoder and the printer's native barcode command, or through a rasterized image if the printer requires it. A Portix-specific barcode API isn't documented yet.

Do not encode card data, authentication credentials, or unnecessary personal information. A public lookup code should be unguessable or protected by authorization and rate limits.

## Verify

- Multiple scanners decode the exact source value.
- Quiet zones and width fit the receipt.
- Long codes are rejected before printing.
- Human-readable fallback matches.
- Lookup endpoint prevents enumeration.
