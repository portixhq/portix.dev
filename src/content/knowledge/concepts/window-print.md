---
title: "window.print(): How Browser Printing Starts"
slug: "window-print"
description: "Learn what window.print() does, when it runs, how beforeprint and afterprint work, what CSS can control, and why it cannot silently select a printer."
quickAnswer: "Calling window.print() asks the browser to offer the user a printable form of the current document, such as paper output or PDF. The method takes no parameters and returns undefined. It does not accept a printer name, raw bytes, or a silent option. Developers control document presentation with print CSS and can react to beforeprint and afterprint, but the browser and user retain control of destination and final settings."
contentType: "concept"
category: "web-technologies"
primaryTopic: "window.print()"
searchIntent: "informational"
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
  src: "/images/knowledge/window-print.svg"
  alt: "A button calling window.print() to open the browser print workflow toward a printer"
entities:
  - "window.print()"
  - "beforeprint"
  - "afterprint"
  - "print CSS"
  - "browser printing"
tags:
  - "web technologies"
  - "window.print()"
  - "browser printing"
relatedArticles:
  - "what-is-browser-printing"
  - "how-browser-printing-works"
  - "silent-printing"
  - "electron-printing"
  - "localhost-printing"
references:
  - title: "HTML Standard — Printing"
    url: "https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#printing"
    publisher: "WHATWG"
    accessedAt: 2026-07-19
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

`window.print()` is the standard JavaScript method for requesting the browser's print workflow for the current document. It connects a page button or application action to browser-managed print preview, destination selection, and user confirmation.

## Basic usage

```html
<button id="print-button" type="button">Print receipt</button>

<script>
  document.querySelector("#print-button").addEventListener("click", () => {
    window.print();
  });
</script>
```

Start printing from a clear user action. Disable accidental double activation while the application is preparing the printable state.

## What the standard specifies

The HTML Standard says `window.print()`:

- Does nothing when the associated document is not fully active.
- Defers printing until post-load readiness when necessary.
- Runs the browser's printing steps.
- Can be blocked when the document has the sandboxed-modals flag.
- Fires `beforeprint` before offering the printable form.
- Gives the user agent responsibility for offering the output opportunity.
- Fires `afterprint` when the browser-side workflow ends.

Browser UI, preview implementation, and platform integration can differ.

## Print CSS

Use CSS rather than large DOM rewrites whenever possible:

```css
@media print {
  .navigation,
  .print-button {
    display: none;
  }

  .receipt {
    width: 72mm;
    color: #000;
    background: #fff;
  }
}

@page {
  margin: 6mm;
}
```

CSS expresses layout preferences. User settings, browser support, printer capabilities, paper, and printable area still affect output.

## `beforeprint` and `afterprint`

```js
window.addEventListener("beforeprint", () => {
  document.body.dataset.printing = "true";
});

window.addEventListener("afterprint", () => {
  delete document.body.dataset.printing;
});
```

Use these events for lifecycle adjustments that print CSS cannot express. `afterprint` does not confirm that a physical printer produced paper; it only indicates the browser print interaction concluded.

## What `window.print()` cannot do

- Select an installed printer through an argument.
- Suppress confirmation in an ordinary public page.
- Return a portable job ID or queue status.
- Send ESC/POS, ZPL, or other raw device commands.
- Trigger a receipt cutter or cash drawer reliably.
- Confirm physical delivery.

Those requirements need a managed kiosk, local runtime, native application, Electron shell, extension/native host, or print service.

## Preparing asynchronous content

`window.print()` is not an async data-loading API. Load required transaction data, fonts, and images before calling it. Create a stable document snapshot so the printed content does not change during preview.

```js
async function printReceipt(orderId) {
  const receipt = await buildReceipt(orderId);
  await document.fonts.ready;
  renderReceipt(receipt);
  window.print();
}
```

The example prepares content first; exact image and framework readiness needs application-specific handling.

## Iframes and print views

A dedicated same-origin print view can isolate layout, but sandbox flags, loading, focus, cleanup, and browser differences require testing. A hidden iframe does not make printing silent.

## Common mistakes

- Calling print before fonts or images are ready.
- Using screen layout without `@media print`.
- Expecting the method to return success.
- Treating `afterprint` as delivery confirmation.
- Triggering it automatically on page load.
- Assuming CSS page size overrides every user/device choice.

## Frequently asked questions

### Is `print()` the same as `window.print()`?

In a normal window context, `print()` resolves to the window method. `window.print()` is clearer in documentation and shared code.

### Does it block JavaScript?

MDN documents the method as blocking while the print dialog is open, but application behavior should still be tested across supported browsers.

### Can it print a specific element?

It prints the document. Use print CSS or a dedicated print document to include only the intended content.

### Can it save a PDF?

Yes when the browser or operating system offers a PDF destination.
