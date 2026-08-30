import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * 读取仓库根目录 .env（临时公网地址统一维护处），
 * 将 PUBLIC_BACKEND_URL 注入为前端可用的 NEXT_PUBLIC_API_BASE_URL。
 * 未配置时保持原有 localhost 默认行为。
 */
function loadRootEnv(): void {
  const envPath = path.join(process.cwd(), "..", ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }
  const content = fs.readFileSync(envPath, "utf-8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const eq = line.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    // CI、容器或当前 shell 显式提供的环境变量优先于根目录开发配置。
    if (key && value && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadRootEnv();

const apiBaseUrl =
  process.env.PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

/** 单个 URL 解析 hostname；非法或缺失返回 null，不影响其他条目。 */
function extractHostname(url: string | undefined): string | null {
  if (!url) {
    return null;
  }
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/**
 * 开发服务器默认只放行 localhost；通过 cpolar 公网域名访问时，
 * 浏览器请求会携带该域名的 Origin，需将其加入 allowedDevOrigins。
 * PUBLIC_FRONTEND_URL 支持逗号分隔多个 URL：逐个解析 hostname，
 * 单个非法 URL 仅被跳过，不会导致整个配置失败。
 */
const allowedDevOrigins = (process.env.PUBLIC_FRONTEND_URL ?? "")
  .split(",")
  .map((raw) => raw.trim())
  .map(extractHostname)
  .filter((host): host is string => host !== null);

const nextConfig: NextConfig = {
  allowedDevOrigins,
  ...(apiBaseUrl
    ? {
        env: {
          NEXT_PUBLIC_API_BASE_URL: apiBaseUrl,
        },
      }
    : {}),
};

export default nextConfig;
