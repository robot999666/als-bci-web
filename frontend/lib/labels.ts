import type { IntentLabel } from "./types";

export interface LabelMeta {
  zh: string;
  color: string;
  chipClass: string;
}

export const LABEL_META: Record<IntentLabel, LabelMeta> = {
  left: {
    zh: "左转",
    color: "#22d3ee",
    chipClass: "border-cyan-400/40 bg-cyan-500/10 text-cyan-300",
  },
  right: {
    zh: "右转",
    color: "#fbbf24",
    chipClass: "border-amber-400/40 bg-amber-500/10 text-amber-300",
  },
  forward: {
    zh: "直行",
    color: "#34d399",
    chipClass: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  },
  stop: {
    zh: "停止",
    color: "#fb7185",
    chipClass: "border-rose-400/40 bg-rose-500/10 text-rose-300",
  },
};

export const CHANNEL_COLORS = [
  "#22d3ee",
  "#818cf8",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#a78bfa",
  "#2dd4bf",
  "#f472b6",
];
