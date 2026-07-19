---
title: "How to Build a Printing API with Spring Boot"
slug: "spring-boot-printing"
description: "Create a Spring Boot print-job API with Bean Validation, authorization, idempotency, transactions, durable messaging, status, and Portix routing."
quickAnswer: "Use Bean Validation on a typed request record, authenticate with Spring Security, authorize the logical printer role, and require an idempotency key. Persist the job under a unique tenant/key constraint and publish work after commit through a durable broker/outbox. Return 202 Accepted with a status URI. A worker calls the official Portix agent API and updates a guarded state machine."
contentType: "guide"
category: "backend"
primaryTopic: "printing API with Spring Boot"
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
  src: "/images/knowledge/spring-boot-printing.svg"
  alt: "A Spring Boot print-job API persisting a job, publishing it to a durable worker, and routing it toward a printer"
entities:
  - "Spring Boot"
  - "Bean Validation"
  - "transactional outbox"
  - "Portix"
tags:
  - "backend"
  - "Spring Boot"
  - "Portix"
relatedArticles:
  - "local-printing-runtime"
  - "print-raw-esc-pos"
  - "silent-printing"
  - "raw-printing"
references:
  - title: "Building a RESTful Web Service"
    url: "https://spring.io/guides/gs/rest-service"
    publisher: "Spring"
    accessedAt: 2026-07-19
  - title: "Bean Validation"
    url: "https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html"
    publisher: "Spring"
    accessedAt: 2026-07-19
featured: false
---

Spring Boot can expose a validated REST controller, persist a print intent transactionally, publish durable work, and isolate Portix communication in an adapter.

## Request and controller

```java
public record CreatePrintJob(
    @NotBlank @Size(max = 64) String printerRole,
    @NotBlank String documentType,
    @NotNull Map<String, Object> data) {}

@RestController
@RequestMapping("/print-jobs")
class PrintJobsController {
  private final PrintJobService service;

  @PostMapping
  ResponseEntity<PrintJobResponse> create(
      @RequestHeader("Idempotency-Key") String key,
      @Valid @RequestBody CreatePrintJob request,
      Authentication authentication) {
    var job = service.createOnce(authentication, key, request);
    return ResponseEntity.accepted()
        .location(URI.create("/print-jobs/" + job.id()))
        .body(PrintJobResponse.from(job));
  }
}
```

Replace the unrestricted map with discriminated document DTOs and depth/size constraints in production.

## Transaction and outbox

Creating a database job and publishing a broker message as unrelated operations can lose or duplicate work. Use a transactional outbox or infrastructure with equivalent guarantees. The consumer remains idempotent by job ID.

## Portix adapter

```java
public interface PrintTransport {
  TransportResult submit(StoredPrintJob job);
}
// PortixPrintTransport: [PORTIX DOCS REQUIRED]
```

Configure timeouts, circuit behavior, credentials, and retries from documented semantics. Do not combine framework retries, broker redelivery, and client retries without one ownership model.

## Security and operations

- Method/resource authorization for tenant and printer role.
- Unique idempotency constraint.
- Secret management and agent credential rotation.
- Bounded request/document sizes.
- Dead-letter and operator recovery process.
- Metrics for queue age, unknown outcomes, and duplicates.
- Logs without full sensitive print payloads.

## Common mistakes

- Using `@Async` alone as a durable queue.
- Publishing before transaction commit.
- Letting Jackson bind arbitrary polymorphic types.
- Returning 201/200 as though printing completed.
- Retrying non-idempotent transport calls without reconciliation.
