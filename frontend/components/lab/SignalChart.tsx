"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import {
  buildEmptyOption,
  buildSignalOption,
  getSignalChartHeight,
} from "@/lib/chartOptions";
import type { SignalData } from "@/lib/types";

interface SignalChartProps {
  signal: SignalData | null;
}

type ViewMode = "focus" | "all";

interface ViewState {
  signature: string;
  mode: ViewMode;
}

function chooseFocusChannels(channels: string[]): string[] {
  const preferred = ["C3", "Cz", "C4"].filter((channel) =>
    channels.includes(channel),
  );
  return preferred.length === 3 ? preferred : channels.slice(0, 3);
}

export default function SignalChart({ signal }: SignalChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const [viewState, setViewState] = useState<ViewState>({
    signature: "",
    mode: "focus",
  });
  const signalSignature = signal?.channels.join("|") ?? "";
  const viewMode =
    viewState.signature === signalSignature ? viewState.mode : "focus";

  const focusChannels = useMemo(
    () => chooseFocusChannels(signal?.channels ?? []),
    [signal],
  );
  const supportsFocusView = (signal?.channels.length ?? 0) > 3;
  const visibleChannels = useMemo(() => {
    if (!signal) {
      return [];
    }
    if (!supportsFocusView || viewMode === "all") {
      return signal.channels;
    }
    return focusChannels;
  }, [focusChannels, signal, supportsFocusView, viewMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const chart = echarts.init(container);
    chartRef.current = chart;
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(container);
    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }
    chart.setOption(
      signal
        ? buildSignalOption(signal, visibleChannels)
        : buildEmptyOption(),
      { notMerge: true },
    );
    chart.resize();
  }, [signal, visibleChannels]);

  const chartHeight = signal ? getSignalChartHeight(visibleChannels.length) : 360;

  return (
    <div>
      {signal ? (
        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-[12px] text-slate-400">
              <span className="rounded-lg border border-slate-700 bg-slate-950/45 px-3 py-1.5">
                {signal.channels.length} 通道
              </span>
              <span className="rounded-lg border border-slate-700 bg-slate-950/45 px-3 py-1.5">
                {signal.sampling_rate_hz} Hz
              </span>
              <span className="rounded-lg border border-slate-700 bg-slate-950/45 px-3 py-1.5">
                {signal.timestamps.length} 采样点
              </span>
              <span className="rounded-lg border border-slate-700 bg-slate-950/45 px-3 py-1.5">
                首个试次
              </span>
            </div>
            {supportsFocusView ? (
              <div
                className="flex rounded-lg border border-slate-700 bg-slate-950/55 p-1"
                aria-label="波形通道显示范围"
              >
                <button
                  type="button"
                  onClick={() =>
                    setViewState({ signature: signalSignature, mode: "focus" })
                  }
                  aria-pressed={viewMode === "focus"}
                  className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition ${
                    viewMode === "focus"
                      ? "bg-cyan-400 text-slate-950"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  重点通道
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setViewState({ signature: signalSignature, mode: "all" })
                  }
                  aria-pressed={viewMode === "all"}
                  className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition ${
                    viewMode === "all"
                      ? "bg-cyan-400 text-slate-950"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  全部通道
                </button>
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] text-slate-500">
              已显示 {visibleChannels.length} / {signal.channels.length} 通道
            </span>
            {visibleChannels.map((channel) => (
              <span
                key={channel}
                className="rounded-full border border-cyan-400/20 bg-cyan-500/6 px-2.5 py-1 text-[12px] font-medium text-cyan-200"
              >
                {channel}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="thin-scrollbar max-h-[660px] overflow-y-auto rounded-xl border border-slate-800/80 bg-slate-950/35">
        <div
          ref={containerRef}
          style={{ height: chartHeight }}
          className="w-full min-w-0"
          role="img"
          aria-label={
            signal
              ? `${visibleChannels.length} 个通道的脑电波形图`
              : "等待脑电数据"
          }
        />
      </div>
      {signal ? (
        <p className="mt-3 text-[12px] leading-6 text-slate-500">
          每个通道使用独立纵轴范围，纵轴单位为微伏（μV）；移动指针可查看具体时间与幅值。
        </p>
      ) : null}
    </div>
  );
}
