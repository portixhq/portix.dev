---
title: "Printing Runtime Disconnected"
slug: "runtime-disconnected"
description: "Recover from a disconnected local printing runtime without losing jobs or creating duplicate receipts and labels."
quickAnswer: "Stop new submissions, preserve pending jobs with stable IDs, determine whether the browser, runtime process, computer, or network path failed, then reconnect with bounded backoff. Reconcile job state before retrying so a brief disconnect does not duplicate output."
contentType: "troubleshooting"
category: "printing-infrastructure"
primaryTopic: "printing runtime disconnected"
searchIntent: "troubleshooting"
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
  src: "/images/knowledge/runtime-disconnected.svg"
  alt: "A broken connection between a web application and a local printing runtime"
entities:
  - "local printing runtime"
  - "reconnect backoff"
  - "idempotency"
  - "job reconciliation"
tags:
  - "troubleshooting"
  - "local runtime"
  - "reliability"
relatedArticles:
  - "print-queue"
  - "websocket-printing"
  - "unable-to-connect-to-localhost"
references: []
featured: false
---

## Diagnose it

1. Check whether only one tab, one workstation, or all workstations are affected.
2. Confirm the runtime is still running and healthy.
3. Inspect browser and runtime timestamps around the disconnect.
4. Check sleep, user sign-out, upgrade, certificate expiry, port collision, and security software.
5. Verify client/runtime protocol versions.

## Recovery pattern

Use connection states such as `connecting`, `ready`, `degraded`, and `offline`. Queue immutable jobs durably. Reconnect with exponential backoff plus jitter, authenticate again, request known job status where supported, and retry only jobs whose disposition is safe.

Never translate "socket closed" into "job failed." The runtime may have accepted the job before the connection disappeared.

## Prevent recurrence

- Add health and version telemetry without logging sensitive document content.
- Pause submissions during runtime upgrades.
- Handle workstation sleep and network changes explicitly.
- Alert after a bounded outage instead of retrying forever.

## Portix evidence needed

Reconnect semantics, durable queue ownership, status lookup, idempotency, heartbeat, upgrade behavior, and log locations aren't documented yet.

## Verify

Disconnect during each job phase and confirm recovery produces neither loss nor duplicates.
