---
title: "How to Print from Nuxt"
slug: "print-from-nuxt"
description: "Print from a Nuxt client component while using server rendering for authorized data and a trusted local runtime for device access."
quickAnswer: "Render receipt or document data in a Nuxt page, place browser-only print controls inside a client component or <ClientOnly>, wait for Vue's DOM update and assets, then call window.print(). Keep Portix initialization in a .client.ts plugin or client component. Never let server rendering access window, and never place privileged backend credentials in the browser runtime client."
contentType: "guide"
category: "frameworks"
primaryTopic: "printing from Nuxt"
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
  src: "/images/knowledge/print-from-nuxt.svg"
  alt: "A Nuxt client component calling window.print() to send a rendered view to a printer"
entities:
  - "Nuxt"
  - "ClientOnly"
  - "Nitro"
  - "Portix"
tags:
  - "frameworks"
  - "Nuxt"
  - "Portix"
relatedArticles:
  - "print-from-javascript"
  - "print-html"
  - "local-printing-runtime"
  - "silent-printing"
references:
  - title: "<ClientOnly>"
    url: "https://nuxt.com/docs/3.x/api/components/client-only"
    publisher: "Nuxt"
    accessedAt: 2026-07-19
  - title: "Nuxt Lifecycle"
    url: "https://nuxt.com/docs/3.x/guide/concepts/nuxt-lifecycle"
    publisher: "Nuxt"
    accessedAt: 2026-07-19
featured: false
---

Nuxt renders on both server and client. Prepare authorized document data through Nuxt's server/data layer, but call browser printing or a local runtime only after the component is mounted in the browser.

## Page example

```vue
<script setup lang="ts">
const { data: receipt } = await useFetch(`/api/receipts/${useRoute().params.id}`);
</script>

<template>
  <article class="print-scope"><!-- render receipt --></article>
  <ClientOnly>
    <PrintButton />
  </ClientOnly>
</template>
```

```vue
<!-- components/PrintButton.client.vue -->
<script setup lang="ts">
async function printPage() {
  await nextTick();
  await document.fonts.ready;
  window.print();
}
</script>
<template><button class="screen-only" @click="printPage">Print</button></template>
```

## Portix client plugin

```ts
// plugins/portix.client.ts
export default defineNuxtPlugin(() => {
  // [PORTIX DOCS REQUIRED]
  // Return a narrow client for the verified Portix browser API.
});
```

Do not invent a global API until its official package, initialization, and typing are documented.

## Server responsibilities

Nuxt/Nitro can authorize the receipt, produce an immutable snapshot, and issue a short-lived job capability. It cannot directly reach the browser workstation's USB printer without a site agent/runtime.

## Common mistakes

- Reading `window` during SSR.
- Wrapping the entire page in `<ClientOnly>` unnecessarily.
- Printing while async data still shows a placeholder.
- Exposing server credentials through runtime config.
- Treating Nitro queue acceptance as local printer completion.
