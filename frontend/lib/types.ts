export type DataSourceKind = "demo" | "upload" | "device";

export type IntentLabel = "confirm" | "negate" | "sos" | "none";

export interface SignalData {
  sampling_rate_hz: number;
  channels: string[];
  timestamps: number[];
  values: Record<string, number[]>;
  time_reference: "epoch" | "relative";
  start_epoch: number | null;
}

export interface IntentWindow {
  index: number;
  start_epoch: number;
  end_epoch: number;
  start_time: string;
  end_time: string;
  label: IntentLabel;
  label_zh: string;
  confidence: number;
  reason: string;
  is_mock: boolean;
}

export interface DemoSignalsResponse {
  source: "demo";
  sampling_rate_hz: number;
  channels: string[];
  window_seconds: number;
  total_samples: number;
  signal: SignalData;
  intents: IntentWindow[];
  generated_at: string;
}

export interface AnalyzeResponse {
  source: "upload";
  filename: string;
  sampling_rate_hz: number;
  channels: string[];
  total_samples: number;
  signal: SignalData;
  intents: IntentWindow[];
  generated_at: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  time: string;
}

