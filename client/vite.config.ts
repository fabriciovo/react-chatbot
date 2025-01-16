import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/loadbot.ts",
      name: "LoadChatbot",
      fileName: "loadbot",
    },
    rollupOptions: {
      output: {
        entryFileNames: 'chatbot.js',
        assetFileNames: 'assets/[name].[ext]',
      },  
    },
  },
})
