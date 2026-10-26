import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O CORS do backend aceita http://localhost:5173 por padrão (CORS_ORIGIN).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
