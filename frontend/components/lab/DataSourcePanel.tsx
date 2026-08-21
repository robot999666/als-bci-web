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
            Demo 模拟实时数据
          </span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            可用
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          自动生成 EEG/EOG 时序信号（250Hz）并动态绘制波形，可暂停观察。
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
          支持 CSV：列包括 timestamp 与任意数值信号通道（如 EEG1…、EOG），
          通道数自动识别。
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "分析中…" : "选择 CSV 文件"}
          </button>
          <a
            href="/sample_data/demo_eeg.csv"
            download
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            下载示例数据
          </a>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
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

