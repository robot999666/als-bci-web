"use client";

import { useCallback, useMemo, useState } from "react";
import DataSourcePanel from "@/components/lab/DataSourcePanel";
import SignalChart from "@/components/lab/SignalChart";
import IntentPanel from "@/components/lab/IntentPanel";
import IntentTimeline from "@/components/lab/IntentTimeline";
import PipelineView from "@/components/lab/PipelineView";
import ValidationSummary from "@/components/lab/ValidationSummary";
import DigitalTwinLoader from "@/components/digital-twin/DigitalTwinLoader";
import { api } from "@/lib/api";
import type {
  AnalyzeResponse,
  DataSourceKind,
  BciBatchResponse,
  IntentPrediction,
  SignalData,
} from "@/lib/types";
import { useExampleAnimation } from "@/hooks/useExampleAnimation";

export default function LabWorkspace() {
  const [source, setSource] = useState<DataSourceKind>("example");
  const [uploaded, setUploaded] = useState<AnalyzeResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const animation = useExampleAnimation({ enabled: source === "example" });

  const handleSelectExample = useCallback(() => {
    setSource("example");
    setUploaded(null);
    setUploadError(null);
    animation.reset();
  }, [animation]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".npz")) {
        setUploadError("请选择 .npz 文件");
        return;
      }
      setUploading(true);
      setUploadError(null);
      try {
        const response = await api.analyze(file);
        setUploaded(response);
        setSource("upload");
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
    source === "example" ? animation.signal : (uploaded?.signal ?? null);

  const predictions: IntentPrediction[] =
    source === "example" ? animation.predictions : (uploaded?.predictions ?? []);

  const currentResult: BciBatchResponse | null =
    source === "example" ? null : uploaded;

  const sourceLabel = useMemo(() => {
    if (source === "example") {
      return animation.isReady ? "示例数据动画 · 前端播放" : "示例动画载入中";
    }
    if (source === "upload" && uploaded) {
      return `上传文件：${uploaded.filename}`;
    }
    return "等待数据源";
  }, [animation.isReady, source, uploaded]);

  // 默认动画不会发起网络请求；该错误只可能来自用户主动上传。
  const displayError = uploadError;
  const displayMode = source === "example" ? "example" : "model";

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6">
      <header className="mb-7">
        <p className="text-[13px] font-semibold tracking-[0.14em] text-cyan-300">
          在线实验平台
        </p>
        <h1 className="mt-2 text-[30px] font-bold text-white sm:text-4xl">
          脑电四分类在线实验
        </h1>
        <p className="mt-3 text-[15px] text-slate-400">
          数据输入 → 欧氏对齐（EA）→ 滤波器组共空间模式（FBCSP）→ 线性判别分析（LDA）→ 四分类指令
        </p>
        <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-[13px] leading-6 text-amber-100/75">
          默认示例动画在浏览器本地运行，不连接后端，也不代表模型结果；上传符合规范的 NPZ 文件后，
          系统才会调用真实冷启动模型。所有内容仅用于科研与软件实验，不构成医疗判断。
        </div>
      </header>

      {displayError ? (
        <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {displayError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        <DataSourcePanel
          activeSource={source}
          uploading={uploading}
          onSelectExample={handleSelectExample}
          onFile={handleFile}
        />

        <section className="card-surface rounded-2xl p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">多通道脑电波形</h2>
              <span className="mt-1 inline-block rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-[11px] text-slate-300">
                {sourceLabel}
              </span>
            </div>
            {source === "example" ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={animation.togglePlayback}
                  disabled={!animation.isReady}
                  className="rounded-lg border border-cyan-400/35 bg-cyan-500/8 px-4 py-2 text-[12px] font-medium text-cyan-200 transition hover:border-cyan-300 hover:text-white disabled:opacity-50"
                >
                  {animation.isPlaying ? "暂停动画" : "继续动画"}
                </button>
                <button
                  type="button"
                  onClick={animation.reset}
                  disabled={!animation.isReady}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-[12px] font-medium text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300 disabled:opacity-50"
                >
                  重新播放
                </button>
              </div>
            ) : null}
          </div>
          <SignalChart signal={signal} mode={displayMode} />
        </section>

        <div className="lg:col-span-2 xl:col-span-1">
          <IntentPanel predictions={predictions} mode={displayMode} />
        </div>
      </div>

      <div className="mt-4">
        <ValidationSummary
          result={currentResult}
          mode={displayMode}
          isPlaying={animation.isPlaying}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <IntentTimeline predictions={predictions} mode={displayMode} />
        <PipelineView
          hasData={predictions.length > 0}
          streaming={source === "example" && animation.isPlaying}
          mode={displayMode}
        />
      </div>

      <p className="mt-6 rounded-xl border border-slate-800 bg-slate-900/35 px-5 py-4 text-[12px] leading-6 text-slate-500">
        研究展望：后续将围绕 ADS1299 脑电采集硬件、实时数据链路、用户级对齐参考和预测平滑开展研究；相关能力不属于当前在线实验范围。
      </p>

      <DigitalTwinLoader />
    </div>
  );
}
