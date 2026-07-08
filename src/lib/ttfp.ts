// Shared "Time To First Print" progress tracker for the landing page.
// Every stage after "landed" is tied to a real, observable action — the last
// two (paired, printed) are real signals from runtime-client.ts, not
// simulated clicks. The bar can never claim 100% unless a real print happened.

export type StageKey =
  | 'landed'
  | 'sawHowItWorks'
  | 'selectedUseCase'
  | 'generatedSnippet'
  | 'downloadedRuntime'
  | 'pairedBrowser'
  | 'printed';

interface Stage {
  key: StageKey;
  percent: number;
  label: string;
}

export const STAGES: Stage[] = [
  { key: 'landed', percent: 0, label: 'Landed on the page' },
  { key: 'sawHowItWorks', percent: 15, label: 'Saw how it works' },
  { key: 'selectedUseCase', percent: 30, label: 'Selected your use case' },
  { key: 'generatedSnippet', percent: 45, label: 'Generated your integration' },
  { key: 'downloadedRuntime', percent: 60, label: 'Downloaded the Runtime' },
  { key: 'pairedBrowser', percent: 80, label: 'Paired your browser' },
  { key: 'printed', percent: 100, label: 'First print completed' },
];

/** Checklist-facing stages — "landed" is the implicit baseline, not a checkbox. */
export const CHECKLIST_STAGES = STAGES.filter((s) => s.key !== 'landed');

const STORAGE_KEY = 'portix_ttfp_v2';
const BASE_SECONDS = 300; // "under 5 minutes"

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
  const state = readState();
  state.landed = true;
  return state;
}

export function isDone(key: StageKey): boolean {
  return key === 'landed' || Boolean(readState()[key]);
}

export function markStage(key: StageKey) {
  const state = readState();
  if (state[key]) return;
  state[key] = true;
  writeState(state);
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: { key } }));
}

/** The displayed progress is the highest percent among reached stages — 100 only ever appears via `printed`. */
export function getProgress(): number {
  const state = getState();
  const reached = STAGES.filter((s) => state[s.key]).map((s) => s.percent);
  return Math.max(0, ...reached);
}

export function getCurrentStage(): Stage {
  const percent = getProgress();
  return [...STAGES].reverse().find((s) => s.percent <= percent) ?? STAGES[0];
}

export function getEtaLabel(): string {
  const progress = getProgress();
  if (progress >= 100) return 'Printed';
  const remaining = Math.max(15, Math.round(BASE_SECONDS * (1 - progress / 100)));
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return `${m}:${String(s).padStart(2, '0')} remaining`;
}

export function onUpdate(callback: () => void) {
  window.addEventListener(UPDATE_EVENT, callback);
  window.addEventListener('DOMContentLoaded', callback);
}
