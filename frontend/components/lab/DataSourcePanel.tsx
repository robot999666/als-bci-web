"use client";

import { useRef } from "react";
import type { DataSourceKind } from "@/lib/types";

interface DataSourcePanelProps {
  activeSource: DataSourceKind;
  uploading: boolean;
  onSelectDemo: () => void;
  onFile: (file: File) => void;
}

export default function DataSourcePanel({
  activeSource,
  uploading,
  onSelectDemo,
  onFile,
}: DataSourcePanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <h2 className="mb-4 text-sm font-semibold text-white">数据源</h2>

      <button
        type="button"
        onClick={onSelectDemo}
        aria-pressed={activeSource === "demo"}
        className={`w-full rounded-xl border p-4 text-left transition ${
          activeSource === "demo"
            ? "border-cyan-400/60 bg-cyan-500/10"
            : "border-slate-800 bg-slate-900/60 hover:border-slate-600"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">
          S3 科研数据回放
          </span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            可用
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          使用内置 3 通道 S3 样例，通过真实 EA+FBCSP 冷启动模型批量识别。
        </p>
      </button>

      <div
        className={`mt-3 rounded-xl border p-4 transition ${
          activeSource === "upload"
            ? "border-cyan-400/60 bg-cyan-500/10"
            : "border-slate-800 bg-slate-900/60"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">上传数据文件</span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            可用
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          支持 NPZ：X 形状为 (N, 3|22, 501)，250Hz、单位 μV；可选 y 标签。
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "分析中…" : "选择 NPZ 文件"}
          </button>
          <a
            href="/sample_data/S3_3ch.npz"
            download
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            下载 S3 示例
          </a>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".npz"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onFile(file);
            }
            event.target.value = "";
          }}
        />
      </div>

      <div
        aria-disabled="true"
        className="mt-3 cursor-not-allowed rounded-xl border border-slate-800 bg-slate-900/40 p-4 opacity-70"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">
            实时设备接入
          </span>
          <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] font-medium text-slate-300">
            开发中
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          设备接入开发中（ADS1299 → 本地采集程序 → WebSocket）。入口已预留，
          本阶段不实现硬件通信。
        </p>
      </div>
    </section>
  );
}
