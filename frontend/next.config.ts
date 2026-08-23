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
    if (key && value) {
      process.env[key] = value;
    }
  }
}

loadRootEnv();

const apiBaseUrl =
  process.env.PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

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

// 开发服务器默认只放行 localhost；通过 cpolar 公网域名访问时，
// 浏览器请求会携带该域名的 Origin，需将其加入 allowedDevOrigins。
// 主机名来自根目录 .env 的 PUBLIC_FRONTEND_URL，cpolar 网址变化时只需改 .env。
const allowedDevOrigins = [
  extractHostname(process.env.PUBLIC_FRONTEND_URL),
].filter((host): host is string => host !== null);

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
