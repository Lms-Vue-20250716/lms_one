import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // '/api':
    // 프록시가 적용될 경로입니다. React 애플리케이션에서 /api로 시작하는 모든 요청이 프록시를 통해 전달됩니다.
    // target:
    // 프록시 요청을 전달할 백엔드 서버의 주소입니다. 예제에서는 http://localhost:80으로 설정했습니다.
    // changeOrigin:
    // true로 설정하면, 요청 헤더의 Host 값을 백엔드 서버의 주소로 변경합니다.
    // rewrite:
    // 요청 경로를 수정합니다. 예를 들어, /api/some-endpoint 요청이 백엔드로 전달될 때 /some-endpoint로 변경됩니다.
    proxy: {
      '/api': {
        target: 'http://localhost:80', // 백엔드 서버 주소
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // '/api'를 제거하고 백엔드로 전달
      },
    },
  },
});
