---
title: "How to Build a Printing Backend with Django"
slug: "django-printing"
description: "Create a Django print-job endpoint with validation, permissions, idempotency, transactions, durable task processing, and Portix routing."
quickAnswer: "Accept a bounded JSON document, authenticate the user, validate fields, authorize the logical printer role, and require an idempotency key. In transaction.atomic(), retrieve or create a tenant-scoped job and enqueue it after commit. Return 202 with a status URL. A task worker calls the verified Portix/site-agent API and updates a guarded state machine."
contentType: "guide"
category: "backend"
primaryTopic: "printing backend with Django"
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
  src: "/images/knowledge/django-printing.svg"
  alt: "A Django print-job API persisting a job, dispatching it to a durable worker, and routing it toward a printer"
entities:
  - "Django"
  - "transaction.atomic"
  - "task worker"
  - "Portix"
tags:
  - "backend"
  - "Django"
  - "Portix"
relatedArticles:
  - "local-printing-runtime"
  - "print-raw-esc-pos"
  - "silent-printing"
  - "raw-printing"
references:
  - title: "Django Transactions"
    url: "https://docs.djangoproject.com/en/stable/topics/db/transactions/"
    publisher: "Django"
    accessedAt: 2026-07-19
  - title: "Django Tasks"
    url: "https://docs.djangoproject.com/en/dev/topics/tasks/"
    publisher: "Django"
    accessedAt: 2026-07-19
featured: false
---

Django can authorize and persist print jobs through views and models, then hand execution to a durable task backend. Do not keep physical printing inside a web request.

## Model constraint

```python
class PrintJob(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.PROTECT)
    idempotency_key = models.CharField(max_length=128)
    state = models.CharField(max_length=32, default="accepted")
    payload = models.JSONField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["tenant", "idempotency_key"],
                name="unique_print_intent_per_tenant",
            )
        ]
```

## View outline

```python
@require_POST
@login_required
def create_print_job(request):
    key = request.headers.get("Idempotency-Key")
    data = validate_bounded_print_job(request.body, key)
    authorize_printer_role(request.user, data["printerRole"])

    with transaction.atomic():
        job, _ = PrintJob.objects.get_or_create(
            tenant=request.user.tenant,
            idempotency_key=key,
            defaults={"payload": data},
        )
        transaction.on_commit(lambda: enqueue_print_job(job.pk))

    return JsonResponse({"jobId": job.pk, "state": job.state}, status=202)
```

The helpers and task backend must be implemented and tested; avoid enqueuing an existing job again unintentionally.

## Worker boundary

```python
def submit_to_portix(job):
    # [PORTIX DOCS REQUIRED]
    pass
```

Use durable queue semantics and database locking/versioning to prevent concurrent state corruption.

## Common mistakes

- Queuing before database commit.
- Storing jobs only in cache.
- Treating CSRF alone as API authorization.
- Retrying all exceptions, including permanent validation errors.
- Logging full receipt/label data.
- Using development task execution settings in production.
