import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function inlineCriticalCss() {
  return {
    name: 'inline-critical-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html, { bundle }) {
      if (!bundle) return html;
      let newHtml = html;
      for (const [fileName, file] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && file.type === 'asset') {
          const css = file.source;
          const linkRegex = new RegExp(`<link[^>]*href=["'](?:/)?${fileName}["'][^>]*>`, 'i');
          if (linkRegex.test(newHtml)) {
            newHtml = newHtml.replace(linkRegex, `<style>${css}</style>`);
            delete bundle[fileName];
          }
        }
      }
      return newHtml;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), inlineCriticalCss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('@tanstack/react-query')) return 'query';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/cdn-media': {
        target: 'https://brlkrualghugxskjzydi.supabase.co/storage/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn-media/, ''),
      },
    },
  },
});
