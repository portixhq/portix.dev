---
title: "Restaurant POS Example"
slug: "restaurant-pos"
description: "An example restaurant POS job model for versioned kitchen tickets, station routing, guest receipts, retries, and reprints."
quickAnswer: "Commit an order version, calculate the production delta, create one job per station, and use a deterministic key. Print the guest receipt from the paid order snapshot, not from the kitchen ticket."
contentType: "example"
category: "applications"
primaryTopic: "restaurant POS example"
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
  src: "/images/knowledge/restaurant-pos.svg"
  alt: "A versioned order producing per-station production tickets and a separate guest receipt job"
entities:
  - "order version"
  - "production delta"
  - "station routing"
  - "deterministic job key"
tags:
  - "examples"
  - "restaurant POS"
  - "kitchen tickets"
relatedArticles:
  - "build-a-restaurant-pos"
  - "print-queue"
references: []
featured: false
---

## Quick answer

Commit an order version, calculate the production delta, create one job per station, and use a deterministic key. Print the guest receipt from the paid order snapshot, not from the kitchen ticket.

```ts
function createStationJobs(order: OrderVersion, previous?: OrderVersion) {
  const changed = productionDelta(previous, order);
  return groupByStation(changed).map(([stationId, items]) => ({
    id: `${order.id}:${order.version}:production:${stationId}`,
    kind: "production-ticket",
    stationId,
    orderId: order.id,
    orderVersion: order.version,
    items
  }));
}
```

Example sequence:

1. Order 42 version 1 sends food to Kitchen and drinks to Bar.
2. Version 2 adds one dessert; only the dessert delta prints.
3. A void creates a clearly labeled cancellation ticket.
4. Payment completion creates a separate guest-receipt job.

The dispatcher persists jobs before submission, maps stations to configured printers, and records attempts. A disconnect after submission leaves the job `unknown` until reconciled; it does not automatically create a new job.

```ts
// Portix adapter methods and status mapping aren't documented yet.
await dispatcher.submit(job);
```

## Verify

- Modifiers and voids are unmistakable.
- Retrying a version does not duplicate it.
- Station fallback requires authorization.
- Payment and production printing fail independently.
