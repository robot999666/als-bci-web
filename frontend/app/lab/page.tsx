import type { Metadata } from "next";
import LabWorkspace from "@/components/lab/LabWorkspace";

export const metadata: Metadata = {
  title: "脑电四分类在线实验 | ALS-BCI",
  description:
    "ALS-BCI 在线实验平台：无后端示例动画、NPZ 真实批量分析、多通道脑电波形与四分类预测。",
};

export default function LabPage() {
  return <LabWorkspace />;
}
