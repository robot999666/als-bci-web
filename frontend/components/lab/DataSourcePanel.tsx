"use client";
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
          自动播放 3 通道脑电波形和四类结果，用于展示界面交互效果，不参与模型推理。
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
          <span className="text-[15px] font-medium text-white">上传数据文件</span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            真实模型
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-6 text-slate-400">
          支持 NumPy 压缩数组文件（NPZ）：X 形状为 (N, 3|22, 501)，
          采样率 250 Hz、单位 μV，可选 y 标签。
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
    </section>
  );
}
