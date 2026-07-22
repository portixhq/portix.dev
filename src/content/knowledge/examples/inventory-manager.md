---
title: "Inventory Manager Example"
slug: "inventory-manager"
description: "An inventory manager example built around idempotent stock movements, count reconciliation, barcode scans, and label jobs."
quickAnswer: "Record each stock change as an immutable movement. A scan proposes a movement; server validation accepts or rejects it. Label printing is a separate idempotent job and never changes quantity by itself."
contentType: "example"
category: "applications"
primaryTopic: "inventory manager example"
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
  src: "/images/knowledge/inventory-manager.svg"
  alt: "An idempotent stock movement feeding a separate label printing job"
entities:
  - "stock movement"
  - "count reconciliation"
  - "label version"
  - "idempotent job"
tags:
  - "examples"
  - "inventory"
  - "labels"
relatedArticles:
  - "build-an-inventory-system"
  - "label-printers-explained"
  - "warehouse-scanner"
references: []
featured: false
---

## Quick answer

Record each stock change as an immutable movement. A scan proposes a movement; server validation accepts or rejects it. Label printing is a separate idempotent job and never changes quantity by itself.

```ts
type Movement = {
  id: string;
  productId: string;
  locationId: string;
  quantityDelta: number;
  reason: "receipt" | "sale" | "transfer" | "adjustment";
  sourceId: string;
  occurredAt: string;
};

async function receive(scan: ReceiveScan) {
  return api.post("/movements", {
    id: crypto.randomUUID(),
    productId: scan.productId,
    locationId: scan.locationId,
    quantityDelta: scan.quantity,
    reason: "receipt",
    sourceId: scan.purchaseOrderId,
    occurredAt: new Date().toISOString()
  });
}
```

For labels, snapshot product name, identifier, lot, and template version. Use `productId:labelVersion:copy` as the logical print identity and record whether a copy is an initial issue or reprint. Submitting the immutable label through a local runtime such as Portix isn't documented yet.

## Verify

- Duplicate movement IDs are rejected safely.
- Negative-stock policy is explicit.
- Counts create auditable adjustments.
- Printed identifiers scan back exactly.
- Label retries do not add inventory.
