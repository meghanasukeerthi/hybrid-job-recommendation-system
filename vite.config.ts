import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: {
      '/resume': 'http://localhost:8080',
      '/alljobs': 'http://localhost:8080',
      '/jobs': 'http://localhost:8080'
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});