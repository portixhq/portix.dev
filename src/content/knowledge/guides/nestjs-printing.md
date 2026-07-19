---
title: "How to Build a Printing API with NestJS"
slug: "nestjs-printing"
description: "Create a NestJS printing module with DTO validation, guards, idempotency, durable job processing, status endpoints, and Portix agent routing."
quickAnswer: "Create a PrintingModule, validate DTOs with a global validation pipe, protect endpoints with authentication/authorization guards, and require an idempotency key. The controller asks an application service to persist and enqueue once, then returns 202. A processor/worker uses a Portix adapter and updates precise job state."
contentType: "guide"
category: "backend"
primaryTopic: "printing API with NestJS"
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
  src: "/images/knowledge/nestjs-printing.svg"
  alt: "A NestJS print-job API persisting a job, dispatching it to a durable worker, and routing it toward a printer"
entities:
  - "NestJS"
  - "guards"
  - "queue processor"
  - "Portix"
tags:
  - "backend"
  - "NestJS"
  - "Portix"
relatedArticles:
  - "local-printing-runtime"
  - "print-raw-esc-pos"
  - "silent-printing"
  - "raw-printing"
references:
  - title: "Controllers"
    url: "https://docs.nestjs.com/controllers"
    publisher: "NestJS"
    accessedAt: 2026-07-19
  - title: "Validation"
    url: "https://docs.nestjs.com/techniques/validation"
    publisher: "NestJS"
    accessedAt: 2026-07-19
  - title: "Queues"
    url: "https://docs.nestjs.com/techniques/queues"
    publisher: "NestJS"
    accessedAt: 2026-07-19
featured: false
---

NestJS can organize printing into controller, application service, repository, queue worker, and Portix adapter. Keep transport decorators out of core job logic.

## Controller

```ts
@Controller("print-jobs")
@UseGuards(AuthGuard, PrinterRoleGuard)
export class PrintJobsController {
  constructor(private readonly jobs: PrintJobsService) {}

  @Post()
  @HttpCode(202)
  async create(
    @Body() dto: CreatePrintJobDto,
    @Headers("idempotency-key") key: string,
    @Req() request: AuthenticatedRequest
  ) {
    if (!key) throw new BadRequestException("Idempotency-Key required");
    return this.jobs.createOnce(request.user, key, dto);
  }

  @Get(":id")
  get(@Param("id") id: string, @Req() req: AuthenticatedRequest) {
    return this.jobs.getAuthorized(req.user, id);
  }
}
```

## Service and adapter

```ts
export abstract class PrintTransport {
  abstract submit(job: StoredPrintJob): Promise<TransportResult>;
}

// PortixPrintTransport: [PORTIX DOCS REQUIRED]
```

The application service owns state transitions; the adapter maps official Portix states/errors without inflating guarantees.

## Module boundaries

- Controller: HTTP and DTO boundary.
- Guard: tenant/user/printer-role authorization.
- Service: idempotency and state machine.
- Repository: atomic persistence.
- Queue processor: retries and timeouts.
- Transport adapter: Portix/site-agent API.
- Status publisher: optional client updates.

## Common mistakes

- Mixing `@Res()` with standard response handling unnecessarily.
- Treating DTO validation as authorization.
- Retrying inside both service and queue library.
- Making transport callbacks mutate jobs without state checks.
- Registering a singleton credential across tenants.
