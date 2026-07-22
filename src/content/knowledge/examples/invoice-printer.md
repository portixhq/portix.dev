---
title: "Invoice Printer Example"
slug: "invoice-printer"
description: "Generate and print versioned invoice PDFs with server-side authority, durable storage, browser printing, and optional workstation routing."
quickAnswer: "Issue the invoice on the server, generate a versioned PDF from its immutable fiscal data, store its checksum, and print that artifact. Use the browser dialog for interactive printing or an authenticated local adapter for controlled workstation routing."
contentType: "example"
category: "applications"
primaryTopic: "invoice printer example"
searchIntent: "how-to"
audience: "web developers"
difficulty: "advanced"
status: "published"
noindex: false
publishedAt: 2026-07-21
updatedAt: 2026-07-21
author:
  name: "Portix.One"
  type: "Organization"
cover:
  src: "/images/knowledge/invoice-printer.svg"
  alt: "A versioned invoice artifact printed through a browser or authenticated local adapter"
entities:
  - "invoice artifact"
  - "checksum"
  - "fiscal data"
  - "PDF printing"
tags:
  - "examples"
  - "invoices"
  - "PDF"
relatedArticles:
  - "raw-printing-vs-pdf-printing"
  - "print-html"
references: []
featured: false
---

## Quick answer

Issue the invoice on the server, generate a versioned PDF from its immutable fiscal data, store its checksum, and print that artifact. Use the browser dialog for interactive printing or an authenticated local adapter for controlled workstation routing.

```ts
type InvoiceArtifact = {
  invoiceId: string;
  version: number;
  pdfUrl: string;
  sha256: string;
  issuedAt: string;
};

async function printInvoice(artifact: InvoiceArtifact) {
  const jobId = `${artifact.invoiceId}:v${artifact.version}:${artifact.sha256}`;
  // Interactive: open a same-origin PDF view and let the user print.
  // A Portix-routed print path isn't documented yet.
  return jobId;
}
```

Do not regenerate a historical invoice from current customer or catalog records. Corrections should create the legally appropriate new version, credit note, or replacement according to the jurisdiction. Validate any remote artifact URL and do not expose unrestricted local-runtime fetches.

## Verify

- PDF page size, margins, fonts, and pagination are stable.
- Stored checksum matches the printed artifact.
- Duplicate requests reuse the logical job.
- Access control protects invoice URLs.
- Correction and reprint policies are auditable.
