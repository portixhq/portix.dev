---
title: "How to Print from JavaScript"
slug: "print-from-javascript"
description: "Print a web document with window.print(), prepare content and assets, apply print CSS, and choose when a local printing integration is required."
quickAnswer: "Attach window.print() to a clear user action, finish loading data, fonts, and images first, and define an @media print stylesheet. The method takes no arguments and does not return a job result. Use it for user-confirmed pages and PDF. Use a local runtime, native app, managed kiosk, or print service when the application must select a printer, print silently, send device commands, or monitor jobs."
contentType: "guide"
category: "javascript"
primaryTopic: "printing from JavaScript"
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
  src: "/images/knowledge/print-from-javascript.svg"
  alt: "JavaScript code calling window.print() to send a prepared document to a printer"
entities:
  - "window.print()"
  - "print CSS"
  - "beforeprint"
  - "afterprint"
tags:
  - "javascript"
  - "window.print()"
  - "browser printing"
relatedArticles:
  - "window-print"
  - "print-html"
  - "print-images"
  - "silent-printing"
  - "local-printing-runtime"
references:
  - title: "Window.print()"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/print"
    publisher: "MDN"
    accessedAt: 2026-07-19
  - title: "Printing — CSS"
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing"
    publisher: "MDN"
    accessedAt: 2026-07-19
featured: true
---

JavaScript can start the browser's print workflow with `window.print()`. The page prepares content and print CSS; the browser lets the user select a destination and settings. Automatic printer routing, raw commands, and reliable job status require a trusted integration outside this standard API.

## 1. Add a print action

```html
<button id="print" type="button">Print</button>
<script>
  document.querySelector("#print").addEventListener("click", () => {
    window.print();
  });
</script>
```

## 2. Add print CSS

```css
@media print {
  .screen-only { display: none !important; }
  body { color: #000; background: #fff; }
  article { max-width: none; }
  h2 { break-after: avoid-page; }
  figure, table { break-inside: avoid-page; }
}

@page { margin: 12mm; }
```

## 3. Wait for required assets

```js
async function printDocument() {
  await document.fonts.ready;
  await Promise.all(
    [...document.images]
      .filter(image => !image.complete)
      .map(image => image.decode())
  );
  window.print();
}
```

Handle rejected image decoding according to whether the asset is required.

## 4. Use lifecycle events sparingly

```js
window.addEventListener("beforeprint", preparePrintOnlyState);
window.addEventListener("afterprint", restoreScreenState);
```

Prefer CSS for visual changes. `afterprint` does not confirm physical delivery.

## 5. Choose the correct architecture

| Requirement | Approach |
|---|---|
| User selects printer/PDF | `window.print()` |
| Print one element | Dedicated print document or print CSS |
| Silent named-printer routing | Trusted runtime/native/kiosk integration |
| Raw ESC/POS | Authorized binary transport |
| Job status and retry | Queue/runtime/service |

## Common mistakes

- Calling print before rendering completes.
- Opening print automatically on page load.
- Printing screen navigation and controls.
- Assuming `@page` forces device settings.
- Treating dialog closure as success.
- Building a popup that browsers block.

## Frequently asked questions

### Can JavaScript choose the printer?

Not through `window.print()`. The user chooses in browser/platform UI.

### Can JavaScript print silently?

Not through the standard API on an ordinary page.

### Can I print only a component?

Yes, by hiding unrelated content in print CSS or rendering a dedicated print document.
