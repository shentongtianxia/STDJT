/** 离线单文件构建：把整个 SPA 内联到一个 HTML 里，双击即可在
 *  浏览器打开（file:// 也行）。配 HashRouter + window.fetch 拦截。
 *
 *  使用：npm run build:offline → 输出 dist-offline/index.html
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  define: {
    'import.meta.env.VITE_OFFLINE': JSON.stringify('true'),
  },
  build: {
    outDir: 'dist-offline',
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
