"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type {
  DemoSignalsResponse,
  IntentPrediction,
  SignalData,
} from "@/lib/types";

export const DEMO_TRIALS = 8;

export type StreamStatus = "idle" | "loading" | "ready" | "error";

interface UseDemoStreamOptions {
  enabled: boolean;
}

export function useDemoStream({ enabled }: UseDemoStreamOptions) {
  const [signal, setSignal] = useState<SignalData | null>(null);
  const [predictions, setPredictions] = useState<IntentPrediction[]>([]);
  const [result, setResult] = useState<DemoSignalsResponse | null>(null);
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  const tick = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await api.demoSignals(DEMO_TRIALS);
      setSignal(data.signal);
      setPredictions(data.predictions);
      setResult(data);
      setStatus("ready");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取科研数据失败");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const timer = setTimeout(() => void tick(), 0);
    return () => clearTimeout(timer);
  }, [enabled, revision, tick]);

  const reset = useCallback(() => {
    setSignal(null);
    setPredictions([]);
    setResult(null);
    setStatus("idle");
    setError(null);
    setRevision((value) => value + 1);
  }, []);

  return { signal, predictions, result, status, error, reset };
}
