"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { buildEmptyOption, buildSignalOption } from "@/lib/chartOptions";
import type { SignalData } from "@/lib/types";

interface SignalChartProps {
  signal: SignalData | null;
}

export default function SignalChart({ signal }: SignalChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

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
      signal ? buildSignalOption(signal) : buildEmptyOption(),
      { notMerge: true },
    );
  }, [signal]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="img"
      aria-label="多通道 EEG/EOG 波形图"
    />
  );
}

