---
title: "How to Print HTML"
slug: "print-html"
description: "Create a dedicated printable HTML document, apply paged-media CSS, wait for assets, and print it safely from JavaScript."
quickAnswer: "Render the intended content in the current page or a dedicated same-origin print document, apply @media print and @page, wait for fonts and images, then call window.print() from a user action. Avoid copying arbitrary innerHTML: it can lose styles, state, security controls, and asset context. For silent routing, render through a trusted runtime or desktop application using a documented API."
contentType: "guide"
category: "javascript"
primaryTopic: "printing HTML"
searchIntent: "how-to"
audience: "web developers"
difficulty: "beginner"
status: "published"
noindex: false
publishedAt: 2026-07-19
updatedAt: 2026-07-19
author:
  name: "Portix.One"
  type: "Organization"
cover:
  src: "/images/knowledge/print-html.svg"
  alt: "A dedicated printable HTML document being prepared and printed"
entities:
  - "print CSS"
  - "print document"
  - "asset readiness"
  - "window.print()"
tags:
  - "javascript"
  - "HTML"
  - "browser printing"
relatedArticles:
  - "print-from-javascript"
  - "window-print"
  - "print-images"
  - "electron-printing"
references:
  - title: "Printing — CSS"
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing"
    publisher: "MDN"
    accessedAt: 2026-07-19
  - title: "CSS Paged Media Level 3"
    url: "https://www.w3.org/TR/css-page-3/"
    publisher: "W3C"
    accessedAt: 2026-07-19
featured: false
---

Printing HTML works best when the printable document is treated as its own view with semantic structure, fixed data, print-specific CSS, and explicit asset readiness.

## 1. Create a print view

```html
<main id="invoice" class="print-document">
  <h1>Invoice</h1>
  <table><!-- semantic rows --></table>
</main>
<button class="screen-only" onclick="window.print()">Print</button>
```

## 2. Add page rules

```css
@media print {
  .screen-only { display: none !important; }
  .print-document { max-width: none; }
  thead { display: table-header-group; }
  tr, figure { break-inside: avoid-page; }
}

@page { size: auto; margin: 12mm; }
```

## 3. Wait for assets

```js
async function readyToPrint(root = document) {
  await root.fonts.ready;
  await Promise.all([...root.images].map(img => img.complete ? null : img.decode()));
}
```

## Dedicated iframe or window

Use a same-origin print route when isolation is valuable. Wait for load and assets, invoke printing, then clean up after `afterprint`. Test popup blocking, sandbox flags, focus, and browser behavior. A hidden iframe is not silent printing.

## Security

- Render untrusted values with safe DOM APIs or a trusted template engine.
- Do not inject arbitrary HTML into a privileged print window.
- Keep authentication and data authorization identical to screen views.
- Avoid leaking tokens in printable URLs, headers, or footers.
- Minimize personal data.

## Common problems

| Problem | Fix |
|---|---|
| Styles missing | Ensure print view loads the correct stylesheet and origin |
| Blank images | Wait for decode and check CORS/authenticated asset URLs |
| Table header not repeated | Use semantic table and tested print CSS |
| Content clipped | Remove fixed widths and inspect page size/margins |
| Extra blank page | Check forced breaks, margins, and overflowing containers |

## Frequently asked questions

### Can I print an HTML string directly?

It must be parsed and rendered in a document context with styles and assets. Sanitize untrusted input.

### Can CSS guarantee exact output?

No. Browser, destination, user settings, fonts, and printable area can change it.

### Can Portix print HTML?

Only through a Portix HTML capability, once one is documented and verified — Portix's print API and format matrix aren't published yet.
