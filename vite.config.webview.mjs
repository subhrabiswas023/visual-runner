import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import fs from 'fs';

const webviewPages = fs.readdirSync(path.join(__dirname, 'webviews', 'pages'));

export default defineConfig({
  build: {
    target: 'es2023',
    rollupOptions: {
      input: webviewPages.reduce((acc, page) => {
        const name = page.split('.')[0];
        acc[name] = path.resolve(__dirname, 'webviews', 'pages', page);
        return acc;
      }, {}),
      output: {
        dir: 'dist/compiled',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, 'common'),
      '@stores': path.resolve(__dirname, 'webviews', 'stores'),
      'vscode': path.resolve(__dirname, 'webviews', 'vscode.ts')
    }
  },
  plugins: [svelte()]
});