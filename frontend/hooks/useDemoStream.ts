"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { IntentWindow, SignalData } from "@/lib/types";

export const POLL_INTERVAL_MS = 900;
export const WINDOW_SECONDS = 5;
export const MAX_HISTORY = 100;

export type StreamStatus = "idle" | "loading" | "streaming" | "error";

interface UseDemoStreamOptions {
  enabled: boolean;
  paused: boolean;
}

export function useDemoStream({ enabled, paused }: UseDemoStreamOptions) {
  const [signal, setSignal] = useState<SignalData | null>(null);
  const [intents, setIntents] = useState<IntentWindow[]>([]);
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const tick = useCallback(async () => {
    if (pausedRef.current) {
      return;
    }
    try {
      const data = await api.demoSignals(WINDOW_SECONDS);
      setSignal(data.signal);
      setIntents((prev) => {
        const last = prev.length > 0 ? prev[prev.length - 1] : null;
        // 轮询窗口互相重叠：只追加“前一个窗口已结束”的新窗口，
        // 使时间轴为连续不重叠的识别窗口，避免重复项。
        const fresh = data.intents.filter(
          (intent) => last === null || intent.start_epoch >= last.end_epoch - 0.2,
        );
        return [...prev, ...fresh].slice(-MAX_HISTORY);
      });
      setStatus("streaming");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取 Demo 数据失败");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!enabled || paused) {
      return;
    }
    const run = () => void tick();
    const firstTimer = setTimeout(run, 0);
    const timer = setInterval(() => void tick(), POLL_INTERVAL_MS);
    return () => {
      clearTimeout(firstTimer);
      clearInterval(timer);
    };
  }, [enabled, paused, tick]);

  const reset = useCallback(() => {
    setSignal(null);
    setIntents([]);
    setStatus("idle");
    setError(null);
  }, []);

  return { signal, intents, status, error, reset };
}
