---
title: "How to Print from Angular"
slug: "print-from-angular"
description: "Build an Angular print component, wait for stable rendering, apply print styles, use browser-only APIs safely, and integrate a local printing service."
quickAnswer: "Create a print component, apply global @media print styles, call window.print() from a user event after data and assets are ready, and guard browser APIs when Angular runs with server-side rendering. For Portix, inject a service that accepts plain job data and stable IDs; do not expose raw device authority across arbitrary components."
contentType: "guide"
category: "frameworks"
primaryTopic: "printing from Angular"
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
  src: "/images/knowledge/print-from-angular.svg"
  alt: "An Angular component calling window.print() to send a rendered view to a printer"
entities:
  - "Angular"
  - "PLATFORM_ID"
  - "dependency injection"
  - "Portix"
tags:
  - "frameworks"
  - "Angular"
  - "Portix"
relatedArticles:
  - "print-from-javascript"
  - "print-html"
  - "local-printing-runtime"
  - "silent-printing"
references:
  - title: "Referencing Component Children with Queries"
    url: "https://angular.dev/guide/components/queries"
    publisher: "Angular"
    accessedAt: 2026-07-19
  - title: "Server-side Rendering"
    url: "https://angular.dev/guide/ssr"
    publisher: "Angular"
    accessedAt: 2026-07-19
featured: false
---

Angular should render printable data through a component and invoke the browser only from the client. Keep local printer communication in an injectable service with a narrow typed contract.

## Component example

```ts
import { Component, inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-print-button",
  standalone: true,
  template: `<button class="screen-only" (click)="print()">Print</button>`
})
export class PrintButtonComponent {
  private platformId = inject(PLATFORM_ID);

  async print() {
    if (!isPlatformBrowser(this.platformId)) return;
    await document.fonts.ready;
    window.print();
  }
}
```

## Print styles

Place page-wide rules in a global stylesheet so view encapsulation does not prevent them from affecting the document:

```css
@media print {
  .screen-only { display: none !important; }
  app-receipt { display: block; width: 72mm; }
}
```

## Runtime service boundary

```ts
export abstract class PrintingService {
  abstract submit(job: PrintJob): Promise<PrintResult>;
}

// Portix implementation: [PORTIX DOCS REQUIRED]
```

Use dependency injection for testing and environment-specific implementations. Accept plain validated data, not `ElementRef` or component objects.

## Common mistakes

- Calling `window` during server rendering.
- Keeping print-only CSS inside an encapsulated component when it must affect the page.
- Printing before Observable/signal data is settled.
- Allowing arbitrary printer names or raw commands in UI components.
- Retrying unknown outcomes without a stable job ID.
