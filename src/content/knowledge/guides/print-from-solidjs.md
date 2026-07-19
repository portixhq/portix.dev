---
title: "How to Print from SolidJS"
slug: "print-from-solidjs"
description: "Render a printable SolidJS component, wait for client assets, call window.print(), and isolate local printer communication in a typed service."
quickAnswer: "Render stable document data in a Solid component, apply print CSS, wait for fonts and any pending resource state, and call window.print() from a click event. In SolidStart, guard browser-only code from server execution. For silent/raw printing, convert signals/resources into a plain immutable job and pass it to a trusted Portix client."
contentType: "guide"
category: "frameworks"
primaryTopic: "printing from SolidJS"
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
  src: "/images/knowledge/print-from-solidjs.svg"
  alt: "A SolidJS component calling window.print() to send a rendered view to a printer"
entities:
  - "SolidJS"
  - "fine-grained reactivity"
  - "SolidStart"
  - "Portix"
tags:
  - "frameworks"
  - "SolidJS"
  - "Portix"
relatedArticles:
  - "print-from-javascript"
  - "print-html"
  - "local-printing-runtime"
  - "silent-printing"
references:
  - title: "SolidJS Fine-grained Reactivity"
    url: "https://docs.solidjs.com/advanced-concepts/fine-grained-reactivity"
    publisher: "SolidJS"
    accessedAt: 2026-07-19
  - title: "SolidJS Lifecycle"
    url: "https://docs.solidjs.com/concepts/effects"
    publisher: "SolidJS"
    accessedAt: 2026-07-19
featured: false
---

SolidJS can render a fine-grained reactive print view while keeping the actual browser or runtime action in an explicit event handler.

## Component example

```tsx
import { Show } from "solid-js";

export function Receipt(props: { receipt: Receipt }) {
  const print = async () => {
    await document.fonts.ready;
    window.print();
  };

  return (
    <>
      <article class="print-scope">
        <h1>Receipt</h1>
        <For each={props.receipt.items}>{item => <div>{item.name}</div>}</For>
      </article>
      <button class="screen-only" onClick={print}>Print</button>
    </>
  );
}
```

Import every primitive used by the supported Solid toolchain and compile-test the example.

## Resource readiness

Do not print loading placeholders. Gate the print button with resource state and create a stable snapshot. Browser printing observes the current DOM, not the future resolved value.

## Portix boundary

```ts
const job = structuredClone(untrack(() => buildJob(props.receipt)));
// Submit via verified Portix client: [PORTIX DOCS REQUIRED]
```

The exact use of `untrack` is optional; the important rule is to send plain validated data, not reactive ownership internals.

## Common mistakes

- Using browser APIs during SSR.
- Printing while a resource is pending.
- Creating a reactive effect that prints repeatedly.
- Passing signals/accessors to the transport layer.
- Assuming callback/handoff means paper completion.
