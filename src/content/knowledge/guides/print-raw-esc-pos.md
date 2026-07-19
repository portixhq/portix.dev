---
title: "How to Print Raw ESC/POS from JavaScript"
slug: "print-raw-esc-pos"
description: "Build byte-safe ESC/POS jobs in JavaScript, encode text correctly, submit through an authorized runtime, and handle compatibility, status, and retries."
quickAnswer: "Create a verified printer profile, build commands as Uint8Array bytes, encode text using the printer's selected code page, validate all images/barcodes and payload lengths, assign a stable job ID, and send through an authorized local runtime or native service. Do not concatenate binary commands through JavaScript strings or assume every ESC/POS-compatible model supports the same commands."
contentType: "guide"
category: "javascript"
primaryTopic: "printing raw ESC/POS from JavaScript"
searchIntent: "how-to"
audience: "web developers"
difficulty: "advanced"
status: "draft"
noindex: true
publishedAt: 2026-07-19
updatedAt: 2026-07-19
author:
  name: "Portix.One"
  type: "Organization"
cover:
  src: "/images/knowledge/print-raw-esc-pos.svg"
  alt: "JavaScript building byte-safe ESC/POS commands and sending them through an authorized transport to a printer"
entities:
  - "Uint8Array"
  - "code page"
  - "idempotency"
  - "Portix"
tags:
  - "javascript"
  - "ESC/POS"
  - "Portix"
relatedArticles:
  - "what-is-esc-pos"
  - "esc-pos-commands-explained"
  - "esc-pos-character-encoding"
  - "raw-printing"
  - "local-printing-runtime"
references:
  - title: "ESC/POS Command Reference"
    url: "https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/index.html"
    publisher: "Epson"
    accessedAt: 2026-07-19
  - title: "ESC @ — Initialize printer"
    url: "https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_atsign.html"
    publisher: "Epson"
    accessedAt: 2026-07-19
featured: false
---

Raw ESC/POS printing means JavaScript constructs printer-command bytes and submits them through a trusted path that can reach a compatible printer. `window.print()` cannot send this stream.

## Prerequisites

- Exact printer model, firmware, emulation, and interface.
- Official supported-command reference.
- Printable dot width, code pages, cutter, and status profile.
- Authorized raw-print transport.
- Idempotency and recovery policy.

## 1. Build byte-safe commands

```js
const ESC = 0x1b;
const GS = 0x1d;
const LF = 0x0a;

const initialize = Uint8Array.of(ESC, 0x40);
const alignCenter = Uint8Array.of(ESC, 0x61, 0x01);
const feed = Uint8Array.of(LF, LF);
```

## 2. Concatenate bytes

```js
function concatBytes(...chunks) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}
```

## 3. Encode text correctly

```js
// TextEncoder emits UTF-8. Use it only if the selected printer mode accepts UTF-8.
const asciiOnly = Uint8Array.from("DEMO SALE", char => char.charCodeAt(0));
```

For accented or multilingual text, use a vetted encoder for the selected `ESC t` code table or rasterize through a controlled font pipeline. Reject unmappable characters rather than silently replacing critical data.

## 4. Build the job

```js
const payload = concatBytes(
  initialize,
  alignCenter,
  asciiOnly,
  Uint8Array.of(LF),
  Uint8Array.from("TOTAL $11.50", c => c.charCodeAt(0)),
  feed
);

const jobId = "demo-sale-0001:customer-receipt:v1";
```

Add a cut only when the exact model and current command are verified. Separate drawer pulses from receipt bytes and authorization.

## 5. Submit through Portix

```js
// [PORTIX DOCS REQUIRED]
// await portix.printRaw({ jobId, printerRole: "customer-receipt", data: payload });
```

Required documentation: package, initialization, accepted binary type/encoding, maximum size, printer role, timeout, state/error contract, idempotency, and command policy.

## 6. Handle outcome

Never retry a timeout blindly. Query/reconcile by stable job ID if supported. Distinguish accepted, queued, sent, device-reported, failed, and unknown.

## Security

- Generate commands in trusted code from typed business data.
- Do not accept arbitrary raw bytes from users or remote templates.
- Restrict allowed origin, printer role, language, commands, size, and rate.
- Authorize cutter/drawer/configuration actions separately.
- Avoid logging full sensitive payloads.
- Version and golden-test the encoder.

## Common failures

| Problem | Check |
|---|---|
| Commands print as text | Wrong emulation, prefix, or binary transport |
| Accents broken | Code table and byte encoding mismatch |
| Partial receipt | Buffer, chunk, transport, disconnect |
| No cut | Unsupported/obsolete command or model/profile |
| Duplicate | Ambiguous retry and changing job ID |
| Image corrupt | Width, bit order, length, or chunking |

## Frequently asked questions

### Can I send ESC/POS with `fetch()` directly to a printer IP?

Only if a controlled service or printer endpoint explicitly supports and secures that protocol. Browser networking, CORS/local-network policy, authentication, and raw TCP limitations still apply.

### Can I use strings for ESC/POS commands?

Use byte arrays. Unicode string conversion can corrupt binary payloads.

### Should every job start with `ESC @`?

It provides a known common state but clears buffered data and does not reset everything. Follow the model reference and job-ownership design.
