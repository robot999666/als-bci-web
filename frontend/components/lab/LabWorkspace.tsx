"use client";

import { useCallback, useMemo, useState } from "react";
import DataSourcePanel from "@/components/lab/DataSourcePanel";
import SignalChart from "@/components/lab/SignalChart";
import IntentPanel from "@/components/lab/IntentPanel";
import IntentTimeline from "@/components/lab/IntentTimeline";
import PipelineView from "@/components/lab/PipelineView";
import { api } from "@/lib/api";
import type {
  AnalyzeResponse,
  DataSourceKind,
  IntentWindow,
  SignalData,
} from "@/lib/types";
import { useDemoStream } from "@/hooks/useDemoStream";

export default function LabWorkspace() {
  const [source, setSource] = useState<DataSourceKind>("demo");
  const [paused, setPaused] = useState(false);
  const [uploaded, setUploaded] = useState<AnalyzeResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const stream = useDemoStream({ enabled: source === "demo", paused });

  const handleSelectDemo = useCallback(() => {
    setSource("demo");
    setPaused(false);
    setUploaded(null);
    setUploadError(null);
    stream.reset();
  }, [stream]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        setUploadError("请选择 .csv 文件");
        return;
      }
      setUploading(true);
      setUploadError(null);
      try {
        const response = await api.analyze(file, 2);
        setUploaded(response);
        setSource("upload");
        setPaused(false);
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : "文件分析失败，请检查格式后重试",
        );
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  const signal: SignalData | null =
    source === "demo" ? stream.signal : (uploaded?.signal ?? null);

  const intents: IntentWindow[] =
    source === "demo" ? stream.intents : (uploaded?.intents ?? []);

  const sourceLabel = useMemo(() => {
    if (source === "demo") {
      return paused ? "Demo 已暂停" : "Demo 模拟实时数据";
    }
    if (source === "upload" && uploaded) {
      return `上传文件：${uploaded.filename}`;
    }
    return "等待数据源";
  }, [source, paused, uploaded]);

  const displayError = source === "demo" ? stream.error : uploadError;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          在线实验平台
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          数据输入 → 信号展示 → 模拟处理 → 意图输出
        </p>
        <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-xs leading-relaxed text-amber-200/80">
          当前为 Demo 模拟识别结果：信号由确定性模拟器生成，意图由 Mock
          模型规则表产出，仅供实验演示，不构成医疗判断。
        </div>
      </header>

      {displayError ? (
        <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {displayError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
        <DataSourcePanel
          activeSource={source}
          uploading={uploading}
          onSelectDemo={handleSelectDemo}
          onFile={handleFile}
        />

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white">多通道波形</h2>
              <span className="mt-1 inline-block rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-[11px] text-slate-300">
                {sourceLabel}
              </span>
            </div>
            {source === "demo" ? (
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                className="rounded-lg border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300"
              >
                {paused ? "继续" : "暂停"}
              </button>
            ) : null}
          </div>
          <div className="h-[420px] w-full">
            <SignalChart signal={signal} />
          </div>
        </section>

        <IntentPanel intents={intents} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <IntentTimeline intents={intents} />
        <PipelineView hasData={intents.length > 0} streaming={source === "demo"} />
      </div>
    </div>
  );
}

