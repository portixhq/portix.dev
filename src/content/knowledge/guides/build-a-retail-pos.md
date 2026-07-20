---
title: "How to Build a Retail POS"
slug: "build-a-retail-pos"
description: "Plan a retail POS with durable transactions, barcode input, receipt printing, returns, cash-drawer controls, and offline recovery."
quickAnswer: "Use a server-authoritative sale with a local operational queue. Resolve scanned codes to products, snapshot prices and tax, finalize payment, then create a receipt job from the completed sale. Give every sale and print job a stable identifier, make retries idempotent, and require authorization plus a reason for returns, voids, discounts, and reprints."
contentType: "guide"
category: "applications"
primaryTopic: "building a retail POS"
searchIntent: "how-to"
audience: "web developers"
difficulty: "advanced"
status: "published"
noindex: false
publishedAt: 2026-07-19
updatedAt: 2026-07-19
author:
  name: "Portix.One"
  type: "Organization"
cover:
  src: "/images/knowledge/build-a-retail-pos.svg"
  alt: "A finalized sale snapshot routed to a receipt printer producing a customer receipt"
entities:
  - "sale snapshot"
  - "cash drawer"
  - "returns"
  - "idempotency"
tags:
  - "applications"
  - "retail POS"
  - "receipts"
relatedArticles:
  - "pos-printing-basics"
  - "esc-pos-barcodes"
  - "build-a-restaurant-pos"
  - "silent-printing"
references: []
featured: false
---

A retail POS must preserve the commercial transaction even when a scanner, receipt printer, cash drawer, payment service, or network connection fails.

## Core architecture

Separate these responsibilities:

- **Catalog and pricing:** products, identifiers, promotions, tax, and effective dates.
- **Transaction service:** line snapshots, totals, tenders, returns, and audit events.
- **Device layer:** scanners, customer displays, printers, and cash drawers.
- **Print pipeline:** templates, printer routing, queueing, retry policy, and status.

The receipt should be generated from the finalized sale snapshot, not from the current cart or a later catalog lookup.

## Transaction sequence

1. Scan or search for an item.
2. Resolve the identifier and validate quantity or restrictions.
3. Calculate totals using explicit currency rounding rules.
4. Commit the sale and tender result atomically where possible.
5. Create a receipt job with `saleId`, `receiptVersion`, and `printerId`.
6. Submit it once and retry safely with the same key.
7. Record the operator, terminal, result, and any reprint reason.

```ts
const printKey = `${sale.id}:receipt:${sale.receiptVersion}`;
```

## Receipts, labels, and drawers

Receipts and shelf or product labels have different media, layouts, and validation needs; route them through distinct templates and printer profiles. Treat a cash-drawer pulse as a privileged device command. Allow it only for approved events, such as a cash sale or audited no-sale action.

## Offline operation

Define which transactions are permitted offline. Store encrypted minimum-required data, preserve ordering with locally unique IDs, and surface sync conflicts instead of silently overwriting records. Printing can continue from committed local snapshots, but payment rules must follow the payment provider and business risk policy.

## Portix integration boundary

A local runtime can isolate browser code from device-specific transport and support named-printer routing. Portix printer discovery, raw printing, drawer commands, job status, and security controls remain undocumented for now.

## Launch checklist

- Totals use tested tax and rounding rules.
- Scans cannot add the same event twice accidentally.
- Receipt retries are idempotent.
- Returns reference the original sale.
- Drawer actions and reprints are audited.
- Offline recovery and printer replacement are rehearsed.
