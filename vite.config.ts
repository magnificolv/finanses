import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const buildId = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 12);

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      '__APP_VERSION__': JSON.stringify(pkg.version),
      '__BUILD_ID__': JSON.stringify(buildId),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
