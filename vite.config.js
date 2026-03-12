import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';

// Plugin to copy TypeScript declarations
const copyDts = () => ({
  name: 'copy-dts',
  closeBundle() {
    try {
      mkdirSync(resolve(__dirname, 'dist'), { recursive: true });
      
      // Copy TypeScript declarations
      copyFileSync(
        resolve(__dirname, 'src/index.d.ts'),
        resolve(__dirname, 'dist/index.d.ts')
      );
      console.log('Copied TypeScript declarations to dist/');
    } catch (e) {
      console.error('Failed to copy TypeScript declarations:', e);
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
  plugins: [copyDts()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
