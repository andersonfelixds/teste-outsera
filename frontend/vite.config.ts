import { defineConfig } from 'vite';
import angular from '@vitejs/plugin-ng-app';

export default defineConfig({
  plugins: [angular()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
        ws: true,
      },
    },
    middlewareMode: false,
  },
});
