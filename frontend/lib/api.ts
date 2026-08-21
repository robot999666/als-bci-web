import type {
  AnalyzeResponse,
  DemoSignalsResponse,
  HealthResponse,
} from "./types";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
  timeoutMs = 15000,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(
      0,
      "无法连接后端服务，请确认后端已启动（默认 http://localhost:8000）",
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let detail = `请求失败（HTTP ${response.status}）`;
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body.detail === "string") {
        detail = body.detail;
      }
    } catch {
      // 忽略非 JSON 错误响应
    }
    throw new ApiError(response.status, detail);
  }

  return (await response.json()) as T;
}

export const api = {
  health: () => request<HealthResponse>("/api/v1/health"),

  demoSignals: (windowSeconds = 5) =>
    request<DemoSignalsResponse>(
      `/api/v1/demo/signals?window_seconds=${windowSeconds}`,
    ),

  analyze: (file: File, windowSeconds = 2) => {
    const form = new FormData();
    form.append("file", file);
    form.append("window_seconds", String(windowSeconds));
    return request<AnalyzeResponse>(
      "/api/v1/analyze",
      { method: "POST", body: form },
      30000,
    );
  },
};

