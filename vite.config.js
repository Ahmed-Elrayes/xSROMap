import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, cpSync } from 'fs';

// Plugin to copy TypeScript declarations and assets
const copyAssets = () => ({
  name: 'copy-assets',
  closeBundle() {
    try {
      mkdirSync(resolve(__dirname, 'dist'), { recursive: true });
      
      // Copy TypeScript declarations
      copyFileSync(
        resolve(__dirname, 'src/index.d.ts'),
        resolve(__dirname, 'dist/index.d.ts')
      );
      console.log('Copied TypeScript declarations to dist/');
      
      // Copy assets folder (css, fonts, img)
      cpSync(
        resolve(__dirname, 'assets'),
        resolve(__dirname, 'dist/assets'),
        { recursive: true }
      );
      console.log('Copied assets to dist/');
    } catch (e) {
      console.error('Failed to copy assets:', e);
    }
  }
});

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'xSROMap',
      fileName: 'xsromap',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['leaflet'],
      output: {
        globals: {
          leaflet: 'L'
        },
        exports: 'named'
      }
    },
    sourcemap: true
  },
  plugins: [copyAssets()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
