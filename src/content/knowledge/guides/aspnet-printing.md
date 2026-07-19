---
title: "How to Build a Printing API with ASP.NET Core"
slug: "aspnet-printing"
description: "Create an ASP.NET Core print-job API with DTO validation, authorization, idempotency, durable background processing, status, and Portix routing."
quickAnswer: "Authenticate the caller, validate a typed request, authorize the logical printer role, require a tenant-scoped idempotency key, and create the job atomically. Return 202 Accepted with a status URL. A durable background processor—not an unbounded Task.Run inside the request—submits through Portix and records precise states. The server cannot directly reach a user's local printer without a connected runtime."
contentType: "guide"
category: "backend"
primaryTopic: "printing API with ASP.NET Core"
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
  src: "/images/knowledge/aspnet-printing.svg"
  alt: "An ASP.NET Core print-job API persisting a job, dispatching it to a durable worker, and routing it toward a printer"
entities:
  - "ASP.NET Core"
  - "BackgroundService"
  - "idempotency key"
  - "Portix"
tags:
  - "backend"
  - "ASP.NET Core"
  - "Portix"
relatedArticles:
  - "local-printing-runtime"
  - "print-raw-esc-pos"
  - "silent-printing"
  - "raw-printing"
references:
  - title: "Create Web APIs with ASP.NET Core"
    url: "https://learn.microsoft.com/en-us/aspnet/core/web-api/"
    publisher: "Microsoft Learn"
    accessedAt: 2026-07-19
  - title: "Hosted Services"
    url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services"
    publisher: "Microsoft Learn"
    accessedAt: 2026-07-19
featured: false
---

ASP.NET Core can expose controller or Minimal API endpoints for print jobs. Persist the job before background execution and route it through a durable worker or site agent.

## Controller example

```csharp
[ApiController]
[Route("print-jobs")]
public sealed class PrintJobsController(IPrintJobService jobs) : ControllerBase
{
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(
        [FromBody] CreatePrintJob request,
        [FromHeader(Name = "Idempotency-Key")] string key,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(key))
            return BadRequest(new { error = "Idempotency-Key required" });

        var job = await jobs.CreateOnceAsync(User, key, request, cancellationToken);
        return AcceptedAtAction(nameof(Get), new { id = job.Id },
            new { jobId = job.Id, state = job.State });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct) =>
        Ok(await jobs.GetAuthorizedAsync(User, id, ct));
}
```

## Background execution

Use a durable queue/worker appropriate to deployment. `BackgroundService` with an in-memory channel can coordinate process-local work but is not durable across failure without persistent storage.

```csharp
public interface IPrintTransport
{
    Task<TransportResult> SubmitAsync(PrintJob job, CancellationToken ct);
}
// Portix implementation: [PORTIX DOCS REQUIRED]
```

## Required controls

- Input size and model validation.
- Resource/role authorization.
- Unique idempotency constraint.
- Optimistic state transitions.
- Bounded retries and unknown-outcome handling.
- Typed `HttpClient` with timeout and resilience policy.
- Secret storage and credential rotation.
- Structured logs without document bodies.

## Common mistakes

- Starting untracked work after returning the request.
- Reusing cancellation tied to the disconnected client for durable jobs.
- Returning `Created` or `OK printed` before execution.
- Applying retry at both HTTP handler and worker without coordination.
- Trusting model binding as authorization.
