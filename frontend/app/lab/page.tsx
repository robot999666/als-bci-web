import type { Metadata } from "next";
import LabWorkspace from "@/components/lab/LabWorkspace";

export const metadata: Metadata = {
  title: "在线实验平台 | ALS-BCI 科研原型",
  description:
    "在线实验平台：Demo 模拟实时信号、CSV 上传分析、多通道波形可视化与模拟意图识别时间轴。",
};

export default function LabPage() {
  return <LabWorkspace />;
}

