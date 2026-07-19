---
title: "How to Print from Next.js"
slug: "print-from-nextjs"
description: "Print a Next.js App Router page from a Client Component while keeping data preparation on the server and local printer access in a trusted runtime."
quickAnswer: "Fetch and validate printable data in a Server Component, pass serializable data to a small Client Component marked 'use client', render the print view, and call window.print() from its click handler. Do not access window during server rendering. For automatic local printing, the client submits an authorized job to the Portix runtime; a Next.js server cannot directly reach an end user's USB printer."
contentType: "guide"
category: "frameworks"
primaryTopic: "printing from Next.js"
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
  src: "/images/knowledge/print-from-nextjs.svg"
  alt: "A Next.js client component calling window.print() to send a rendered view to a printer"
entities:
  - "Next.js"
  - "Server Components"
  - "Client Components"
  - "Portix"
tags:
  - "frameworks"
  - "Next.js"
  - "Portix"
relatedArticles:
  - "print-from-javascript"
  - "print-html"
  - "local-printing-runtime"
  - "silent-printing"
references:
  - title: "use client"
    url: "https://nextjs.org/docs/app/api-reference/directives/use-client"
    publisher: "Next.js"
    accessedAt: 2026-07-19
  - title: "Server and Client Components"
    url: "https://nextjs.org/docs/app/getting-started/server-and-client-components"
    publisher: "Next.js"
    accessedAt: 2026-07-19
featured: false
---

In the App Router, server components can load and authorize document data, while the print button must live behind a client boundary because `window` exists only in the browser.

## Server page

```tsx
// app/receipts/[id]/page.tsx
import { PrintReceipt } from "./print-receipt";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const receipt = await loadAuthorizedReceipt(id);
  return <PrintReceipt receipt={receipt} />;
}
```

## Client print component

```tsx
// app/receipts/[id]/print-receipt.tsx
"use client";

export function PrintReceipt({ receipt }: { receipt: SerializableReceipt }) {
  const print = async () => {
    await document.fonts.ready;
    window.print();
  };

  return (
    <>
      <article className="print-scope">{/* render receipt */}</article>
      <button className="screen-only" onClick={print}>Print</button>
    </>
  );
}
```

Next.js requires Client Component props to be serializable. Pass data, not database objects, functions, device handles, or runtime clients.

## API routes and printing

Route handlers can authorize, snapshot, or enqueue server-side documents. They should not claim access to a browser user's local printer. For local output, return a job contract that the authenticated client sends to its paired runtime.

## Portix boundary

```ts
// [PORTIX DOCS REQUIRED]
// Initialize only in a Client Component or client-only module.
// Submit stable job ID + typed receipt to an authorized local runtime.
```

Keep secrets on the server; never place privileged service credentials in the client bundle.

## Common mistakes

- Referencing `window` at module scope or in a Server Component.
- Marking an entire route `'use client'` merely for one button.
- Passing nonserializable data across the boundary.
- Printing before hydration or fonts finish.
- Letting a server endpoint accept arbitrary printer names/raw bytes.
