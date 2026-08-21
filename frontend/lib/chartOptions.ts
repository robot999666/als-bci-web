import * as echarts from "echarts";
import type { SignalData } from "./types";
import { CHANNEL_COLORS } from "./labels";

const GRID_LEFT = 64;
const GRID_RIGHT = 20;
const TOP_PAD = 48;
const BOTTOM_PAD = 46;
const GRID_GAP = 12;

export function buildSignalOption(signal: SignalData): echarts.EChartsOption {
  const channels = signal.channels;
  const n = Math.max(1, channels.length);
  const usable = 100 - TOP_PAD - BOTTOM_PAD;
  const heightPer = (usable - GRID_GAP * (n - 1)) / n;

  const grids = channels.map((_, i) => ({
    left: GRID_LEFT,
    right: GRID_RIGHT,
    top: TOP_PAD + i * (heightPer + GRID_GAP),
    height: heightPer,
  }));

  const yAxes = channels.map((channel, i) => ({
    gridIndex: i,
    type: "value" as const,
    scale: true,
    name: channel,
    nameTextStyle: { color: "#7dd3fc", fontSize: 10, fontWeight: 600 },
    axisLabel: { color: "#64748b", fontSize: 10 },
    splitLine: { lineStyle: { color: "#1e293b", opacity: 0.7 } },
  }));

  const xAxes = channels.map((_, i) => ({
    gridIndex: i,
    type: "value" as const,
    min: signal.timestamps[0],
    max: signal.timestamps[signal.timestamps.length - 1],
    show: i === n - 1,
    name: i === n - 1 ? "时间 (s)" : undefined,
    nameTextStyle: { color: "#64748b", fontSize: 10 },
    axisLabel: { color: "#64748b", fontSize: 10 },
    splitLine: { show: false },
    axisLine: { lineStyle: { color: "#334155" } },
  }));

  const series = channels.map((channel, i) => {
    const values = signal.values[channel] ?? [];
    const color = CHANNEL_COLORS[i % CHANNEL_COLORS.length];
    return {
      name: channel,
      type: "line" as const,
      xAxisIndex: i,
      yAxisIndex: i,
      showSymbol: false,
      sampling: "lttb" as const,
      lineStyle: { width: 1.2, color },
      itemStyle: { color },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: `${color}22` },
          { offset: 1, color: `${color}00` },
        ]),
      },
      data: signal.timestamps.map((t, j) => [t, values[j] ?? 0]),
    };
  });

  return {
    animation: false,
    backgroundColor: "transparent",
    legend: {
      top: 8,
      left: "center",
      data: channels,
      textStyle: { color: "#94a3b8", fontSize: 11 },
      itemWidth: 14,
      itemHeight: 2,
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: "rgba(2, 6, 23, 0.92)",
      borderColor: "#334155",
      textStyle: { color: "#e2e8f0", fontSize: 11 },
    },
    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series,
  };
}

export function buildEmptyOption(message = "等待数据…"): echarts.EChartsOption {
  return {
    backgroundColor: "transparent",
    title: {
      text: message,
      left: "center",
      top: "middle",
      textStyle: { color: "#475569", fontSize: 14, fontWeight: 400 },
    },
  };
}

