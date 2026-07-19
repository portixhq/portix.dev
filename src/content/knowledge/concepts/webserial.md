---
title: "WebSerial Explained"
slug: "webserial"
description: "Learn how Web Serial lets authorized websites read and write serial ports, configure line settings, stream bytes, and communicate with compatible printers."
quickAnswer: "Web Serial lets a supported secure web application request a port, open it with settings such as baud rate, and read or write through streams. It can support legacy POS equipment and serial-compatible printers when line settings and command language are known. It does not render documents, automatically identify printer protocols, provide silent permission, or guarantee broad browser/mobile support."
contentType: "concept"
category: "web-technologies"
primaryTopic: "Web Serial"
searchIntent: "informational"
audience: "web developers"
difficulty: "advanced"
status: "published"
noindex: false
publishedAt: 2026-07-19
updatedAt: 2026-07-19
author:
  name: "Portix.One"
  type: "Organization"
cover:
  src: "/images/knowledge/webserial.svg"
  alt: "A website streaming bytes over a serial port connection to a compatible printer"
entities:
  - "Web Serial"
  - "baud rate"
  - "serial port"
  - "ReadableStream"
  - "WritableStream"
tags:
  - "web technologies"
  - "Web Serial"
  - "hardware APIs"
relatedArticles:
  - "usb-printing"
  - "bluetooth-printing"
  - "webusb"
  - "raw-printing"
  - "esc-pos-character-encoding"
references:
  - title: "Web Serial API"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API"
    publisher: "MDN"
    accessedAt: 2026-07-19
  - title: "Read from and Write to a Serial Port"
    url: "https://developer.chrome.com/docs/capabilities/serial"
    publisher: "Chrome for Developers"
    accessedAt: 2026-07-19
featured: false
---

Web Serial is a browser API for communicating with serial ports from JavaScript after a user grants access. It can reach physical serial interfaces and some USB or Bluetooth devices that present themselves as serial ports. It provides byte streams; the application must implement the device protocol.

## Connection flow

```text
User gesture → navigator.serial.requestPort(filters)
                         ↓
Open with baud rate and serial settings
                         ↓
ReadableStream / WritableStream
                         ↓
Device protocol bytes
```

```js
const port = await navigator.serial.requestPort();
await port.open({ baudRate: 9600 });

const writer = port.writable.getWriter();
await writer.write(new Uint8Array([0x1b, 0x40]));
writer.releaseLock();
```

The baud rate and bytes are illustrative. Verify the target device's complete serial configuration and protocol.

## Serial settings

Communication can depend on baud rate, data bits, stop bits, parity, and flow control. Both ends must agree. A connection that opens with incorrect settings can still produce corrupted data rather than a clear error.

USB-to-serial adapters add driver, chipset, cable, and device-path variables. Record supported adapters and test reconnect behavior.

## Streams and framing

Serial is a byte stream. Application writes and reads do not define message boundaries. The protocol must use lengths, delimiters, checksums, timing, or state to frame messages.

For printing, do not run binary commands through a text decoder. Use byte-safe writers and a separate encoding step for printer text.

## Permissions and support

The API is a powerful feature and requires explicit selection in a secure context. Previously granted ports can be listed in supported implementations, but access remains scoped by browser policy and device presence.

Support is not universal, especially on mobile platforms. Provide a local runtime, native app, platform queue, or manual print fallback where required.

## Printing considerations

- Confirm that the printer actually exposes a serial protocol.
- Match line settings exactly.
- Send a verified language such as supported ESC/POS.
- Define buffering, pacing, status, and timeout behavior.
- Prevent concurrent writers.
- Use idempotency for reconnect and unknown outcomes.
- Separate drawer or other hardware commands from ordinary print authorization.

## Common failures

| Symptom | Check |
|---|---|
| Port not shown | Browser support, OS driver, chooser filters, permissions |
| Opens but prints garbage | Baud/parity/data bits or printer encoding/language |
| Partial output | Flow control, buffer, disconnect, writer lifecycle |
| Port busy | Another application owns it |
| Wrong device after reconnect | Unstable adapter/device mapping |
| UI freezes | Incorrect stream handling or unbounded read loop |

## Frequently asked questions

### Is Web Serial the same as WebUSB?

No. Web Serial exposes serial-port semantics. Some USB serial devices can appear through it, while WebUSB exposes USB interfaces and endpoints.

### Can it print silently?

After user-granted access, an authorized page may write without a print dialog, but browser permission, page lifecycle, security, and device availability still apply.

### Does every USB receipt printer expose a serial port?

No. Connection mode and interface vary by model and configuration.

### Can I use UTF-8 strings directly?

Only if the device protocol expects UTF-8. Many receipt printers require a selected code page.
