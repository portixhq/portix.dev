---
title: "How to Print from Any Web Application"
slug: "how-to-print-from-any-web-application"
description: "A practical architecture for adding printing to any web application: choosing a path, defining a durable print job, and implementing browser and operational output."
quickAnswer: "Define a transport-independent print job first, then implement one or more adapters: browser printing for reviewable documents, PDF generation for portable output, and a local-runtime or native path for unattended or device-specific operational printing. Choose the path per use case rather than committing the whole application to a single transport."
contentType: "pillar"
category: "browser-printing"
primaryTopic: "web application printing architecture"
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
  src: "/images/knowledge/how-to-print-from-any-web-application.svg"
  alt: "A hub diagram showing web application printing connected to window.print(), PDF, local runtime, and raw commands"
entities:
  - "print architecture"
  - "print job"
  - "PDF generation"
  - "local printing runtime"
tags:
  - "pillar"
  - "web printing"
  - "architecture"
relatedArticles:
  - "the-complete-guide-to-browser-printing"
  - "how-local-printing-runtimes-work"
  - "raw-printing-vs-pdf-printing"
  - "printer-not-found"
references:
  - title: "Window.print()"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/print"
    publisher: "MDN"
    accessedAt: 2026-07-21
  - title: "HTML printing steps"
    url: "https://html.spec.whatwg.org/multipage/printing.html"
    publisher: "WHATWG"
    accessedAt: 2026-07-21
featured: false
---

Printing from a web application is rarely one problem. It is several: reviewable documents, portable files, and unattended operational output each favor a different path.

## Choose the printing path

| Need | Path |
|---|---|
| User reviews and confirms each page | Browser printing (`window.print()`) |
| Portable, shareable, archivable output | PDF generation |
| Unattended, high-volume, or device-specific output | Local runtime or native integration |
| Raw device commands (cut, drawer, native barcode) | Local runtime or native integration with a raw-capable transport |

## A durable architecture

Model the print job independent of how it will ultimately reach a printer, then implement adapters underneath it.

```ts
type PrintJob = {
  id: string;
  documentType: "invoice" | "receipt" | "label" | "report";
  target: "browser" | "pdf" | "runtime";
  payload: unknown;
};
```

1. The application creates a `PrintJob` from committed data, not transient UI state.
2. A resolver picks the target based on document type, station, or user choice.
3. An adapter formats the payload for that target.
4. The adapter submits the job and reports back a defined status.
5. Failures are surfaced to the user or operator with an actionable next step.
6. Reprints reconstruct the job from the same source data.

## Browser implementation

`window.print()` triggers the operating system's print dialog for the current document. Combine it with print-specific CSS (`@media print`) to control what content, pagination, and layout appear in the printed result versus the interactive page.

## Operational printing

The browser cannot use `window.print()` for silent named-printer routing or raw commands. A runtime adapter may provide these functions, but Portix connection, authentication, printer discovery, payload, submission, and status APIs aren't documented yet.

## Reliability rules

Treat every print job as at-least-once delivery: give it a stable identifier, make resubmission idempotent, and record the last known status rather than assuming success once a call returns. Never regenerate a reprint from live application state — always rebuild it from the same committed source the original was built from.

## Security checklist

- [ ] Sensitive data is not placed in job identifiers, logs, or URLs.
- [ ] Only authorized origins or sessions can submit jobs to a local runtime.
- [ ] Raw command payloads are validated before being sent to a device.
- [ ] PDF generation does not leak internal file paths or unrelated records.
