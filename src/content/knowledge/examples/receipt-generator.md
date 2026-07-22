---
title: "Receipt Generator Example"
slug: "receipt-generator"
description: "Generate deterministic receipt models for browser, PDF, or ESC/POS rendering without mixing totals, formatting, and transport."
quickAnswer: "Calculate totals in the transaction service and pass a complete immutable receipt model to a renderer. Use separate renderers for HTML, PDF, and ESC/POS; none should recalculate tax or mutate the sale."
contentType: "example"
category: "applications"
primaryTopic: "receipt generator example"
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
  src: "/images/knowledge/receipt-generator.svg"
  alt: "An immutable receipt model rendered through separate HTML, PDF, and ESC/POS renderers"
entities:
  - "receipt model"
  - "renderer boundary"
  - "minor-unit arithmetic"
  - "artifact checksum"
tags:
  - "examples"
  - "receipts"
  - "architecture"
relatedArticles:
  - "pos-printing-basics"
  - "print-receipts-from-javascript"
references: []
featured: false
---

## Quick answer

Calculate totals in the transaction service and pass a complete immutable receipt model to a renderer. Use separate renderers for HTML, PDF, and ESC/POS; none should recalculate tax or mutate the sale.

```ts
type ReceiptModel = {
  id: string;
  issuedAt: string;
  merchant: { name: string; taxId?: string };
  lines: { description: string; quantity: string; amount: string }[];
  subtotal: string;
  taxLines: { label: string; amount: string }[];
  total: string;
  currency: string;
  paymentSummary: string;
};

interface ReceiptRenderer<T> {
  render(model: Readonly<ReceiptModel>): Promise<T>;
}
```

```ts
async function generate<T>(model: ReceiptModel, renderer: ReceiptRenderer<T>) {
  validateRequiredFields(model);
  return renderer.render(Object.freeze(model));
}
```

Use decimal or minor-unit arithmetic before building the model. Store the renderer/template version and artifact checksum. Escape untrusted text in HTML and constrain control characters in raw formats.

## Verify

- Line totals reconcile to subtotal and taxes.
- Currency and rounding are explicit.
- Long names and zero/negative lines render intentionally.
- Repeated rendering produces equivalent output.
- Legally required fields are reviewed per market.
