"use client";

import { useCallback, useMemo, useState } from "react";
import DataSourcePanel from "@/components/lab/DataSourcePanel";
import SignalChart from "@/components/lab/SignalChart";
import IntentPanel from "@/components/lab/IntentPanel";
import IntentTimeline from "@/components/lab/IntentTimeline";
import PipelineView from "@/components/lab/PipelineView";
import ValidationSummary from "@/components/lab/ValidationSummary";
import { api } from "@/lib/api";
import type {
  AnalyzeResponse,
  DataSourceKind,
  BciBatchResponse,
  IntentPrediction,
  SignalData,
} from "@/lib/types";
import { useDemoStream } from "@/hooks/useDemoStream";

export default function LabWorkspace() {
  const [source, setSource] = useState<DataSourceKind>("demo");
  const [uploaded, setUploaded] = useState<AnalyzeResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const stream = useDemoStream({ enabled: source === "demo" });

  const handleSelectDemo = useCallback(() => {
    setSource("demo");
    setUploaded(null);
    setUploadError(null);
    stream.reset();
  }, [stream]);

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
    source === "demo" ? stream.signal : (uploaded?.signal ?? null);

  const predictions: IntentPrediction[] =
    source === "demo" ? stream.predictions : (uploaded?.predictions ?? []);

  const currentResult: BciBatchResponse | null =
    source === "demo" ? stream.result : uploaded;

  const sourceLabel = useMemo(() => {
    if (source === "demo") {
      return stream.status === "loading" ? "S3 数据加载中" : "S3 科研数据回放";
    }
    if (source === "upload" && uploaded) {
      return `上传文件：${uploaded.filename}`;
    }
    return "等待数据源";
  }, [source, stream.status, uploaded]);

  const displayError = source === "demo" ? stream.error : uploadError;

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
          当前使用冷启动科研模型。S3 数据为科研样例回放，并非实时设备或临床验证结果；
          识别结果仅用于算法与软件实验，不构成医疗判断。
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
          onSelectDemo={handleSelectDemo}
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
            {source === "demo" ? (
              <button
                type="button"
                onClick={stream.reset}
                disabled={stream.status === "loading"}
                className="rounded-lg border border-slate-700 px-4 py-2 text-[12px] font-medium text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300 disabled:opacity-50"
              >
                重新推理
              </button>
            ) : null}
          </div>
          <SignalChart signal={signal} />
        </section>

        <div className="lg:col-span-2 xl:col-span-1">
          <IntentPanel predictions={predictions} />
        </div>
      </div>

      <div className="mt-4">
        <ValidationSummary result={currentResult} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <IntentTimeline predictions={predictions} />
        <PipelineView hasData={predictions.length > 0} streaming={false} />
      </div>

      <p className="mt-6 rounded-xl border border-slate-800 bg-slate-900/35 px-5 py-4 text-[12px] leading-6 text-slate-500">
        研究展望：后续将围绕 ADS1299 脑电采集硬件、实时数据链路、用户级对齐参考和预测平滑开展研究；相关能力不属于当前在线实验范围。
      </p>
    </div>
  );
}
