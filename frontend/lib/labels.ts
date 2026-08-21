import type { IntentLabel } from "./types";

export interface LabelMeta {
  zh: string;
  color: string;
  chipClass: string;
}

export const LABEL_META: Record<IntentLabel, LabelMeta> = {
  confirm: {
    zh: "确认",
    color: "#34d399",
    chipClass: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  },
  negate: {
    zh: "否定",
    color: "#fbbf24",
    chipClass: "border-amber-400/40 bg-amber-500/10 text-amber-300",
  },
  sos: {
    zh: "紧急求助",
    color: "#fb7185",
    chipClass: "border-rose-400/40 bg-rose-500/10 text-rose-300",
  },
  none: {
    zh: "无有效意图",
    color: "#94a3b8",
    chipClass: "border-slate-400/40 bg-slate-500/10 text-slate-300",
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

