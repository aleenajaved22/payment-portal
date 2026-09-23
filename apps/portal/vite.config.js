import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled', '@mui/material'],
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
});
