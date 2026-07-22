---
title: "How POS Systems Print Receipts"
slug: "how-pos-systems-print-receipts"
description: "Trace the end-to-end pipeline a point-of-sale system uses to turn a transaction into a printed receipt, from rendering through station routing and reprints."
quickAnswer: "A POS system closes a transaction, builds a receipt document from that transaction, resolves which station and printer should output it, sends the job through a browser, native, or local-runtime path, and confirms or retries. Reliable POS printing depends on idempotent jobs, explicit station routing, and a defined reprint flow, not just a successful print call."
contentType: "pillar"
category: "thermal-printing"
primaryTopic: "POS receipt printing pipeline"
searchIntent: "informational"
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
  src: "/images/knowledge/how-pos-systems-print-receipts.svg"
  alt: "A hub diagram showing POS receipt printing connected to transaction, rendering, station routing, and reprints"
entities:
  - "point of sale"
  - "receipt rendering"
  - "station routing"
  - "reprint"
tags:
  - "pillar"
  - "POS"
  - "receipts"
relatedArticles:
  - "build-a-retail-pos"
  - "build-a-restaurant-pos"
  - "printer-not-found"
  - "cash-drawer-wont-open"
references: []
featured: false
---

A receipt is the last visible step of a transaction, but printing it reliably requires more than calling a print function after checkout.

## The end-to-end pipeline

1. Cart and pricing are finalized.
2. Payment is authorized and recorded.
3. The transaction is committed as the source of truth.
4. A receipt document is built from that committed transaction, not from in-memory cart state.
5. The system resolves which station and printer should receive it.
6. A print job is submitted through a browser, native, or local-runtime path.
7. The job's outcome is observed and recorded.
8. Failures trigger a defined retry, reroute, or manual fallback.
9. Reprints reference the original transaction rather than regenerating a new one.

## What belongs on a receipt

Line items, taxes, totals, payment method, change due, timestamps, transaction identifiers, and any required legal or fiscal text belong on the receipt. This content should be derived deterministically from the committed transaction so a reprint is always identical to the original.

## Browser versus operational printing

A browser print dialog is often acceptable for a single front-of-house register with an attended operator. Kitchen, label, or unattended checkout stations typically need fixed-destination, low-friction output that does not depend on a person clicking through a system dialog for every order.

## Receipt printers and commands

Most receipt printers accept either rendered output through an operating-system driver or raw command bytes for tighter control over layout, cutting, and cash-drawer pulses. The choice affects formatting flexibility, print speed, and how much the application must know about the specific printer model.

## Job reliability

```ts
const jobId = `receipt:${transactionId}:${attempt}`;
```

Deriving the job identifier from the transaction and attempt number lets the system detect and collapse duplicate submissions instead of printing the same receipt twice after a retry.

## Restaurant and retail differences

Retail typically routes one receipt to one register printer. Restaurants often route multiple documents — a guest receipt, one or more kitchen tickets, and sometimes a bar or expo ticket — to different stations from a single order, which makes station routing a first-class concern rather than an afterthought.

## Failure map

- [Printer Not Found](/knowledge/troubleshooting/printer-not-found)
- [Printer Prints Gibberish](/knowledge/troubleshooting/printer-prints-gibberish)
- [Paper Never Cuts](/knowledge/troubleshooting/paper-never-cuts)
- [Cash Drawer Won't Open](/knowledge/troubleshooting/cash-drawer-wont-open)
