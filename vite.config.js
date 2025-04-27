// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/visitor-alert': 'http://localhost:5000',
      '/submit-form': 'http://localhost:5000',
    },
  },
});
