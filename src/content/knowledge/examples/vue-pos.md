---
title: "Vue POS Example"
slug: "vue-pos"
description: "A Vue POS printing example using immutable receipt data, a composable adapter, guarded submission, and print-specific markup."
quickAnswer: "Keep the sale in domain state, create an immutable receipt after checkout, and use a composable to guard printing. The component renders data; the adapter owns browser or local-runtime behavior."
contentType: "example"
category: "frameworks"
primaryTopic: "Vue POS example"
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
  src: "/images/knowledge/vue-pos.svg"
  alt: "A Vue POS component calling window.print() to send a rendered receipt to a printer"
entities:
  - "Vue"
  - "receipt snapshot"
  - "composable"
  - "guarded submission"
tags:
  - "examples"
  - "Vue"
  - "POS"
relatedArticles:
  - "print-from-vue"
  - "build-a-retail-pos"
  - "react-receipt-printer"
references: []
featured: false
---

## Quick answer

Keep the sale in domain state, create an immutable receipt after checkout, and use a composable to guard printing. The component renders data; the adapter owns browser or local-runtime behavior.

```vue
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ receipt: Receipt }>();
const busy = ref(false);

async function printReceipt() {
  if (busy.value) return;
  busy.value = true;
  try {
    await document.fonts.ready;
    window.print();
    // A local-runtime alternative isn't documented yet.
  } finally { busy.value = false; }
}
</script>

<template>
  <article class="receipt">
    <h1>Receipt {{ receipt.id }}</h1>
    <p v-for="item in receipt.items" :key="item.id">
      <span>{{ item.name }}</span><strong>{{ item.total }}</strong>
    </p>
  </article>
  <button class="screen-only" :disabled="busy" @click="printReceipt">Print</button>
</template>
```

Use a versioned job key such as `saleId:receipt:version` for a runtime adapter. Never watch reactive cart state and print automatically; a watcher can fire multiple times during checkout.

## Verify

- The receipt no longer depends on mutable cart state.
- Double clicks are guarded.
- Long and localized content is tested.
- Payment does not roll back when printing fails.
