---
title: "Shipping Labels Example"
slug: "shipping-labels"
description: "A reliable shipping-label workflow that separates carrier purchase, immutable artifacts, printer profiles, retries, voids, and dispatch."
quickAnswer: "Purchase a carrier label once, preserve the original returned artifact, and print it through a profile matching its format, size, resolution, and printer language. A reprint reuses the artifact; it must not purchase a second shipment."
contentType: "example"
category: "applications"
primaryTopic: "shipping labels example"
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
  src: "/images/knowledge/shipping-labels.svg"
  alt: "An immutable carrier label artifact printed through a matching printer profile"
entities:
  - "carrier label"
  - "artifact checksum"
  - "printer profile"
  - "reprint"
tags:
  - "examples"
  - "shipping labels"
  - "warehouse"
relatedArticles:
  - "build-a-warehouse-app"
  - "raw-printing-vs-pdf-printing"
references: []
featured: false
---

## Quick answer

Purchase a carrier label once, preserve the original returned artifact, and print it through a profile matching its format, size, resolution, and printer language. A reprint reuses the artifact; it must not purchase a second shipment.

```ts
type ShippingLabel = {
  shipmentId: string;
  carrierLabelId: string;
  format: "pdf" | "png" | "zpl";
  media: "4x6in";
  sha256: string;
  artifactUrl: string;
};

function printJob(label: ShippingLabel, printerId: string) {
  return {
    id: `${label.carrierLabelId}:${label.sha256}:${printerId}`,
    printerId,
    format: label.format,
    source: label.artifactUrl
  };
}
```

Validate remote URLs server-side or download through an authorized service; do not let arbitrary browser input make a local runtime fetch internal resources. Preserve the carrier artifact and checksum for audit.

Portix's supported formats, URL policy, and submit call aren't documented yet.

## Verify

- Printed dimensions are exactly 4 × 6 inches where required.
- Barcode scans and human-readable tracking match.
- Retry does not repurchase postage.
- Void and reprint are distinct audited actions.
- PDF scaling is disabled when appropriate.
