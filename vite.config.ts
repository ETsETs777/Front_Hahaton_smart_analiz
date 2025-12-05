import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@/components': resolve(__dirname, './src/components'),
            '@/pages': resolve(__dirname, './src/pages'),
            '@/lib': resolve(__dirname, './src/lib'),
            '@/contexts': resolve(__dirname, './src/contexts'),
            '@/graphql': resolve(__dirname, './src/graphql'),
            '@/routes': resolve(__dirname, './src/routes')
        }
    },
    build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              antd: ['antd'],
              graphql: ['@apollo/client', 'graphql']
            }
          }
        }
      }
})
