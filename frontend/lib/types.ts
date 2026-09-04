export type DataSourceKind = "example" | "upload";

export type IntentLabel = "left" | "right" | "forward" | "stop";

export interface SignalData {
  sampling_rate_hz: number;
  channels: string[];
  timestamps: number[];
  values: Record<string, number[]>;
  time_reference: "epoch" | "relative";
  start_epoch: number | null;
}

export interface IntentPrediction {
  trial_index: number;
  class_id: number;
  label: IntentLabel;
  label_zh: string;
  confidence: number;
  probabilities: Record<IntentLabel, number>;
  expected_class_id: number | null;
  correct: boolean | null;
  reason: string;
  is_mock: boolean;
}

export interface ValidationMetrics {
  labeled_trials: number;
  correct_trials: number;
  accuracy: number;
}

export interface BciBatchResponse {
  source: "demo" | "upload";
  filename: string | null;
  model_name: string;
  model_mode: "cold_start";
  sampling_rate_hz: number;
  channel_layout: "3ch" | "22ch";
  channels: string[];
  trial_count: number;
  window_samples: number;
  total_samples: number;
  signal: SignalData;
  predictions: IntentPrediction[];
  validation: ValidationMetrics | null;
  batch_coupled_alignment: true;
  generated_at: string;
}

export interface DemoSignalsResponse extends BciBatchResponse {
  source: "demo";
}

export interface AnalyzeResponse extends BciBatchResponse {
  source: "upload";
  filename: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  time: string;
  model_ready: boolean;
  model_name: string;
  model_mode: string;
  loaded_layouts: string[];
  model_checksums: Record<string, string>;
  runtime_versions: Record<string, string>;
  model_error: string | null;
}

export interface AssistantSource {
  title: string;
  section: string;
}

export interface AssistantChatResponse {
  answer: string;
  sources: AssistantSource[];
}
