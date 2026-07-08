// Minimal, dependency-free client for the real PortixOne Runtime — used by
// the Playground so the landing page can attempt a genuinely real print
// instead of only ever simulating one. Deliberately not the @portixone/sdk
// package: this is three small fetch() calls, not worth a bundled dependency
// for a marketing site.

const RUNTIME_BASE = 'http://127.0.0.1:17321';
const API_KEY_HEADER = 'x-portix-api-key';
const HEALTH_TIMEOUT_MS = 1200;
const PAIRING_TIMEOUT_MS = 120_000; // matches the Runtime's own pairing code expiry window
const PAIRING_POLL_MS = 1500;

const TENANT = 'default';
const APP_ID = 'portix-one-landing';

export interface PairingRequestResult {
  code: string;
  expiresAt: string;
}

export interface PairingStatusResult {
  status: 'pending' | 'approved' | 'expired';
  token?: string;
}

export class RuntimeNotFoundError extends Error {}
export class PairingExpiredError extends Error {}

function withTimeout(ms: number): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

export interface DetectResult {
  found: boolean;
  /** True when the Runtime is real but has no real printer driver configured — a print would be accepted and tracked, never reach paper. */
  simulated?: boolean;
}

/** A short, best-effort probe — most visitors have no Runtime running, so this must fail fast, not hang. */
export async function detectRuntime(): Promise<DetectResult> {
  const { signal, cancel } = withTimeout(HEALTH_TIMEOUT_MS);
  try {
    const res = await fetch(`${RUNTIME_BASE}/health`, { signal });
    if (!res.ok) return { found: false };
    const body: { simulated?: boolean } = await res.json();
    return { found: true, simulated: body.simulated };
  } catch {
    return { found: false };
  } finally {
    cancel();
  }
}

/** Requests pairing. Since portix.one is a real public origin (not localhost/LAN), the Runtime's
 *  auto-trust never applies here — this always surfaces a real tray approval on the visitor's machine. */
export async function requestPairing(): Promise<PairingRequestResult> {
  const res = await fetch(`${RUNTIME_BASE}/pairing/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenant: TENANT, appId: APP_ID }),
  });
  if (!res.ok) throw new RuntimeNotFoundError('Pairing request failed');
  return res.json();
}

/** Polls until a human approves (or denies/expires) the request from the PortixOne tray.
 *  `onTick` fires once per poll with elapsed/remaining seconds — a live countdown, not a log spam source. */
export async function waitForApproval(
  code: string,
  expiresAt: string,
  onTick?: (elapsedSec: number, remainingSec: number) => void,
): Promise<string> {
  const startedAt = Date.now();
  const deadline = Math.min(startedAt + PAIRING_TIMEOUT_MS, new Date(expiresAt).getTime());
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, PAIRING_POLL_MS));
    onTick?.(Math.round((Date.now() - startedAt) / 1000), Math.max(0, Math.round((deadline - Date.now()) / 1000)));
    const res = await fetch(`${RUNTIME_BASE}/pairing/status?code=${encodeURIComponent(code)}`);
    if (!res.ok) continue;
    const status: PairingStatusResult = await res.json();
    if (status.status === 'approved' && status.token) return status.token;
    if (status.status === 'expired') throw new PairingExpiredError('Pairing request expired');
  }
  throw new PairingExpiredError('Pairing request expired');
}

export interface PrintResult {
  jobId: string;
  status: string;
}

/** The real thing — this is the call that puts ink on paper. */
export async function realPrint(token: string, content: string): Promise<PrintResult> {
  const res = await fetch(`${RUNTIME_BASE}/print`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', [API_KEY_HEADER]: token },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(`Print failed (${res.status})`);
  return res.json();
}
