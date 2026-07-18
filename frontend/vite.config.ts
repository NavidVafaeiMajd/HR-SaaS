import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias:{
      "@": path.resolve(__dirname,'./src')
    }
  },
  build: {
    minify: 'terser', // 👈 اطمینان از استفاده از Terser به عنوان Minifier
    terserOptions: {
      compress: {
        drop_console: true,   // 👈 حذف console.log از خروجی
        drop_debugger: true,  // 👈 حذف debugger از خروجی
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-checkbox'],
          editor: ['@uiw/react-md-editor'],
          charts: ['apexcharts', 'react-apexcharts'],
          date: ['react-multi-date-picker', 'react-date-object'],
        }
      }
    }
  }
})
