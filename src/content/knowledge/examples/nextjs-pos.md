---
title: "Next.js POS Example"
slug: "nextjs-pos"
description: "Structure a Next.js POS with server-authoritative sales, client-side device integration, idempotent print jobs, and receipt snapshots."
quickAnswer: "Finalize sales on the server and integrate the local printer only from a client component. Return a receipt snapshot and stable print key from the mutation, then submit it once through a browser or runtime adapter."
contentType: "example"
category: "frameworks"
primaryTopic: "Next.js POS example"
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
  src: "/images/knowledge/nextjs-pos.svg"
  alt: "A Next.js server sale mutation handing a stable receipt job to a client print adapter"
entities:
  - "Next.js"
  - "Server Components"
  - "idempotency key"
  - "print adapter"
tags:
  - "examples"
  - "Next.js"
  - "POS"
relatedArticles:
  - "print-from-nextjs"
  - "build-a-retail-pos"
references: []
featured: false
---

## Quick answer

Finalize sales on the server and integrate the local printer only from a client component. Return a receipt snapshot and stable print key from the mutation, then submit it once through a browser or runtime adapter.

```ts
// Server-side domain function; call it from an authenticated route/action.
async function completeSale(input: CheckoutInput) {
  const sale = await sales.commit(input); // validates prices, tax, tender and idempotency
  return {
    receipt: sale.receiptSnapshot,
    printKey: `${sale.id}:receipt:${sale.version}`
  };
}
```

```tsx
"use client";

export function PrintReceiptButton({ job }: { job: PrintJob }) {
  return <button onClick={() => printAdapter.submit(job)}>Print receipt</button>;
}

const printAdapter = {
  async submit(job: PrintJob) {
    // Browser path: render a dedicated route and call window.print().
    // A Portix-routed path isn't documented yet.
  }
};
```

Do not access a local runtime from a Server Component or serverless function: `localhost` there refers to the server environment, not the cashier workstation. Keep payment success independent from print success and store reprint reasons separately.

## Verify

- Refreshing the success page cannot charge or print twice.
- Server recalculates price and tax.
- Runtime code loads only in the browser.
- Reprints reference the original sale.
