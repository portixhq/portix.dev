---
title: "QR Code Not Printing"
slug: "qr-code-not-printing"
description: "Troubleshoot missing or unreadable QR codes across ESC/POS support, command sequence, data length, image rendering, size, and media quality."
quickAnswer: "Determine whether the QR code is absent or merely unreadable. For native ESC/POS QR output, verify model support, command order, length calculation, data encoding, size, and print command. For raster output, verify image loading, monochrome conversion, width, and row data. Always scan the paper result with multiple devices."
contentType: "troubleshooting"
category: "esc-pos"
primaryTopic: "QR code not printing"
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
  src: "/images/knowledge/qr-code-not-printing.svg"
  alt: "A receipt with a missing QR code where a symbol should be printed"
entities:
  - "QR Code"
  - "ESC/POS"
  - "quiet zone"
  - "monochrome raster"
tags:
  - "troubleshooting"
  - "QR codes"
  - "ESC/POS"
relatedArticles:
  - "esc-pos-qr-codes"
  - "print-qr-codes"
  - "barcode-not-printing"
references: []
featured: false
---

## Native-command diagnosis

1. Initialize the printer.
2. Select a supported QR model.
3. Set module size and error-correction level within documented ranges.
4. Store the exact data using the command's required length fields.
5. Issue the print command.
6. Add feed space so the code clears the cutter.

A compatible-looking printer may implement only part of the command family. Test the manufacturer's example bytes first.

## Raster diagnosis

- Wait for the source image to decode.
- Preserve the quiet zone.
- Avoid resampling after binarization.
- Keep the bitmap within the printable dot width.
- Use high contrast and suitable thermal darkness/speed.

## If it prints but will not scan

Reduce encoded data, enlarge modules, restore the quiet zone, avoid logos or decoration, and check paper heat damage, wrinkles, low contrast, or scaling. Validate the encoded content itself, including URL scheme and hidden whitespace.
