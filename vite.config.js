import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const pages = [
  "index.html",
  "es-419/index.html",
  "es-419/grammar/index.html",
  "es-419/lexicon/index.html",
  "es-419/patterns/index.html",
  "es-419/dialogues/index.html",
  "es-419/tests/index.html",
  "es-419/anki/index.html",
  "es-419/sources/index.html"
];

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page.replaceAll("/", "_"), resolve(page)]))
    }
  }
});
