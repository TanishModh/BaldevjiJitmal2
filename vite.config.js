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
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
          query: ['@tanstack/react-query'],
          icons: ['lucide-react'],
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
