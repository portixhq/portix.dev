// Shared "Time To First Print" progress tracker for the landing page.
// Approximate by design — the point is a visitor always feels "I'm progressing,"
// never "I'm reading documentation." See ROADMAP.md Fase 8.

export type MilestoneKey =
  | 'sdkSelected'
  | 'printerSelected'
  | 'sampleGenerated'
  | 'runtimeDownloaded'
  | 'playgroundPrinted';

interface MilestoneDef {
  key: MilestoneKey;
  weight: number;
}

const STORAGE_KEY = 'portix_ttfp_v1';
const BASE_SECONDS = 300; // "under 5 minutes"
const FLOOR_PERCENT = 8; // never show 0% — always mid-journey

const MILESTONES: MilestoneDef[] = [
  { key: 'sdkSelected', weight: 15 },
  { key: 'printerSelected', weight: 10 },
  { key: 'sampleGenerated', weight: 15 },
  { key: 'runtimeDownloaded', weight: 30 },
  { key: 'playgroundPrinted', weight: 30 },
];

export const UPDATE_EVENT = 'portix:ttfp:update';

type State = Partial<Record<MilestoneKey, boolean>>;

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

export function isDone(key: MilestoneKey): boolean {
  return Boolean(readState()[key]);
}

export function markMilestone(key: MilestoneKey) {
  const state = readState();
  if (state[key]) return;
  state[key] = true;
  writeState(state);
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: { key } }));
}

export function getProgress(): number {
  const state = readState();
  const earned = MILESTONES.reduce((sum, m) => sum + (state[m.key] ? m.weight : 0), 0);
  return Math.max(FLOOR_PERCENT, Math.min(100, earned + FLOOR_PERCENT * (earned === 0 ? 1 : 0.4)));
}

export function getEtaLabel(): string {
  const progress = getProgress();
  if (progress >= 100) return 'Ready to print';
  const remaining = Math.max(15, Math.round(BASE_SECONDS * (1 - progress / 100)));
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return `${m}:${String(s).padStart(2, '0')} remaining`;
}

export function onUpdate(callback: () => void) {
  window.addEventListener(UPDATE_EVENT, callback);
  window.addEventListener('DOMContentLoaded', callback);
}
