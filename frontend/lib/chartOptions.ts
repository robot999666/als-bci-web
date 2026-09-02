import * as echarts from "echarts";
import type { SignalData } from "./types";
import { CHANNEL_COLORS } from "./labels";

const GRID_LEFT = 94;
const GRID_RIGHT = 28;
const TOP_PAD = 22;
const BOTTOM_PAD = 54;
const CHANNEL_ROW_HEIGHT = 88;
const GRID_GAP = 16;

export function getSignalChartHeight(channelCount: number): number {
  return Math.max(
    300,
    TOP_PAD + BOTTOM_PAD + Math.max(1, channelCount) * CHANNEL_ROW_HEIGHT,
  );
}

function formatAmplitude(value: number): string {
  const absolute = Math.abs(value);
  if (absolute >= 100) {
    return value.toFixed(0);
  }
  if (absolute >= 10) {
    return value.toFixed(1);
  }
  return value.toFixed(2);
}

export function buildSignalOption(
  signal: SignalData,
  visibleChannels: string[],
): echarts.EChartsOption {
  const channels = visibleChannels.length > 0 ? visibleChannels : signal.channels;
  const rowHeight = CHANNEL_ROW_HEIGHT - GRID_GAP;
  const lastIndex = channels.length - 1;

  const grids = channels.map((_, index) => ({
    left: GRID_LEFT,
    right: GRID_RIGHT,
    top: TOP_PAD + index * CHANNEL_ROW_HEIGHT,
    height: rowHeight,
    containLabel: false,
  }));

  const yAxes = channels.map((channel, index) => ({
    gridIndex: index,
    type: "value" as const,
    scale: true,
    name: channel,
    nameLocation: "middle" as const,
    nameGap: 62,
    nameRotate: 0,
    nameTextStyle: {
      color: "#a5f3fc",
      fontSize: 12,
      fontWeight: 600,
      align: "center" as const,
    },
    axisLabel: {
      color: "#64748b",
      fontSize: 10,
      margin: 8,
      formatter: (value: number) => formatAmplitude(value),
    },
    axisTick: { show: false },
    axisLine: { show: false },
    splitNumber: 2,
    splitLine: { lineStyle: { color: "#1e293b", opacity: 0.75 } },
  }));

  const xAxes = channels.map((_, index) => ({
    gridIndex: index,
    type: "value" as const,
    min: signal.timestamps[0] ?? 0,
    max: signal.timestamps[signal.timestamps.length - 1] ?? 2,
    show: index === lastIndex,
    name: index === lastIndex ? "时间（秒）" : undefined,
    nameLocation: "middle" as const,
    nameGap: 34,
    nameTextStyle: { color: "#94a3b8", fontSize: 11 },
    axisLabel: {
      color: "#64748b",
      fontSize: 10,
      formatter: (value: number) => value.toFixed(1),
    },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLine: { lineStyle: { color: "#334155" } },
  }));

  const series = channels.map((channel, index) => {
    const values = signal.values[channel] ?? [];
    const originalIndex = Math.max(0, signal.channels.indexOf(channel));
    const color = CHANNEL_COLORS[originalIndex % CHANNEL_COLORS.length];
    return {
      name: channel,
      type: "line" as const,
      xAxisIndex: index,
      yAxisIndex: index,
      showSymbol: false,
      sampling: "lttb" as const,
      lineStyle: { width: 1.35, color, opacity: 0.95 },
      itemStyle: { color },
      emphasis: { lineStyle: { width: 2 } },
      data: signal.timestamps.map((time, pointIndex) => [
        time,
        values[pointIndex] ?? 0,
      ]),
    };
  });

  return {
    animation: false,
    backgroundColor: "transparent",
    axisPointer: {
      link: [{ xAxisIndex: "all" }],
      label: { backgroundColor: "#0f172a" },
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      axisPointer: { type: "line" },
      backgroundColor: "rgba(2, 6, 23, 0.96)",
      borderColor: "#334155",
      padding: 10,
      textStyle: { color: "#e2e8f0", fontSize: 12 },
      valueFormatter: (value: unknown) => {
        if (Array.isArray(value) && typeof value[1] === "number") {
          return `${formatAmplitude(value[1])} μV`;
        }
        return String(value);
      },
    },
    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series,
  };
}

export function buildEmptyOption(message = "等待脑电数据…"): echarts.EChartsOption {
  return {
    backgroundColor: "transparent",
    title: {
      text: message,
      subtext: "正在载入示例动画，也可上传数据文件",
      left: "center",
      top: "middle",
      textStyle: { color: "#64748b", fontSize: 15, fontWeight: 500 },
      subtextStyle: { color: "#475569", fontSize: 12, lineHeight: 26 },
    },
  };
}
