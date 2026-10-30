import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Every .html file in the root is its own page.
const pages = Object.fromEntries(
  readdirSync(__dirname).filter((f) => f.endsWith('.html')).map((f) => [f.replace('.html', ''), resolve(__dirname, f)]),
);

export default defineConfig({
  // relative URLs, so the built site works from any folder (and in previews)
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: { input: pages },
    chunkSizeWarningLimit: 1200,
  },
  server: { port: 4340 },
});
