---
title: "How to Print Your First Receipt with Portix"
slug: "print-your-first-receipt"
description: "Create a minimal receipt, send it to an authorized printer role, interpret job status, and verify physical output safely."
quickAnswer: "Confirm that the runtime is connected and a receipt printer is paired, create a small immutable receipt payload, assign a unique job ID, submit it to the customer-receipt role, and observe the returned state without equating submission with physical completion. Inspect text, totals, width, encoding, feed, and cut on paper. Portix package names, initialization, payload schema, method names, and status values are pending official Portix documentation."
contentType: "guide"
category: "getting-started"
primaryTopic: "printing your first receipt"
searchIntent: "how-to"
audience: "web developers"
difficulty: "beginner"
status: "draft"
noindex: true
publishedAt: 2026-07-19
updatedAt: 2026-07-19
author:
  name: "Portix.One"
  type: "Organization"
cover:
  src: "/images/knowledge/print-your-first-receipt.svg"
  alt: "A sample receipt job submitted to a paired printer role and printed as a physical test receipt"
entities:
  - "print job"
  - "job status"
  - "receipt verification"
tags:
  - "getting started"
  - "first print"
  - "Portix"
relatedArticles:
  - "pair-your-first-printer"
  - "connect-your-runtime"
  - "install-portix"
  - "what-is-esc-pos"
references: []
featured: false
---

This guide validates the complete path from application data to physical output. Use a non-sensitive sample transaction, a stable job ID, and a paired `customer-receipt` role. The exact Portix SDK/API syntax must be added from official documentation before publication.

## Prerequisites

- Portix installed and connected.
- `customer-receipt` role paired to a verified printer.
- Correct paper loaded and cover closed.
- Test user authorized to print.
- Official Portix JavaScript SDK or API documentation.

## 1. Create sample receipt data

```js
const receipt = Object.freeze({
  id: "demo-sale-0001",
  currency: "USD",
  items: [
    { name: "Coffee", quantity: 1, unitPrice: 3.5 },
    { name: "Sandwich", quantity: 1, unitPrice: 8.0 }
  ],
  total: 11.5
});
```

The values are synthetic. In production, derive output from a committed transaction and format money with explicit currency and locale rules.

## 2. Initialize the Portix client

```js
// [PORTIX DOCS REQUIRED]
// Import the official package and initialize it using the verified API.
```

Required facts before publication:

- Package/script name and supported version.
- Authentication and runtime connection method.
- Error and reconnect contract.
- Browser/framework support.

## 3. Build the print job

```js
const job = {
  jobId: `${receipt.id}:customer-receipt:v1`,
  printerRole: "customer-receipt",
  documentType: "receipt",
  data: receipt
};
```

This is a conceptual contract, not a claimed Portix schema. Use the official typed payload once documented.

## 4. Submit the job

```js
// [PORTIX DOCS REQUIRED]
// const result = await portix.print(job);
```

Do not generate a new job ID on every retry. Reuse the same intended-output ID until the outcome is reconciled; create an explicitly authorized reprint identifier when another physical copy is intended.

## 5. Interpret status precisely

The official API should be mapped to meanings such as:

| Concept | Meaning |
|---|---|
| Accepted | Portix accepted responsibility for the job |
| Queued | A queue recorded it |
| Sent | Data moved toward the device |
| Completed | Terminal state according to documented lower layer |
| Failed | Known failure with recovery information |
| Unknown | Delivery cannot be determined safely |

Actual Portix state names and guarantees are **[PORTIX DOCS REQUIRED]**.

## 6. Verify physical output

Check:

- Merchant/demo header is readable.
- Item names and quantities align.
- Total is exactly `11.50 USD` under the chosen format.
- No characters are corrupted.
- Nothing is clipped at either edge.
- Feed and cut are appropriate.
- Repeating the verification does not create an unintended duplicate.

## Error handling skeleton

```js
async function printFirstReceipt(job) {
  try {
    // return await portix.print(job); // [PORTIX DOCS REQUIRED]
    throw new Error("Replace with the verified Portix API before running");
  } catch (error) {
    // Map official structured Portix errors; do not parse invented messages.
    console.error("Receipt submission failed", { jobId: job.jobId, error });
    throw error;
  }
}
```

This intentionally refuses to pretend the missing SDK call exists.

## Troubleshooting

| Problem | Check |
|---|---|
| Runtime disconnected | Runtime health, pairing, version, local connection |
| Printer role missing | Pairing and location configuration |
| Blank paper | Thermal coating orientation, data path, profile |
| Gibberish | Encoding and printer language |
| Receipt clipped | Printable dot width and template |
| Duplicate receipt | Job identity and retry behavior |
| No cut | Model/profile/authorization and hardware state |

## Frequently asked questions

### Can I use real customer data for the first test?

Use synthetic data until configuration, logs, routing, and physical handling are verified.

### Does a successful API call prove paper printed?

Only if official Portix documentation defines and supports that guarantee. Otherwise treat it as the documented handoff state.

### Can I print HTML instead?

Use the verified Portix HTML capability if supported, or standard browser printing when user confirmation is acceptable. The Portix format matrix is **[PORTIX DOCS REQUIRED]**.
