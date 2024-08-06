import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5175
  },
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: ''
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, "src"),
      }
    ]
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]__[hash:base64:5]',
      scopeBehaviour: 'local'
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    },
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ]
    }
  },
  plugins: [
    react(),
  ],
})
