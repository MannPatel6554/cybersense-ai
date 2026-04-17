import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  type AnalysisResult,
  type AppState,
  loadState,
  saveState,
} from "@/lib/cybersense";

let state: AppState | null = null;
const listeners = new Set<() => void>();

function ensureState(): AppState {
  if (state === null) {
    state = loadState();
  }
  return state;
}

function setState(updater: (prev: AppState) => AppState) {
  const prev = ensureState();
  const next = updater(prev);
  state = next;
  saveState(next);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const SERVER_SNAPSHOT: AppState = {
  awarenessScore: 0,
  history: [],
  phishingSimsCompleted: 0,
};

export function useAppState() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => ensureState(),
    () => SERVER_SNAPSHOT
  );

  // Hydration: ensure client reads localStorage after mount
  useEffect(() => {
    if (state === null) {
      state = loadState();
      listeners.forEach((l) => l());
    }
  }, []);

  const addAnalysis = useCallback((result: AnalysisResult) => {
    setState((prev) => ({
      ...prev,
      awarenessScore: Math.min(100, prev.awarenessScore + result.pointsEarned),
      history: [result, ...prev.history].slice(0, 100),
    }));
  }, []);

  const completePhishingSim = useCallback((points: number) => {
    setState((prev) => ({
      ...prev,
      awarenessScore: Math.min(100, prev.awarenessScore + points),
      phishingSimsCompleted: prev.phishingSimsCompleted + 1,
    }));
  }, []);

  return { ...snapshot, addAnalysis, completePhishingSim };
}
