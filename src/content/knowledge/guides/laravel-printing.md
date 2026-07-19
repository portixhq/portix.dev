---
title: "How to Build a Printing Backend with Laravel"
slug: "laravel-printing"
description: "Create a Laravel print-job API with request validation, policies, idempotency, queued jobs, HTTP client controls, and Portix routing."
quickAnswer: "Use a Form Request for schema validation, policies/gates for printer-role authorization, a unique tenant-scoped idempotency key, and a database transaction that creates the job and dispatches it after commit. Return 202. A queued job calls the verified Portix API with explicit connection/read timeouts and controlled retries, then records documented states."
contentType: "guide"
category: "backend"
primaryTopic: "printing backend with Laravel"
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
  src: "/images/knowledge/laravel-printing.svg"
  alt: "A Laravel print-job API persisting a job, dispatching it to a durable worker, and routing it toward a printer"
entities:
  - "Laravel"
  - "queued job"
  - "policies"
  - "Portix"
tags:
  - "backend"
  - "Laravel"
  - "Portix"
relatedArticles:
  - "local-printing-runtime"
  - "print-raw-esc-pos"
  - "silent-printing"
  - "raw-printing"
references:
  - title: "Queues"
    url: "https://laravel.com/docs/queues"
    publisher: "Laravel"
    accessedAt: 2026-07-19
  - title: "HTTP Client"
    url: "https://laravel.com/docs/http-client"
    publisher: "Laravel"
    accessedAt: 2026-07-19
  - title: "Validation"
    url: "https://laravel.com/docs/validation"
    publisher: "Laravel"
    accessedAt: 2026-07-19
featured: false
---

Laravel can validate and authorize print-job requests, persist jobs, dispatch durable queue work, and call a Portix/site-agent API through its HTTP client.

## Route and controller

```php
Route::post('/print-jobs', [PrintJobController::class, 'store'])
    ->middleware('auth:sanctum');

public function store(StorePrintJobRequest $request): JsonResponse
{
    $this->authorize('create', [PrintJob::class, $request->printerRole()]);

    $job = $this->service->createOnce(
        $request->user(),
        (string) $request->header('Idempotency-Key'),
        $request->validated()
    );

    return response()->json(['jobId' => $job->id, 'state' => $job->state], 202);
}
```

Require and validate the header; the abbreviated example delegates atomic uniqueness to the service/database.

## Queue job

```php
final class SubmitPrintJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $jobId) {}

    public function handle(PortixTransport $transport): void
    {
        // [PORTIX DOCS REQUIRED]
    }
}
```

Set retry/backoff/timeout from documented failure semantics. Do not retry unknown delivery blindly.

## HTTP client

Laravel's HTTP client supports authentication, timeouts, retry configuration, testing fakes, and error inspection. Confirm behavior: it does not automatically throw on all 4xx/5xx responses unless application code requests that behavior.

## Common mistakes

- Dispatching before the database transaction commits.
- Using validation without authorization.
- Retrying every exception identically.
- Running a sync queue driver in production unintentionally.
- Storing full sensitive payloads in logs/failed-job metadata.
