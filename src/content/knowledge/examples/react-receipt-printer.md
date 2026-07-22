---
title: "React Receipt Printer Example"
slug: "react-receipt-printer"
description: "A React receipt example with stable data, print CSS, asset readiness, and a safe local-runtime integration boundary."
quickAnswer: "Render an immutable receipt snapshot, wait for fonts, and call window.print() from a user action. Keep device routing behind a service adapter when silent or raw printing is required."
contentType: "example"
category: "frameworks"
primaryTopic: "React receipt printer example"
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
  src: "/images/knowledge/react-receipt-printer.svg"
  alt: "A React receipt component calling window.print() to send a rendered receipt to a printer"
entities:
  - "React"
  - "receipt snapshot"
  - "print CSS"
  - "service adapter"
tags:
  - "examples"
  - "React"
  - "receipts"
relatedArticles:
  - "print-from-react"
  - "receipt-generator"
  - "vue-pos"
references:
  - title: "useRef"
    url: "https://react.dev/reference/react/useRef"
    publisher: "React"
    accessedAt: 2026-07-21
featured: false
---

## Quick answer

Render an immutable receipt snapshot, wait for fonts, and call `window.print()` from a user action. Keep device routing behind a service adapter when silent or raw printing is required.

```tsx
type Receipt = { id: string; items: { id: string; name: string; total: string }[]; total: string };

export function ReceiptView({ receipt }: { receipt: Receipt }) {
  async function print() {
    await document.fonts.ready;
    window.print();
  }
  return <>
    <main className="receipt">
      <h1>Receipt</h1>
      {receipt.items.map(x => <p key={x.id}><span>{x.name}</span> <b>{x.total}</b></p>)}
      <strong>Total {receipt.total}</strong>
    </main>
    <button className="no-print" onClick={print}>Print receipt</button>
  </>;
}
```

```css
@media print {
  body { margin: 0; }
  .receipt { width: 72mm; }
  .receipt p { display: flex; justify-content: space-between; }
  .no-print { display: none; }
}
```

For silent or raw printing, submit `receipt.id` plus a versioned plain-data payload through a local runtime adapter — never send a React component or ref. A documented Portix SDK call for this doesn't exist yet.

## Verify

- Long names wrap without hiding totals.
- Money is preformatted with explicit currency rules.
- One click produces one job.
- Canceling browser print does not mutate the sale.
