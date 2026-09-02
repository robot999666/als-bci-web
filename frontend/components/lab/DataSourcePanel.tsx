"use client";
import { useEffect, useState } from "react";
import type { DataSourceKind } from "@/lib/types";

interface DataSourcePanelProps {
  activeSource: DataSourceKind;
  uploading: boolean;
  onSelectExample: () => void;
  onFile: (file: File) => void;
}

export default function DataSourcePanel({
  activeSource,
  uploading,
  onSelectExample,
  onFile,
}: DataSourcePanelProps) {
  const [formatOpen, setFormatOpen] = useState(false);

  useEffect(() => {
    if (!formatOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFormatOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formatOpen]);

  return (
    <section className="card-surface rounded-2xl p-5">
      <h2 className="mb-4 text-base font-semibold text-white">数据来源</h2>

      <button
        type="button"
        onClick={onSelectExample}
        aria-pressed={activeSource === "example"}
        className={`w-full rounded-xl border p-4 text-left transition ${
          activeSource === "example"
            ? "border-cyan-400/60 bg-cyan-500/10"
            : "border-slate-800 bg-slate-900/60 hover:border-slate-600"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-medium text-white">
            示例数据动画
          </span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            前端运行
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-6 text-slate-400">
          自动播放 3 通道脑电示例波形与四分类结果，用于快速了解平台交互流程，未进行真实模型推理。
        </p>
      </button>

      <div
        className={`mt-3 rounded-xl border p-4 transition ${
          activeSource === "upload"
            ? "border-cyan-400/60 bg-cyan-500/10"
            : "border-slate-800 bg-slate-900/60"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[15px] font-medium text-white">上传数据文件</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFormatOpen(true)}
              className="rounded-full border border-cyan-400/30 bg-cyan-500/8 px-2.5 py-0.5 text-[10px] font-medium text-cyan-200 transition hover:border-cyan-300/60 hover:text-white"
            >
              格式要求
            </button>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              真实模型
            </span>
          </div>
        </div>
        <p className="mt-2 text-[13px] leading-6 text-slate-400">
          上传符合规范的脑电数据文件，系统将完成数据检查、模型推理，并返回四分类意图结果，支持 3 通道或 22 通道脑电数据。
        </p>
        <div className="mt-3 flex items-center gap-2">
          <label
            htmlFor="bci-npz-upload"
            aria-disabled={uploading}
            className={`rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-600 ${
              uploading ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            {uploading ? "分析中…" : "选择 NPZ 文件"}
          </label>
          <a
            href="/sample_data/S3_3ch.npz"
            download
            className="text-[12px] text-cyan-400 hover:text-cyan-300"
          >
            下载 NPZ 样例
          </a>
        </div>
        <input
          id="bci-npz-upload"
          type="file"
          accept=".npz"
          className="sr-only"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onFile(file);
            }
            event.target.value = "";
          }}
        />
      </div>

      <p className="mt-4 border-t border-slate-800 pt-4 text-[12px] leading-6 text-slate-500">
        示例动画无需后端；上传文件时，数据仅在本次请求内完成推理，服务日志不记录原始脑电内容。
      </p>

      {formatOpen ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="npz-format-title"
        >
          <button
            type="button"
            aria-label="关闭格式要求弹窗"
            onClick={() => setFormatOpen(false)}
            className="absolute inset-0 cursor-default bg-slate-950/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-4">
              <div>
                <h3
                  id="npz-format-title"
                  className="text-base font-semibold text-white"
                >
                  NPZ 文件格式要求
                </h3>
                <p className="mt-1 text-[12px] leading-6 text-slate-400">
                  支持读取 NumPy 压缩数组格式（.npz）
                </p>
              </div>
              <button
                type="button"
                aria-label="关闭"
                onClick={() => setFormatOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-5 text-[13px] leading-7 text-slate-300">
              <ul className="list-disc space-y-2 pl-5 marker:text-cyan-400">
                <li>
                  输入数据 <code className="rounded bg-slate-950/70 px-1.5 py-0.5 text-[12px] text-cyan-200">X</code>
                  ：数组形状为{" "}
                  <code className="rounded bg-slate-950/70 px-1.5 py-0.5 text-[12px] text-cyan-200">
                    (N, 3|22, 501)
                  </code>
                  ，采样率 <strong className="text-white">250 Hz</strong>，信号单位为{" "}
                  <strong className="text-white">μV</strong>；
                </li>
                <li>
                  可选标签数组{" "}
                  <code className="rounded bg-slate-950/70 px-1.5 py-0.5 text-[12px] text-cyan-200">y</code>
                  ，非必需。
                </li>
              </ul>
              <p className="mt-4 rounded-lg border border-cyan-400/15 bg-cyan-500/5 px-3 py-2 text-[12px] leading-6 text-cyan-100/75">
                注：
                <code className="rounded bg-slate-950/70 px-1.5 py-0.5 text-[11px] text-cyan-200">
                  3|22
                </code>
                代表通道数可为 3 或 22。
              </p>
            </div>
            <div className="flex justify-end border-t border-slate-800 bg-slate-950/40 px-6 py-3">
              <button
                type="button"
                onClick={() => setFormatOpen(false)}
                className="rounded-lg bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
