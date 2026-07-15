// Single source of truth for every integration surface on the landing — the builder-path wizard,
// the generated SDK/framework snippets, the AI coding-agent prompt, the REST recipe, and any future
// docs page. Nothing downstream should hard-code a package name, version, method signature, job
// status, or docs URL — it should read it from here, so a real SDK/Runtime change only needs one edit.
//
// Every field is checked against the actual source at the version below, not guessed:
//   - sdk-js/package.json               → sdk.package, sdk.latestVerifiedVersion
//   - sdk-js/src/portix.ts               → sdk.methods (connect/disconnect/print/on)
//   - sdk-js/src/types.ts                → sdk.constructorOptions, sdk.events
//   - packages/protocol/src/job.types.ts → jobs.statuses, jobs.limits
//   - packages/protocol/src/job.schema.ts→ jobs.printPayload
//   - packages/protocol/src/pairing.types.ts → pairing.flow
//   - runtime/src/api/api.route.ts       → runtime.endpoints
//   - runtime/package.json               → runtime.version
//   - runtime/src/printer/detectors/windows.detector.ts → hardware.verified (SICAR WL88S note)
//   - examples/*                          → frameworks (only vanilla-JS/HTML examples exist today)

export const LAST_VERIFIED_AT = '2026-07-14';

export const sdk = {
  package: '@portixone/sdk',
  latestVerifiedVersion: '0.3.4',
  installCommand: 'npm install @portixone/sdk',
  constructorOptions: [
    { name: 'apiKey', type: 'string', required: false, note: "defaults to the runtime's local-dev API key convention" },
    { name: 'host', type: 'string', required: false },
    { name: 'port', type: 'number', required: false },
    { name: 'mode', type: "'runtime' | 'mock'", required: false, note: "'mock' needs no Runtime and no printer — print() renders a text preview instead" },
    { name: 'appId', type: 'string', required: false, note: 'required for connect() to pair automatically' },
    { name: 'tenant', type: 'string', required: false, note: 'required for connect() to pair automatically' },
  ],
  methods: [
    { signature: 'connect(): Promise<void>', note: 'pairs automatically (if needed) and connects to the Runtime — throws RuntimeUnreachableError if the Runtime is not reachable, or on pairing expiry' },
    { signature: 'disconnect(): Promise<void>' },
    { signature: 'print(job: { content: string; printerName?: string; copies?: number }): Promise<{ jobId: string; status: JobStatus }>', note: "202-equivalent — the returned status is the queued state, not proof of physical output" },
    { signature: 'getStatus(): Promise<{ status: string; version: string; defaultPrinter?: string; simulated?: boolean }>' },
    { signature: 'ping(): Promise<{ pong: boolean }>' },
    { signature: 'listPrinters(): Promise<PrinterInfo[]>' },
    { signature: 'getPrinter(name: string): Promise<PrinterInfo>' },
    { signature: 'getJobs(): Promise<JobRecord[]>', note: 'no single-job lookup exists — filter this list by jobId' },
    { signature: 'cancel(jobId: string): Promise<PrintResult>' },
    { signature: 'pair(): Promise<{ code: string; expiresAt: string }>', note: 'requests pairing and returns the code immediately instead of blocking, for callers that want to show it to a human themselves' },
    { signature: "on(event: PortixEvent, handler: (data: unknown) => void): () => void", note: "the idiomatic way to observe a job reaching a terminal state — subscribe to 'job:printed' / 'job:error' / 'job:cancelled' instead of polling getJobs()" },
  ],
  events: ['paired', 'status', 'job:queued', 'job:printing', 'job:printed', 'job:error', 'job:cancelled'],
} as const;

export const runtime = {
  version: '0.1.0',
  defaultEndpoint: 'http://127.0.0.1:17321',
  supportedOperatingSystems: ['Windows'],
  endpoints: {
    health: { method: 'GET', path: '/health', auth: false, note: 'returns { status, version, defaultPrinter?, simulated? }' },
    printers: { method: 'GET', path: '/printers', auth: true },
    print: { method: 'POST', path: '/print', auth: true, note: '202 response means the job was queued — not that it printed' },
    jobs: { method: 'GET', path: '/jobs', auth: true, note: 'no single-job GET exists; poll this list and match by jobId' },
    cancelJob: { method: 'POST', path: '/jobs/{jobId}/cancel', auth: true },
    pairingRequest: { method: 'POST', path: '/pairing/request', auth: false, note: 'body: { tenant, appId }' },
    pairingStatus: { method: 'GET', path: '/pairing/status?code={code}', auth: false },
  },
} as const;

export const pairing = {
  flow: [
    'The application calls POST /pairing/request with { tenant, appId } and receives a { code, expiresAt }.',
    'A human approves the request from the Portix.One tray on the machine running the Runtime — this step cannot be automated or skipped.',
    'The application polls GET /pairing/status?code={code} until status is "approved" (returns a token) or "expired".',
    'The returned token authenticates every subsequent request via the x-portix-api-key header.',
  ],
  authHeader: 'x-portix-api-key',
} as const;

export const jobs = {
  statuses: ['pending', 'printing', 'completed', 'failed', 'cancelled'] as const,
  terminalStatuses: ['completed', 'failed', 'cancelled'] as const,
  successStatus: 'completed',
  printPayload: {
    content: { type: 'string', required: true, maxLength: 100_000 },
    printerName: { type: 'string', required: false },
    copies: { type: 'number', required: false, max: 100 },
  },
  semantics: {
    accepted: 'The Runtime queued the job and returned a jobId — this is not proof of physical output.',
    delivered: 'The Runtime sent the job to the printer, but the transport could not confirm physical output.',
    confirmed: 'The job reached the documented "completed" terminal state — the only status that can be called "printed."',
  },
} as const;

export type FrameworkId = 'javascript' | 'react' | 'vue' | 'nextjs' | 'angular' | 'electron';

export interface FrameworkEntry {
  id: FrameworkId;
  label: string;
  /** True only when a real, maintained example repository exists for this framework today. */
  hasMaintainedExample: boolean;
  exampleUrl?: string;
  note?: string;
}

// Only `examples/quickstart-html` and `examples/basic-print` are real, maintained example code in
// this repo today (both vanilla JS/HTML — see examples/*). React, Vue, Next.js, Angular, and
// Electron do NOT have a maintained example repository yet, so their `hasMaintainedExample` is
// false — the wizard still generates a correct, framework-shaped snippet for them (same verified
// SDK calls), it just doesn't link to a repo that doesn't exist.
export const frameworks: FrameworkEntry[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    hasMaintainedExample: true,
    exampleUrl: 'https://github.com/portixhq/portixone/tree/master/examples/quickstart-html',
  },
  { id: 'react', label: 'React', hasMaintainedExample: false, note: 'Maintained example on the roadmap.' },
  { id: 'vue', label: 'Vue', hasMaintainedExample: false, note: 'Maintained example on the roadmap.' },
  { id: 'nextjs', label: 'Next.js', hasMaintainedExample: false, note: 'Maintained example on the roadmap.' },
  { id: 'angular', label: 'Angular', hasMaintainedExample: false, note: 'Maintained example on the roadmap.' },
  { id: 'electron', label: 'Electron', hasMaintainedExample: false, note: 'Maintained example on the roadmap.' },
];

export type CodingEnvironmentId = 'codex' | 'cursor' | 'claude-code' | 'copilot' | 'generic';

export const codingEnvironments: { id: CodingEnvironmentId; label: string }[] = [
  { id: 'codex', label: 'Codex' },
  { id: 'cursor', label: 'Cursor' },
  { id: 'claude-code', label: 'Claude Code' },
  { id: 'copilot', label: 'Copilot' },
  { id: 'generic', label: 'Generic Agent' },
];

export const printers = {
  // The only device this Runtime build has been physically verified against. Do not add a printer
  // here without a real, dated verification — see windows.detector.ts's SICAR WL88S comment.
  verified: [
    { model: 'SICAR WL88S', os: 'Windows 11', connection: 'USB', protocol: 'ESC/POS', lastVerifiedAt: '2026-07-14' },
  ],
  protocolsSupported: ['ESC/POS'],
} as const;

export const docs = {
  quickStart: '/docs',
  sdkReference: '/docs/sdk',
  runtimeGuide: '/docs/runtime',
  compatibility: '/docs/runtime',
  aiIntegration: '/docs/ai-integration',
  faq: '/docs/faq',
  security: '/security',
} as const;

export const site = {
  origin: 'https://portix.one',
} as const;

function canonical(path: string): string {
  return `${site.origin}${path}`;
}

export const canonicalUrls = {
  quickStart: canonical(docs.quickStart),
  sdkReference: canonical(docs.sdkReference),
  runtimeGuide: canonical(docs.runtimeGuide),
  compatibility: canonical(docs.compatibility),
  aiIntegration: canonical(docs.aiIntegration),
} as const;
