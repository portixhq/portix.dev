---
title: "Barcode Not Printing"
slug: "barcode-not-printing"
description: "Diagnose missing or unreadable printed barcodes by checking symbology, data rules, ESC/POS commands, dimensions, quiet zones, and media."
quickAnswer: "Validate the data against the chosen symbology before printing. Then confirm printer support, command syntax, length/terminator rules, width, height, quiet zones, and media quality. A visible barcode is not successful until the exact encoded value scans reliably."
contentType: "troubleshooting"
category: "esc-pos"
primaryTopic: "barcode not printing"
searchIntent: "troubleshooting"
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
  src: "/images/knowledge/barcode-not-printing.svg"
  alt: "A receipt with a missing barcode where a symbol should be printed"
entities:
  - "barcode symbology"
  - "check digit"
  - "quiet zone"
  - "ESC/POS"
tags:
  - "troubleshooting"
  - "barcodes"
  - "ESC/POS"
relatedArticles:
  - "esc-pos-barcodes"
  - "print-barcodes"
  - "qr-code-not-printing"
references: []
featured: false
---

## Diagnose it

1. Identify the symbology and validate allowed characters and check digits.
2. Test the printer manufacturer's minimal example.
3. Verify the command form expected by the specific model.
4. Check data length, terminator, and Code 128 subset switching where applicable.
5. Disable human-readable text temporarily to isolate the bars.
6. Increase height and ensure the full width fits the printable area.

## If it prints but will not scan

- Restore left and right quiet zones.
- Avoid horizontal scaling or excessive narrow-bar width.
- Improve thermal darkness and reduce speed if appropriate.
- Print perpendicular to defects where label design permits.
- Clean the printhead and test fresh media.
- Scan with more than one configured scanner.

Never use a screenshot of a barcode without controlling its pixel dimensions. Prefer the printer's native generator or a purpose-built renderer with known module width.

## Verify

Compare the decoded scan to the source byte-for-byte, then test short, long, numeric, and edge-case values on production media.
