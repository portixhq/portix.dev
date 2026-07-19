---
title: "How to Print from Vue"
slug: "print-from-vue"
description: "Build a printable Vue component with Composition API, template refs, nextTick, print CSS, and a clean local-runtime integration boundary."
quickAnswer: "Render the printable data in a Vue template, wait for nextTick() and required assets, then call window.print() from a button handler. Use a template ref for measurement or asset checks, not as an argument to window.print(). For silent or raw printing, send a typed data snapshot to a trusted Portix client initialized in browser-only code."
contentType: "guide"
category: "frameworks"
primaryTopic: "printing from Vue"
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
  src: "/images/knowledge/print-from-vue.svg"
  alt: "A Vue component calling window.print() to send a rendered view to a printer"
entities:
  - "Vue"
  - "nextTick"
  - "template ref"
  - "Portix"
tags:
  - "frameworks"
  - "Vue"
  - "Portix"
relatedArticles:
  - "print-from-javascript"
  - "print-html"
  - "local-printing-runtime"
  - "silent-printing"
references:
  - title: "Template Refs"
    url: "https://vuejs.org/guide/essentials/template-refs.html"
    publisher: "Vue"
    accessedAt: 2026-07-19
  - title: "nextTick()"
    url: "https://vuejs.org/api/general.html#nexttick"
    publisher: "Vue"
    accessedAt: 2026-07-19
featured: false
---

Vue can render a dedicated print component and start browser printing after reactive updates have reached the DOM. Template refs locate the element, but print CSS or a separate document controls scope.

## Component example

```vue
<script setup lang="ts">
import { nextTick, useTemplateRef } from "vue";

defineProps<{ receipt: Receipt }>();
const receiptElement = useTemplateRef<HTMLElement>("receipt");

async function printReceipt() {
  await nextTick();
  await document.fonts.ready;
  if (!receiptElement.value) return;
  window.print();
}
</script>

<template>
  <article ref="receipt" class="print-scope">
    <h1>Receipt</h1>
    <!-- render stable receipt data -->
  </article>
  <button class="screen-only" @click="printReceipt">Print</button>
</template>
```

## Print CSS

Use a global print stylesheet or ensure scoped CSS produces selectors available in the printable document. A dedicated print route avoids fragile whole-page visibility rules.

```css
@media print {
  .screen-only { display: none !important; }
  .print-scope { width: 72mm; }
}
```

## Portix integration

```ts
async function submitToRuntime(receipt: Receipt) {
  // [PORTIX DOCS REQUIRED]
  // Convert reactive data into a plain typed snapshot before submission.
}
```

Do not pass Vue proxies, refs, or component instances into a transport contract.

## Common mistakes

- Printing before `nextTick()` after changing preview state.
- Assuming a template ref limits browser print scope.
- Losing styles when cloning markup into a new window.
- Sending reactive proxies to a runtime.
- Running browser-only integration during SSR.
