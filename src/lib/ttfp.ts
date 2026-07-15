// Shared "Time To First Print" progress tracker for the landing page.
//
// Every stage is a real, observable signal from the Runtime itself — never a
// page-engagement event (viewing a section, picking a use case, generating a
// snippet). Reading "How it works" or building a snippet may help conversion,
// but none of that advances a physical print, so none of it is tracked here.

export type StageKey = 'runtimeDetected' | 'printerAvailable' | 'applicationPaired' | 'jobAccepted' | 'printed';

interface Stage {
  key: StageKey;
  percent: number;
  label: string;
  description: string;
}

export const STAGES: Stage[] = [
  {
    key: 'runtimeDetected',
    percent: 20,
    label: 'Runtime installed and running',
    description: 'The Portix.One Runtime responded on this machine.',
  },
  {
    key: 'printerAvailable',
    percent: 40,
    label: 'Compatible printer available',
    description: 'The Runtime reports a configured printer, ready to receive jobs.',
  },
  {
    key: 'applicationPaired',
    percent: 60,
    label: 'Application paired',
    description: 'This browser and your Runtime both verified the pairing.',
  },
  {
    key: 'jobAccepted',
    percent: 80,
    label: 'Print job accepted',
    description: 'The Runtime accepted a real job and assigned a job ID.',
  },
  {
    key: 'printed',
    percent: 100,
    label: 'Output confirmed',
    description: 'The job reached its documented terminal success state.',
  },
];

const STORAGE_KEY = 'portix_ttfp_v3';

export const UPDATE_EVENT = 'portix:ttfp:update';

type State = Partial<Record<StageKey, boolean>>;

function readState(): State {
  if (typeof localStorage === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeState(state: State) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getState(): State {
  return readState();
}

export function isDone(key: StageKey): boolean {
  return Boolean(readState()[key]);
}

export function markStage(key: StageKey) {
  const state = readState();
  if (state[key]) return;
  state[key] = true;
  writeState(state);
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: { key } }));
}

/** Reset all progress — used by the "Start a new setup" action once a run is complete. */
export function resetState() {
  writeState({});
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: { key: 'reset' } }));
}

/** The displayed progress is the highest percent among reached stages — 100 only ever appears via `printed`. */
export function getProgress(): number {
  const state = getState();
  const reached = STAGES.filter((s) => state[s.key]).map((s) => s.percent);
  return Math.max(0, ...reached);
}

export function getCompletedCount(): number {
  const state = getState();
  return STAGES.filter((s) => state[s.key]).length;
}

/** Step-based label, not a time estimate — there is no telemetry yet to back a real ETA. */
export function getStepLabel(): string {
  const done = getCompletedCount();
  if (done >= STAGES.length) return 'Printed';
  return `${done} of ${STAGES.length} steps complete`;
}

export function onUpdate(callback: () => void) {
  window.addEventListener(UPDATE_EVENT, callback);
  window.addEventListener('DOMContentLoaded', callback);
}
