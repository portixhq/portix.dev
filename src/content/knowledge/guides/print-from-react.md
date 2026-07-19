---
title: "How to Print from React"
slug: "print-from-react"
description: "Build a printable React component, wait for committed UI and assets, apply print CSS, and choose between window.print() and a local printing runtime."
quickAnswer: "Render the printable component in the DOM, attach a ref when you need to scope print CSS, wait for state and assets to commit, and call window.print() from an event handler. Use a dedicated print route or CSS to hide unrelated UI. For silent routing, raw commands, or status, submit a typed job through Portix or another trusted runtime rather than exposing device access inside the component."
contentType: "guide"
category: "frameworks"
primaryTopic: "printing from React"
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
  src: "/images/knowledge/print-from-react.svg"
  alt: "A React component calling window.print() to send a rendered view to a printer"
entities:
  - "React"
  - "useRef"
  - "print CSS"
  - "Portix"
tags:
  - "frameworks"
  - "React"
  - "Portix"
relatedArticles:
  - "print-from-javascript"
  - "print-html"
  - "local-printing-runtime"
  - "silent-printing"
references:
  - title: "useRef"
    url: "https://react.dev/reference/react/useRef"
    publisher: "React"
    accessedAt: 2026-07-19
  - title: "Window.print()"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/print"
    publisher: "MDN"
    accessedAt: 2026-07-19
featured: false
---

React should render a stable print view from application data; printing itself still uses a browser or trusted native path. Avoid cloning component HTML or triggering print during render.

## Component example

```tsx
import { useRef } from "react";

export function Receipt({ receipt }: { receipt: Receipt }) {
  const receiptRef = useRef<HTMLElement>(null);

  const handlePrint = async () => {
    await document.fonts.ready;
    window.print();
  };

  return (
    <>
      <article ref={receiptRef} className="receipt print-scope">
        <h1>Receipt</h1>
        {receipt.items.map(item => (
          <div className="receipt-row" key={item.id}>
            <span>{item.name}</span><span>{item.formattedTotal}</span>
          </div>
        ))}
      </article>
      <button className="screen-only" onClick={handlePrint}>Print</button>
    </>
  );
}
```

Keys should represent stable item identity. Format money before display using explicit currency rules.

## Print CSS

```css
@media print {
  body * { visibility: hidden; }
  .print-scope, .print-scope * { visibility: visible; }
  .print-scope { position: absolute; inset: 0 auto auto 0; width: 72mm; }
  .screen-only { display: none !important; }
}
```

For complex apps, a dedicated print route is less fragile than global visibility rules.

## Async updates

Do not call print immediately after `setState` and assume the new DOM exists. Prefer an explicit preview state, then print from a later user action. If automation is essential, coordinate after the committed update and test React Strict Mode behavior.

## Portix integration boundary

```tsx
async function submitReceipt(receipt: Receipt) {
  // [PORTIX DOCS REQUIRED]
  // Submit a typed, immutable job; do not send a React ref or component instance.
}
```

Business data crosses the boundary, not framework internals.

## Common mistakes

- Calling `window.print()` during render or an unguarded effect.
- Mutating live sale data while preview is open.
- Depending on a third-party print hook without understanding its iframe/styles behavior.
- Assuming ref scoping changes what the browser prints.
- Treating `afterprint` as physical success.

## Verification

- One print action follows a user gesture.
- State, fonts, and images are ready.
- Long/localized content is tested.
- Screen-only UI is absent.
- Runtime jobs use stable IDs and typed data.
