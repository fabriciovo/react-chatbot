import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html', 
        loadbot: 'src/loadbot.ts',
      },
      output: {
        entryFileNames: (chunk) => {
          return `${chunk.name}.js`;
        },
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
