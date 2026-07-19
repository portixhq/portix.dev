---
title: "How to Print from Astro"
slug: "print-from-astro"
description: "Print an Astro-rendered document with a small hydrated island, print CSS, and an optional trusted runtime for local printer control."
quickAnswer: "Render authorized document data in an .astro page, add global print CSS, and attach a small module script or hydrated framework component whose click handler calls window.print(). Use client:load only when a component truly needs hydration. For Portix, load a client-only printing island that submits typed data; never attempt local device access during Astro's server build or render."
contentType: "guide"
category: "frameworks"
primaryTopic: "printing from Astro"
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
  src: "/images/knowledge/print-from-astro.svg"
  alt: "An Astro island calling window.print() to send a rendered view to a printer"
entities:
  - "Astro"
  - "islands architecture"
  - "client:load"
  - "Portix"
tags:
  - "frameworks"
  - "Astro"
  - "Portix"
relatedArticles:
  - "print-from-javascript"
  - "print-html"
  - "local-printing-runtime"
  - "silent-printing"
references:
  - title: "Astro Template Syntax"
    url: "https://docs.astro.build/en/basics/astro-syntax/"
    publisher: "Astro"
    accessedAt: 2026-07-19
  - title: "Template Directives"
    url: "https://docs.astro.build/en/reference/directives-reference/"
    publisher: "Astro"
    accessedAt: 2026-07-19
featured: false
---

Astro can render most printable content as server-generated HTML and hydrate only the small control that needs browser APIs. This keeps the document simple while preserving interactive printing.

## Astro page example

```astro
---
const receipt = await loadAuthorizedReceipt(Astro.params.id);
---

<article class="print-scope">
  <h1>Receipt</h1>
  {receipt.items.map(item => <div>{item.name}</div>)}
</article>
<button id="print" class="screen-only">Print</button>

<script>
  document.querySelector("#print")?.addEventListener("click", async () => {
    await document.fonts.ready;
    window.print();
  });
</script>
```

Astro processes its client script for browser execution. Keep the receipt snapshot safe and avoid exposing server secrets.

## Using an island

```astro
<PortixPrintButton client:load job={safeSerializableJob} />
```

The component and API are conceptual; Portix integration is **[PORTIX DOCS REQUIRED]**. Pass only serializable data required for the job.

## Common mistakes

- Calling browser APIs in frontmatter.
- Hydrating the entire printable page for one button.
- Exposing privileged tokens in component props.
- Printing before client assets are ready.
- Assuming static generation is appropriate for sensitive per-user documents.
