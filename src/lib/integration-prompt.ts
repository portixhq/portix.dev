// Builds the AI coding-agent integration prompt and the REST/low-code recipe from the versioned
// manifest — never from hard-coded strings duplicated per component. Both the on-page wizard and
// /docs/ai-integration import this so there is exactly one prompt template in the codebase.

import { sdk, runtime, pairing, jobs, frameworks, canonicalUrls, LAST_VERIFIED_AT, type FrameworkId, type CodingEnvironmentId } from '../data/integration-manifest';

export interface PromptInputs {
  codingEnvironment: CodingEnvironmentId;
  framework: FrameworkId;
  language: 'JavaScript' | 'TypeScript';
  printerType: string;
  protocol: string;
  mode: 'mock' | 'runtime';
  projectType: 'existing' | 'new';
  appId: string;
  tenant: string;
}

const CODING_ENV_LABEL: Record<CodingEnvironmentId, string> = {
  codex: 'Codex',
  cursor: 'Cursor',
  'claude-code': 'Claude Code',
  copilot: 'Copilot',
  generic: 'a generic AI coding agent',
};

function frameworkLabel(id: FrameworkId): string {
  return frameworks.find((f) => f.id === id)?.label ?? id;
}

export function buildIntegrationPrompt(inputs: PromptInputs): string {
  const frameworkName = frameworkLabel(inputs.framework);
  const generatedDate = new Date().toISOString().slice(0, 10);
  const isVanillaJs = inputs.framework === 'javascript';
  const projectDescriptor = isVanillaJs ? `${inputs.language}` : `${frameworkName} (${inputs.language})`;
  const projectContext =
    inputs.projectType === 'existing' ? `an existing ${projectDescriptor} project` : `a new, minimal ${projectDescriptor} example project`;

  return `You are integrating Portix.One into ${projectContext}.
Target coding environment: ${CODING_ENV_LABEL[inputs.codingEnvironment]}.

## Objective

Add a reliable local printing flow that sends receipt output from the browser-based application to a ${inputs.printerType} using the Portix.One Runtime and ${inputs.protocol}.

## Official implementation source

- SDK package: ${sdk.package}
- SDK version: ${sdk.latestVerifiedVersion}
- Quick Start: ${canonicalUrls.quickStart}
- SDK reference: ${canonicalUrls.sdkReference}
- Runtime guide: ${canonicalUrls.runtimeGuide}
- Printer compatibility: ${canonicalUrls.compatibility}

## Rules

1. Inspect the existing repository before modifying files.
2. Preserve the current framework, package manager, architecture, formatting, and test conventions.
3. Use the official ${sdk.package} package. Do not recreate the Runtime HTTP or WebSocket protocol manually unless the user explicitly requests the REST integration path.
4. Do not invent Portix.One methods, options, events, endpoints, or job statuses. The only real methods are: ${sdk.methods.map((m) => m.signature).join('; ')}.
5. If the installed SDK API differs from the referenced documentation, stop and report the mismatch instead of guessing.
6. Do not hard-code authentication tokens, pairing tokens, secrets, printer IPs, or temporary pairing codes.
7. Do not bypass Runtime pairing or operating-system security prompts — pairing approval is a human action in the Portix.One tray and cannot be automated.
8. Keep browser-to-local-Runtime code on the client side when required by the selected framework (for ${frameworkName === 'Next.js' ? 'Next.js specifically: the Runtime lives on the same device/network as the printer, not on your deployment host — do not call it from a server component or API route unless the architecture explicitly documents a server-side path' : 'server-rendered frameworks in general'}).
9. Treat a successful print request as "job accepted," not "physically printed."
10. Only display "output confirmed" after the documented terminal "${jobs.successStatus}" state — see the job-status semantics below.

## Required implementation

1. Install ${sdk.package}@${sdk.latestVerifiedVersion} using the project's current package manager.
2. Create a small Portix.One integration module instead of scattering SDK calls across UI components.
3. Initialize Portix with:
   - appId: "${inputs.appId}"
   - tenant: "${inputs.tenant}"
   - mode: "${inputs.mode}"
4. Implement Runtime connection through portix.connect().
5. Surface these UI states: idle, Runtime unavailable, pairing required, connected, printer unavailable, job accepted, printing, completed, failed, cancelled, timeout/unknown final state.
6. Add a print action using portix.print({ content, printerName?, copies? }).
7. Store and display the real jobId and returned status.
8. Do not claim physical output when the underlying printer path only confirms delivery (status "printing" or an unconfirmed terminal state) — see job-status semantics below.
9. Prevent duplicate submissions while a job is pending.
10. Restore the action after failure and provide a useful retry path.

## Job-status semantics (do not deviate from this)

- Accepted: ${jobs.semantics.accepted}
- Delivered: ${jobs.semantics.delivered}
- Confirmed: ${jobs.semantics.confirmed}
- Real statuses, exactly as returned by the Runtime: ${jobs.statuses.join(', ')}.

## Pairing flow (do not automate any human-approval step)

${pairing.flow.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Mock-first verification

1. Start with \`new Portix({ mode: "mock" })\`${inputs.mode === 'mock' ? ' — this matches the mode selected for this integration.' : ', even though the target mode for this integration is "runtime," to verify the flow before touching real hardware.'}
2. Verify that connect() succeeds in mock mode.
3. Verify that the print action creates the expected receipt preview.
4. Add or update tests for the integration module and UI states.

## Physical-printer verification

Do not install the Portix.One Runtime or approve pairing automatically. Provide the human operator with these steps:

1. Install and start the supported Portix.One Runtime (${runtime.supportedOperatingSystems.join(', ')} only, Runtime ${runtime.version}).
2. Confirm that the printer is powered on and available to the operating system.
3. Approve the application pairing request from the Portix.One tray.
4. Send one test job.
5. Record the jobId, Runtime result, printer name, and terminal status.
6. Ask the operator to confirm whether physical output occurred when the printer transport cannot prove it programmatically.

## Security restrictions

- Never commit API keys, pairing tokens, pairing codes, or any Runtime credential.
- Never disable operating-system security prompts.
- Never open public ports or expose the Runtime to the internet.
- Never approve pairing without human interaction in the tray.
- Do not download or execute installers automatically.

## Hallucination control

- Consult only the canonical documentation URLs listed above.
- Use only the methods, options, and job statuses documented in this prompt.
- Report any discrepancy between the installed SDK and this prompt instead of inventing a workaround.
- Do not use internal example, demo, or marketing-site code as a public API — it is illustrative, not a contract.
- Do not assume support for ZPL, laser printers, healthcare workflows, or any platform not listed in ${canonicalUrls.compatibility}.
- Do not mark the integration as finished only because the project compiles — it must satisfy the Definition of Done below.

## Expected output from you

1. A short explanation of the integration approach.
2. A list of modified files.
3. The implementation.
4. Tests or verification checks.
5. Exact manual steps required for the first physical print.
6. Any assumptions, unsupported capabilities, or documentation mismatches you found.

## Definition of done

- The project builds and its existing tests pass.
- Mock mode produces the expected receipt preview.
- Runtime-unavailable and job-failure states are visible and actionable.
- No secrets or temporary pairing values are committed.
- The application never labels an accepted job as physically printed.
- Physical-printer completion remains a manual verification step unless the Runtime returns a documented terminal confirmation.

Before making changes, summarize the detected project architecture and identify the files you intend to modify. Then implement the integration.

---
Verified against Portix.One SDK ${sdk.latestVerifiedVersion} · Runtime ${runtime.version} · manifest last verified ${LAST_VERIFIED_AT}
Prompt generated ${generatedDate}`;
}

export interface SnippetInputs {
  framework: FrameworkId;
  printerName?: string;
  mode: 'mock' | 'runtime';
  appId: string;
  tenant: string;
}

/** The real, idiomatic SDK usage every framework variant below is built from — job completion comes
 *  from the `on('job:printed', ...)` event, never from the `print()` response, which only ever means
 *  "accepted." */
function sdkCore(inputs: SnippetInputs, indent = ''): string {
  const printerLine = inputs.printerName ? `, printerName: '${inputs.printerName}'` : '';
  const lines = [
    `const portix = new Portix({ appId: '${inputs.appId}', tenant: '${inputs.tenant}', mode: '${inputs.mode}' });`,
    ``,
    `portix.on('job:printed', () => {`,
    `  // The Runtime confirmed the terminal "completed" state — only now is it safe to say "printed."`,
    `});`,
    `portix.on('job:error', (job) => {`,
    `  // Surface job.message to the user instead of retrying silently.`,
    `});`,
    ``,
    `async function printReceipt() {`,
    `  try {`,
    `    await portix.connect(); // auto-pairs; blocks until a human approves it in the Portix.One tray`,
    `  } catch (error) {`,
    `    if (error instanceof RuntimeUnreachableError) {`,
    `      // Runtime not installed or not running — error.message already includes the download link.`,
    `    }`,
    `    throw error;`,
    `  }`,
    ``,
    `  const { jobId, status } = await portix.print({`,
    `    content: 'Coffee    $4.00\\nTOTAL     $4.00'${printerLine},`,
    `  });`,
    `  // status is "pending" here — accepted, not printed. Wait for the job:printed event above.`,
    `}`,
  ];
  return lines.map((l) => (l ? indent + l : l)).join('\n');
}

export function buildSdkSnippet(inputs: SnippetInputs): string {
  return `${sdk.installCommand}

import { Portix, RuntimeUnreachableError } from '${sdk.package}';

${sdkCore(inputs)}`;
}

export function buildFrameworkSnippet(inputs: SnippetInputs): string {
  const importLine = `import { Portix, RuntimeUnreachableError } from '${sdk.package}';`;

  switch (inputs.framework) {
    case 'react':
      return `${importLine}
import { useEffect, useState } from 'react';

${sdkCore(inputs)}

function PrintButton() {
  const [status, setStatus] = useState<'idle' | 'printing' | 'printed' | 'error'>('idle');

  useEffect(() => {
    const off1 = portix.on('job:printed', () => setStatus('printed'));
    const off2 = portix.on('job:error', () => setStatus('error'));
    return () => { off1(); off2(); };
  }, []);

  const handlePrint = async () => {
    setStatus('printing');
    await printReceipt();
  };

  return <button onClick={handlePrint} disabled={status === 'printing'}>Print</button>;
}`;
    case 'vue':
      return `${importLine}
import { ref, onMounted, onUnmounted } from 'vue';

${sdkCore(inputs)}

export function usePortixPrint() {
  const status = ref<'idle' | 'printing' | 'printed' | 'error'>('idle');
  let unsubscribe: (() => void)[] = [];

  onMounted(() => {
    unsubscribe = [
      portix.on('job:printed', () => (status.value = 'printed')),
      portix.on('job:error', () => (status.value = 'error')),
    ];
  });
  onUnmounted(() => unsubscribe.forEach((off) => off()));

  async function print() {
    status.value = 'printing';
    await printReceipt();
  }

  return { status, print };
}`;
    case 'angular':
      return `${importLine}
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PortixPrintService {
${sdkCore(inputs, '  ')}
}`;
    case 'nextjs':
      return `'use client';
// The Runtime lives on the same device/network as the printer — this must stay client-side.
// Do not move this into a Server Action or Route Handler; your deployment host cannot reach
// http://127.0.0.1 on the visitor's machine.
${importLine}

${sdkCore(inputs)}

export default function PrintButton() {
  return <button onClick={() => printReceipt()}>Print</button>;
}`;
    case 'electron':
      return `// Renderer process — the Runtime call must happen here, not in the main process,
// since it talks to a local HTTP server exactly like a regular browser page would.
${importLine}

${sdkCore(inputs)}

document.getElementById('print-btn')?.addEventListener('click', () => printReceipt());`;
    default:
      return buildSdkSnippet(inputs);
  }
}

export interface RestRecipeInputs {
  printerType: string;
}

export function buildRestRecipe(inputs: RestRecipeInputs): string {
  return `# Portix.One REST recipe

This is a REST integration, not a no-code one — it still requires authentication and status handling
on your side. Use this when your platform can make authenticated HTTP requests but you're not using
the JavaScript SDK directly.

## Prerequisite: pairing

${pairing.flow.map((step, i) => `${i + 1}. ${step}`).join('\n')}

The resulting token is sent as the \`${pairing.authHeader}\` header on every request below.

## Send a print job

${runtime.endpoints.print.method} ${runtime.defaultEndpoint}${runtime.endpoints.print.path}
${pairing.authHeader}: {{token}}
Content-Type: application/json

{
  "content": "Coffee    $4.00\\nTOTAL     $4.00",
  "printerName": "${inputs.printerType}",
  "copies": 1
}

Response (202 — queued, not printed yet):
{
  "jobId": "...",
  "status": "pending"
}

## Check job status

${runtime.endpoints.jobs.method} ${runtime.defaultEndpoint}${runtime.endpoints.jobs.path}
${pairing.authHeader}: {{token}}

${runtime.endpoints.jobs.note}. Poll this endpoint and match your jobId until status is one of:
${jobs.terminalStatuses.join(', ')}.

## Field mapping

- content → the exact receipt text (max ${jobs.printPayload.content.maxLength.toLocaleString()} characters)
- printerName → optional; omit to use the Runtime's default printer
- copies → optional, max ${jobs.printPayload.copies.max}

## Error handling

- No response from ${runtime.defaultEndpoint} → Runtime not running on that device.
- 401/403 → pairing token missing, expired, or revoked — repeat the pairing flow.
- Job status "failed" or "cancelled" → surface the Runtime's message field to the operator.

## Manual physical-print verification

Only "${jobs.successStatus}" is a real confirmation of output. Treat "pending" and "printing" as
"job accepted," not "printed" — say so in your own UI.`;
}
