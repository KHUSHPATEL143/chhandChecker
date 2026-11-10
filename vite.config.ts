import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.OPEN_ROUTER || env.OPENROUTER_API_KEY || env.VITE_OPENROUTER_API_KEY || '';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || path.resolve(), '.'),
      },
    },
    define: {
      'process.env.OPEN_ROUTER': JSON.stringify(apiKey),
      'process.env.OPENROUTER_API_KEY': JSON.stringify(apiKey),
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});