import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const FSHOST = 'http://127.0.0.1:1055/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  optimizeDeps: {
    include: [
      `monaco-editor/esm/vs/language/typescript/ts.worker`,
      `monaco-editor/esm/vs/editor/editor.worker`
    ],
  },
  server: {
    proxy: {
      '/readFile': FSHOST,
      '/writeFile': FSHOST,
      '/writeMultiFiles': FSHOST,
      '/listFile': FSHOST,
      '/makeDir': FSHOST,
      '/moveFile': FSHOST,
      '/deleteFile': FSHOST,
    }
  },
})
