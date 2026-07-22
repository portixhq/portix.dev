---
title: "Cash Drawer Won't Open"
slug: "cash-drawer-wont-open"
description: "Diagnose cash-drawer failures involving wiring, printer ports, pulse commands, power, permissions, events, and mechanical locks."
quickAnswer: "Confirm the drawer is connected to the correct printer drawer port with the correct cable—not a network cable—and that the key lock is in its operating position. Test the drawer through the printer vendor utility, then verify the documented pulse command, connector pin, timing, raw path, and application authorization."
contentType: "troubleshooting"
category: "thermal-printing"
primaryTopic: "cash drawer won't open"
searchIntent: "troubleshooting"
audience: "web developers"
difficulty: "intermediate"
status: "published"
noindex: false
publishedAt: 2026-07-21
updatedAt: 2026-07-21
author:
  name: "Portix.One"
  type: "Organization"
cover:
  src: "/images/knowledge/cash-drawer-wont-open.svg"
  alt: "A cash drawer connected to a receipt printer that fails to open on command"
entities:
  - "cash drawer"
  - "drawer-kick port"
  - "pulse command"
  - "POS hardware"
tags:
  - "troubleshooting"
  - "cash drawer"
  - "POS"
relatedArticles:
  - "pos-printing-basics"
  - "silent-printing"
references: []
featured: false
---

## Diagnose safely

1. Inspect the drawer, key position, cable, and connector labels.
2. Confirm the printer is powered and not in error.
3. Use the manufacturer's test utility or documented self-test.
4. Verify drawer port 1 versus port 2 and pulse timing.
5. Confirm raw bytes are not being rendered as text.
6. Check whether policy permits the current event and operator to open it.
7. Review runtime and audit logs for rejection or transport failure.

Do not apply external voltage or probe pins without the hardware documentation. Incorrect cables or electrical assumptions can damage the printer or drawer.

## Application rules

Treat drawer opening as a privileged command. Allow it for approved cash transactions and audited no-sale events. Record operator, terminal, reason, job ID, and result without exposing payment secrets.

## Portix evidence needed

The device-command API, authorization model, supported pulse parameters, response states, and audit behavior aren't documented yet.

## Verify

Test cash sale, authorized no-sale, denied user, disconnected cable, and printer error. Confirm retries cannot issue repeated pulses unintentionally.
