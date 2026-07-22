---
title: "Warehouse Scanner Example"
slug: "warehouse-scanner"
description: "A warehouse scanner workflow with explicit task states, item/location validation, offline event IDs, and label printing boundaries."
quickAnswer: "Treat scanner input as data, not as trusted completion. Validate the expected location and item for the current task, attach a unique event ID, and advance state only after acceptance. Queue events durably when offline."
contentType: "example"
category: "applications"
primaryTopic: "warehouse scanner example"
searchIntent: "how-to"
audience: "web developers"
difficulty: "advanced"
status: "published"
noindex: false
publishedAt: 2026-07-21
updatedAt: 2026-07-21
author:
  name: "Portix.One"
  type: "Organization"
cover:
  src: "/images/knowledge/warehouse-scanner.svg"
  alt: "A scan event validated against the expected location and item before advancing the pick task state"
entities:
  - "scan event"
  - "task state machine"
  - "offline queue"
  - "reconciliation"
tags:
  - "examples"
  - "warehouse"
  - "scanning"
relatedArticles:
  - "build-a-warehouse-app"
  - "barcode-not-printing"
references: []
featured: false
---

## Quick answer

Treat scanner input as data, not as trusted completion. Validate the expected location and item for the current task, attach a unique event ID, and advance state only after acceptance. Queue events durably when offline.

```ts
type PickState =
  | { step: "scan-location"; taskId: string; expectedLocation: string }
  | { step: "scan-item"; taskId: string; expectedSku: string }
  | { step: "enter-quantity"; taskId: string; max: number }
  | { step: "complete"; taskId: string };

async function submitScan(taskId: string, rawValue: string) {
  const event = {
    id: crypto.randomUUID(),
    taskId,
    rawValue,
    capturedAt: new Date().toISOString()
  };
  return online ? api.validate(event) : offlineQueue.add(event);
}
```

Preserve scan order and reject stale tasks during reconciliation. Do not silently convert a server conflict into a completed pick. Packing or shipping-label printing uses a separate immutable shipment artifact, and its local-runtime integration isn't documented yet.

## Verify

- Wrong-location and wrong-item scans cannot advance.
- Duplicate event IDs are harmless.
- Offline restart preserves queued scans.
- Reconciliation surfaces allocation conflicts.
- Label success does not imply dispatch.
