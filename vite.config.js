import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/readingapp/',
  build: {
    target: 'safari14',
  },
  server: {
    host: true,
  },
});
