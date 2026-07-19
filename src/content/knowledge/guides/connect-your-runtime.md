---
title: "How to Connect Your Portix Runtime"
slug: "connect-your-runtime"
description: "Connect an approved web application to the local Portix runtime, verify identity and compatibility, and diagnose connection problems safely."
quickAnswer: "Start the installed Portix runtime, open the approved Portix-enabled application, initiate the connection from a clear user action, verify the application identity shown by the runtime, and approve only the required capabilities. Confirm protocol version and runtime health before listing or pairing printers. Exact endpoint, pairing-code, token, certificate, and UI details are pending official Portix documentation."
contentType: "guide"
category: "getting-started"
primaryTopic: "connecting the Portix runtime"
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
  src: "/images/knowledge/connect-your-runtime.svg"
  alt: "A web application requesting a trusted connection to the local runtime, approved by the user"
entities:
  - "Portix runtime"
  - "runtime pairing"
  - "connection states"
tags:
  - "getting started"
  - "runtime"
  - "Portix"
relatedArticles:
  - "install-portix"
  - "pair-your-first-printer"
  - "print-your-first-receipt"
references: []
featured: false
---

Connecting the runtime establishes a trusted application-to-local-service relationship. This is different from pairing a printer: first the application proves that it may use the runtime; later the runtime maps authorized printer roles to hardware.

## Prerequisites

- Portix installed and healthy.
- Supported browser and operating system.
- Approved application origin/account.
- User authorized to enroll the terminal.
- Local loopback/WebSocket policy satisfied.
- Current system time for expiring credentials.

## Connection model

```text
Approved web application
       ↓ connection request
Local Portix runtime
       ↓ identity + capability prompt
User or administrator approval
       ↓ paired session/credential
Capability and version handshake
       ↓
Runtime ready for printer pairing
```

## 1. Check runtime health

Open the Portix status UI or run the documented health check:

```text
[PORTIX HEALTH CHECK REQUIRED]
```

Verify version, runtime state, local endpoint, and update state. Stop if the runtime is unverified or incompatible.

## 2. Start connection from the application

Use the application's **Connect runtime** action.

> Add exact UI label, URL, and browser permission flow: **[PORTIX DOCS REQUIRED]**.

Do not ask users to disable browser security, install untrusted certificates, or approve unrelated origins.

## 3. Verify identity and scope

The approval screen should identify:

- Application/origin requesting access.
- Signed-in organization or tenant.
- Terminal or user being enrolled.
- Requested capabilities.
- Credential duration and revocation path.

Reject the request if any identity is unexpected.

## 4. Complete the handshake

After approval, the application and runtime should negotiate a compatible protocol and feature set. A successful UI should distinguish:

- Runtime connected.
- Runtime version supported.
- Session authenticated.
- Printer not yet paired, if applicable.

Exact events and API response are **[PORTIX DOCS REQUIRED]**.

## 5. Verify reconnect behavior

Reload the page and restart the browser. Confirm whether the connection resumes, asks for approval, or reports expiration according to policy. Then restart the runtime and verify safe recovery without duplicate jobs.

## Connection states

| State | Meaning | User action |
|---|---|---|
| Not installed | Runtime endpoint unavailable | Install from official source |
| Disconnected | Runtime not reachable | Start runtime and diagnose local connection |
| Approval required | Identity not paired | Verify and approve request |
| Incompatible | Protocol/version mismatch | Update supported component |
| Connected | Authenticated channel ready | Pair a printer |
| Revoked/expired | Credential no longer valid | Re-enroll under policy |

## Troubleshooting

| Problem | Check |
|---|---|
| Connection refused | Runtime process, endpoint, port conflict |
| Browser blocks request | HTTPS/WSS, certificate, local-network permission |
| Origin rejected | Exact approved origin and environment |
| Pairing code fails | Expiration, tenant, clock, one-time use |
| Reconnect loops | Runtime/web version, stale credential, backoff |
| Connected but no printers | Separate OS/printer mapping issue |

## Security checklist

- [ ] Runtime identity is verified, not inferred from a port response.
- [ ] Origin is exact; wildcard access is not used.
- [ ] Pairing credential is short-lived or revocable.
- [ ] Capabilities follow least privilege.
- [ ] Tokens are not stored in URLs or logs.
- [ ] Reconnects use backoff and do not replay print jobs.
- [ ] User can inspect and revoke connected applications.

## Frequently asked questions

### Is connecting the runtime the same as pairing a printer?

No. Runtime connection authorizes the application-to-service relationship. Printer pairing configures an output destination.

### Why does the browser ask for local-network permission?

Current browsers can mediate access from public sites to loopback or local resources. Exact behavior depends on browser/version and Portix transport.

### Can multiple applications connect?

**[PORTIX DOCS REQUIRED]**. The runtime should enforce separate identities and scopes if supported.
