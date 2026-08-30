import type { Metadata } from "next";
import LabWorkspace from "@/components/lab/LabWorkspace";

export const metadata: Metadata = {
  title: "在线实验平台 | ALS-BCI 科研原型",
  description:
    "在线实验平台：S3 科研数据回放、NPZ 批量分析、多通道波形与 BCI 四分类预测。",
};

export default function LabPage() {
  return <LabWorkspace />;
}
