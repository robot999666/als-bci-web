"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  IntentLabel,
  IntentPrediction,
  SignalData,
} from "@/lib/types";

const SAMPLING_RATE = 250;
const WINDOW_SAMPLES = 501;
const STEP_SAMPLES = 25;
const WAVEFORM_INTERVAL_MS = 100;
const RESULT_INTERVAL_MS = 2500;
const CHANNELS = ["C3", "Cz", "C4"];

interface ExampleSamples {
  C3: number[];
  Cz: number[];
  C4: number[];
}

interface IntentTemplate {
  classId: number;
  label: IntentLabel;
  labelZh: string;
  probabilities: Record<IntentLabel, number>;
}

const INTENT_SEQUENCE: IntentTemplate[] = [
  {
    classId: 0,
    label: "left",
    labelZh: "左转",
    probabilities: { left: 0.82, right: 0.08, forward: 0.06, stop: 0.04 },
  },
  {
    classId: 1,
    label: "right",
    labelZh: "右转",
    probabilities: { left: 0.08, right: 0.78, forward: 0.09, stop: 0.05 },
  },
  {
    classId: 2,
    label: "forward",
    labelZh: "直行",
    probabilities: { left: 0.06, right: 0.07, forward: 0.81, stop: 0.06 },
  },
  {
    classId: 3,
    label: "stop",
    labelZh: "停止",
    probabilities: { left: 0.05, right: 0.07, forward: 0.08, stop: 0.8 },
  },
];

function parseExampleCsv(csv: string): ExampleSamples {
  const rows = csv.trim().split(/\r?\n/).slice(1);
  const samples: ExampleSamples = { C3: [], Cz: [], C4: [] };
  for (const row of rows) {
    const columns = row.split(",");
    if (columns.length < 4) {
      continue;
    }
    const values = columns.slice(1, 4).map(Number);
    if (values.every(Number.isFinite)) {
      samples.C3.push(values[0]);
      samples.Cz.push(values[1]);
      samples.C4.push(values[2]);
    }
  }
  if (samples.C3.length < WINDOW_SAMPLES) {
    throw new Error("示例脑电数据长度不足");
  }
  return samples;
}

function generateFallbackSamples(): ExampleSamples {
  const length = SAMPLING_RATE * 10;
  const makeChannel = (phase: number, scale: number) =>
    Array.from({ length }, (_, index) => {
      const time = index / SAMPLING_RATE;
      return (
        scale * Math.sin(2 * Math.PI * 10 * time + phase) +
        4.2 * Math.sin(2 * Math.PI * 18 * time + phase * 0.7) +
        2.2 * Math.sin(2 * Math.PI * 6 * time + phase * 1.3)
      );
    });
  return {
    C3: makeChannel(0.2, 8.5),
    Cz: makeChannel(1.1, 7.2),
    C4: makeChannel(2.0, 8.1),
  };
}

function makePrediction(sequenceIndex: number): IntentPrediction {
  const template = INTENT_SEQUENCE[sequenceIndex % INTENT_SEQUENCE.length];
  return {
    trial_index: sequenceIndex,
    class_id: template.classId,
    label: template.label,
    label_zh: template.labelZh,
    confidence: template.probabilities[template.label],
    probabilities: template.probabilities,
    expected_class_id: null,
    correct: null,
    reason: "前端示例动画，不参与模型推理",
    is_mock: true,
  };
}

function circularWindow(values: number[], start: number): number[] {
  return Array.from(
    { length: WINDOW_SAMPLES },
    (_, index) => values[(start + index) % values.length],
  );
}

export function useExampleAnimation({ enabled }: { enabled: boolean }) {
  const [samples, setSamples] = useState<ExampleSamples | null>(null);
  const [cursor, setCursor] = useState(0);
  const sequenceIndexRef = useRef(0);
  const [predictions, setPredictions] = useState<IntentPrediction[]>([
    makePrediction(0),
  ]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/sample_data/demo_eeg.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error("示例数据读取失败");
        }
        return response.text();
      })
      .then(parseExampleCsv)
      .catch(generateFallbackSamples)
      .then((data) => {
        if (!cancelled) {
          setSamples(data);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(media.matches);
      if (media.matches) {
        setIsPlaying(false);
      }
    };
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  const shouldPlay = enabled && isPlaying && isVisible && samples !== null;

  useEffect(() => {
    if (!shouldPlay || !samples) {
      return;
    }
    const timer = window.setInterval(() => {
      setCursor((value) => (value + STEP_SAMPLES) % samples.C3.length);
    }, WAVEFORM_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [samples, shouldPlay]);

  useEffect(() => {
    if (!shouldPlay) {
      return;
    }
    const timer = window.setInterval(() => {
      sequenceIndexRef.current += 1;
      setPredictions((items) => [
        ...items,
        makePrediction(sequenceIndexRef.current),
      ].slice(-8));
    }, RESULT_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [shouldPlay]);

  const signal = useMemo<SignalData | null>(() => {
    if (!samples) {
      return null;
    }
    return {
      sampling_rate_hz: SAMPLING_RATE,
      channels: CHANNELS,
      timestamps: Array.from(
        { length: WINDOW_SAMPLES },
        (_, index) => index / SAMPLING_RATE,
      ),
      values: {
        C3: circularWindow(samples.C3, cursor),
        Cz: circularWindow(samples.Cz, cursor),
        C4: circularWindow(samples.C4, cursor),
      },
      time_reference: "relative",
      start_epoch: null,
    };
  }, [cursor, samples]);

  const reset = useCallback(() => {
    setCursor(0);
    sequenceIndexRef.current = 0;
    setPredictions([makePrediction(0)]);
    if (!prefersReducedMotion) {
      setIsPlaying(true);
    }
  }, [prefersReducedMotion]);

  const togglePlayback = useCallback(() => {
    setIsPlaying((value) => !value);
  }, []);

  return {
    signal,
    predictions,
    isPlaying,
    isReady: samples !== null,
    reset,
    togglePlayback,
  };
}
