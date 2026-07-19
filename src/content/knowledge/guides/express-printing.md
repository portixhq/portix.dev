---
title: "How to Build a Printing API with Express"
slug: "express-printing"
description: "Create an Express print-job endpoint with authentication, schema validation, idempotency, durable queues, status, and local agent routing."
quickAnswer: "Use authenticated routes, a strict JSON limit, schema validation, tenant-scoped printer roles, and an Idempotency-Key. Persist the job and enqueue it atomically, then return 202 with a status URL. A worker submits through the verified Portix server/runtime contract. Never accept an unrestricted local printer name, file path, URL, or raw command stream from the request."
contentType: "guide"
category: "backend"
primaryTopic: "printing API with Express"
searchIntent: "how-to"
audience: "web developers"
difficulty: "advanced"
status: "draft"
noindex: true
publishedAt: 2026-07-19
updatedAt: 2026-07-19
author:
  name: "Portix.One"
  type: "Organization"
cover:
  src: "/images/knowledge/express-printing.svg"
  alt: "An Express print-job API persisting a job, dispatching it to a durable worker, and routing it toward a printer"
entities:
  - "Express"
  - "idempotency key"
  - "durable queue"
  - "Portix"
tags:
  - "backend"
  - "Express"
  - "Portix"
relatedArticles:
  - "local-printing-runtime"
  - "print-raw-esc-pos"
  - "silent-printing"
  - "raw-printing"
references:
  - title: "Express Routing"
    url: "https://expressjs.com/en/guide/routing.html"
    publisher: "Express"
    accessedAt: 2026-07-19
  - title: "Express Error Handling"
    url: "https://expressjs.com/en/guide/error-handling.html"
    publisher: "Express"
    accessedAt: 2026-07-19
featured: false
---

Express can provide a small HTTP boundary for print-job creation and status. Keep printer execution in a worker or connected site agent rather than blocking route handlers.

## Route example

```ts
import express from "express";
const app = express();
app.use(express.json({ limit: "64kb", strict: true }));

app.post("/print-jobs", requireUser, async (req, res, next) => {
  try {
    const key = req.get("Idempotency-Key");
    if (!key) return res.status(400).json({ error: "Idempotency-Key required" });

    const input = PrintJobSchema.parse(req.body);
    await authorizePrinterRole(req.user, input.printerRole);
    const job = await createJobOnce({ key, tenantId: req.user.tenantId, input });

    res.status(202).location(`/print-jobs/${job.id}`).json({
      jobId: job.id, state: job.state
    });
  } catch (error) { next(error); }
});
```

`PrintJobSchema`, authorization, and atomic persistence are application components, not Express built-ins.

## Status route

Return only states and error details the caller is authorized to see. Define `accepted`, `queued`, `sending`, `completed`, `failed`, and `unknown` against observable boundaries.

## Worker

```ts
async function processJob(job: StoredPrintJob) {
  // [PORTIX DOCS REQUIRED]
  // Submit with the same stable job ID and reconcile official status.
}
```

## Error middleware

Map validation to 400, authentication to 401, authorization to 403, duplicate conflict according to idempotency semantics, overload to 429/503, and internal failures without leaking secrets.

## Common mistakes

- Trusting `req.body` before validation.
- Using `cors()` with broad origins as printer authorization.
- Returning `200 printed` when only queued.
- Running long printer I/O in the route.
- Logging full labels or receipts.
