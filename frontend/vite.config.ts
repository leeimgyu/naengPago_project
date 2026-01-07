import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    proxy: {
      // 프론트에서 '/api'로 시작하는 모든 요청을 백엔드 서버(8080 포트)로 전달합니다.
      "/api": {
        target: "http://localhost:8080", // 백엔드 서버의 포트 번호
        changeOrigin: true, // 호스트 헤더를 백엔드 URL로 변경
        // rewrite는 필요하지 않습니다. 백엔드 컨트롤러가 이미 /api/auth를 사용하고 있습니다.
      },
    },
  },
});
