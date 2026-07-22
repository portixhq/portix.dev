---
title: "Receipt Paper Never Cuts"
slug: "paper-never-cuts"
description: "Troubleshoot missing receipt cuts across hardware capability, ESC/POS commands, driver settings, feed distance, job truncation, and cutter faults."
quickAnswer: "Confirm the printer has an automatic cutter and that its self-test or vendor utility can activate it. Then verify the exact cut command for the model, ensure it reaches the printer through a raw-capable path, and feed enough paper before cutting. If vendor tests fail, inspect jams and seek hardware service."
contentType: "troubleshooting"
category: "esc-pos"
primaryTopic: "receipt paper never cuts"
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
  src: "/images/knowledge/paper-never-cuts.svg"
  alt: "A receipt hanging uncut from the printer after the job finished"
entities:
  - "autocutter"
  - "cut command"
  - "tear bar"
  - "ESC/POS"
tags:
  - "troubleshooting"
  - "ESC/POS"
  - "cutter"
relatedArticles:
  - "receipt-printers-explained"
  - "paper-cuts-too-early"
references:
  - title: "ESC/POS command reference"
    url: "https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/index.html"
    publisher: "Epson"
    accessedAt: 2026-07-21
featured: false
---

## Diagnose it

1. Check the model specification for cutter hardware.
2. Run the built-in self-test or vendor cutter test.
3. Inspect error lights, cover closure, paper path, and cutter jams.
4. Send initialization, one text line, feed, and the documented cut command.
5. Confirm the queue does not render or strip raw bytes.
6. Check printer configuration and driver finishing options.
7. Inspect the submitted payload for truncation before its final bytes.

## Important distinctions

A tear-bar model cannot be fixed in software. Some printers support full and partial cut differently, and some require a minimum feed distance. Emulations can use different command parameters even on similar hardware.

## Safe recovery

Do not repeatedly energize a jammed cutter. Power down according to the manufacturer's procedure, remove obstructions only as documented, and route jobs to a fallback printer if hardware remains in error.

## Verify

Run multiple short and long receipts, cover-open recovery, and low-paper scenarios. Confirm the job ends once and cuts only after all content.
