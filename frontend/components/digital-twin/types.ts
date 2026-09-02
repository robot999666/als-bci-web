import type { MutableRefObject } from "react";

export type DemoPhase =
  | "idle"
  | "imagining"
  | "acquiring"
  | "transmitting"
  | "processing"
  | "classified"
  | "executing"
  | "complete";

export type CommandId = "left" | "right" | "forward" | "stop";

export interface DemoCommand {
  id: CommandId;
  imagination: string;
  intent: string;
  intentEn: string;
  accent: "cyan" | "violet" | "emerald" | "rose";
}

export interface WheelchairPose {
  x: number;
  z: number;
  yaw: number;
}

export interface RuntimeTimeline {
  phase: DemoPhase;
  command: DemoCommand | null;
  progress: number;
  startedAt: number;
  duration: number;
  runId: number;
}

export type TimelineRef = MutableRefObject<RuntimeTimeline>;

export const COMMANDS: DemoCommand[] = [
  {
    id: "left",
    imagination: "左手运动想象",
    intent: "左转",
    intentEn: "LEFT",
    accent: "cyan",
  },
  {
    id: "right",
    imagination: "右手运动想象",
    intent: "右转",
    intentEn: "RIGHT",
    accent: "violet",
  },
  {
    id: "forward",
    imagination: "双脚运动想象",
    intent: "直行",
    intentEn: "FORWARD",
    accent: "emerald",
  },
  {
    id: "stop",
    imagination: "舌头运动想象",
    intent: "停止",
    intentEn: "STOP",
    accent: "rose",
  },
];

export const PHASE_LABELS: Record<DemoPhase, string> = {
  idle: "等待选择运动想象",
  imagining: "运动想象",
  acquiring: "EEG 脑电采集",
  transmitting: "脑电信号传输",
  processing: "FBCSP + LDA 模型处理",
  classified: "四分类意图输出",
  executing: "电动轮椅执行",
  complete: "本次指令执行完成",
};

export const PROCESS_STEPS = [
  { phase: "imagining" as const, label: "运动想象", short: "想象" },
  { phase: "acquiring" as const, label: "脑电采集", short: "采集" },
  { phase: "transmitting" as const, label: "信号传输", short: "传输" },
  { phase: "processing" as const, label: "模型识别", short: "识别" },
  { phase: "classified" as const, label: "指令输出", short: "输出" },
  { phase: "executing" as const, label: "轮椅执行", short: "执行" },
];

export const INITIAL_POSE: WheelchairPose = { x: 0, z: 0, yaw: 0 };
