---
title: "How to Build a Printing API with FastAPI"
slug: "fastapi-printing"
description: "Create a FastAPI print-job endpoint with Pydantic validation, dependencies, idempotency, durable processing, status, and Portix routing."
quickAnswer: "Define a strict Pydantic request model, authenticate through a dependency, authorize the printer role, require an idempotency key, persist/create once, and return 202 with a status URL. Use BackgroundTasks only for small noncritical same-process follow-up; durable printing needs external/persistent task execution and reconciliation. A Portix adapter submits to the appropriate runtime or site agent."
contentType: "guide"
category: "backend"
primaryTopic: "printing API with FastAPI"
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
  src: "/images/knowledge/fastapi-printing.svg"
  alt: "A FastAPI print-job API persisting a job, dispatching it to a durable worker, and routing it toward a printer"
entities:
  - "FastAPI"
  - "Pydantic"
  - "BackgroundTasks"
  - "Portix"
tags:
  - "backend"
  - "FastAPI"
  - "Portix"
relatedArticles:
  - "local-printing-runtime"
  - "print-raw-esc-pos"
  - "silent-printing"
  - "raw-printing"
references:
  - title: "Request Body"
    url: "https://fastapi.tiangolo.com/tutorial/body/"
    publisher: "FastAPI"
    accessedAt: 2026-07-19
  - title: "Background Tasks"
    url: "https://fastapi.tiangolo.com/tutorial/background-tasks/"
    publisher: "FastAPI"
    accessedAt: 2026-07-19
featured: false
---

FastAPI provides typed request validation and dependency injection for a print-job API. Durable printer work should be persisted and executed by a queue worker, not assumed safe merely because `BackgroundTasks` runs after the response.

## Endpoint example

```python
from typing import Literal
from fastapi import Depends, FastAPI, Header, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field

app = FastAPI()

class CreatePrintJob(BaseModel):
    model_config = ConfigDict(extra="forbid")
    printer_role: str = Field(min_length=1, max_length=64)
    document_type: Literal["receipt", "label", "report"]
    data: dict

@app.post("/print-jobs", status_code=status.HTTP_202_ACCEPTED)
async def create_job(
    body: CreatePrintJob,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
    user = Depends(require_user),
):
    if not idempotency_key:
        raise HTTPException(400, "Idempotency-Key required")
    await authorize_role(user, body.printer_role)
    job = await create_once(user.tenant_id, idempotency_key, body)
    await enqueue_durably(job.id)
    return {"jobId": str(job.id), "state": job.state}
```

Bound nested data with a document-specific schema rather than leaving `dict` unrestricted in production.

## Worker

```python
async def submit(job):
    # [PORTIX DOCS REQUIRED]
    # Use explicit connect/read timeouts and documented retry semantics.
    ...
```

## State and errors

Persist transitions atomically. Map validation/authorization, permanent device-profile errors, transient agent unavailability, and unknown outcomes separately. Do not make the worker retry a malformed job.

## Common mistakes

- Using `BackgroundTasks` as a durable queue.
- Accepting arbitrary `dict` payloads without limits.
- Re-enqueueing an existing idempotent job on every call.
- Blocking the event loop with synchronous driver/network code.
- Returning a completed state when only enqueued.
