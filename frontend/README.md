# frontend

ALS-BCI V0 科研原型的前端（Next.js 16 · TypeScript · Tailwind CSS v4 · ECharts）。

启动与说明见仓库根目录 [README.md](../README.md)。

```powershell
npm install
npm run dev        # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build
```

接口地址默认 `http://localhost:8000`，可通过 `frontend/.env.local` 中的
`NEXT_PUBLIC_API_BASE_URL` 修改。

全站右下角的“BCI 智答 · 项目助手”只调用上述 FastAPI 地址的
`/api/v1/assistant/chat`，不会在前端读取或携带上游模型密钥。
