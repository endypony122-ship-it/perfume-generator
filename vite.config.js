import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    strictPort: false, // もし5173が完全に塞がっていたら自動で空きポートを探す（エラーで落ちないようにする保険）
  },
});
