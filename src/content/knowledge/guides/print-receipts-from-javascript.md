---
title: "How to Print Receipts from JavaScript"
slug: "print-receipts-from-javascript"
description: "Build a stable receipt model, render it for a narrow printer, print through the browser or a trusted runtime, and prevent duplicate output."
quickAnswer: "Create an immutable receipt snapshot with explicit currency, render semantic HTML for browser printing or a typed document for a runtime, and assign a stable job ID. Test long names, discounts, refunds, localization, QR/barcodes, and paper width. Use window.print() when the user can confirm each job; use a trusted runtime for silent routing, ESC/POS, cutters, drawers, or job status."
contentType: "guide"
category: "javascript"
primaryTopic: "printing receipts from JavaScript"
searchIntent: "how-to"
audience: "web developers"
difficulty: "intermediate"
status: "draft"
noindex: true
publishedAt: 2026-07-19
updatedAt: 2026-07-19
author:
  name: "Portix.One"
  type: "Organization"
cover:
  src: "/images/knowledge/print-receipts-from-javascript.svg"
  alt: "A JavaScript receipt model being rendered and printed as a physical receipt"
entities:
  - "receipt model"
  - "idempotent job ID"
  - "print CSS"
  - "Portix"
tags:
  - "javascript"
  - "receipts"
  - "Portix"
relatedArticles:
  - "print-from-javascript"
  - "receipt-printers-explained"
  - "pos-printing-basics"
  - "print-raw-esc-pos"
references:
  - title: "Printing — CSS"
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing"
    publisher: "MDN"
    accessedAt: 2026-07-19
featured: false
---

A dependable receipt begins with committed transaction data, not DOM scraping. JavaScript should create a stable receipt model, render it for the printer's actual width, and submit it through a user-confirmed browser workflow or an authorized local printing path.

## 1. Model the receipt

```js
const receipt = Object.freeze({
  id: "sale-8472",
  currency: "USD",
  locale: "en-US",
  items: [{ name: "Coffee", quantity: 2, unitPrice: 3.5 }],
  tax: 0.56,
  total: 7.56
});
```

Store money as integer minor units or a decimal type in production; the example is intentionally small.

## 2. Format explicitly

```js
const money = new Intl.NumberFormat(receipt.locale, {
  style: "currency",
  currency: receipt.currency
});
```

## 3. Render semantic HTML

```html
<article class="receipt" aria-label="Receipt">
  <header><h1>Demo Store</h1></header>
  <section id="receipt-items"></section>
  <dl><dt>Total</dt><dd id="receipt-total"></dd></dl>
</article>
```

Insert user-controlled values with `textContent`, not untrusted HTML.

## 4. Size for the target printer

```css
@media print {
  @page { margin: 3mm; }
  .receipt { width: 72mm; font: 10pt/1.3 monospace; }
  .receipt-row { display: grid; grid-template-columns: 1fr auto; gap: 2mm; }
  .screen-only { display: none !important; }
}
```

Nominal 80 mm paper does not imply 80 mm printable width. Use the verified printer profile.

## 5. Submit safely

For browser printing:

```js
await document.fonts.ready;
window.print();
```

For Portix:

```js
// [PORTIX DOCS REQUIRED]
// Submit a typed receipt with jobId `${receipt.id}:customer-receipt:v1`.
```

Do not invent a new ID on ambiguous retry. Mark intentional reprints.

## Test cases

- Long and multilingual product names.
- Zero, negative, discounted, and refunded lines.
- Tax-inclusive and tax-exclusive markets.
- Multiple currencies and rounding.
- Narrow and wide paper profiles.
- Offline, paper-out, cutter jam, and unknown outcome.
- Reprint without reopening the cash drawer.

## Frequently asked questions

### Should I build the receipt from the cart DOM?

No. Use authoritative committed transaction data and a versioned template.

### Should I print HTML or ESC/POS?

HTML is convenient for browser/PDF output. ESC/POS is efficient for compatible receipt hardware and device actions.

### How do I know the receipt printed?

Use the documented status boundary of your runtime, queue, or device; browser `afterprint` is not physical confirmation.
