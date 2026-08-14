import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

// Deliberately not the app's vite.config.ts: the harness never renders, so the
// React and Tailwind plugins would only be startup cost. The alias has to match
// though, since the harness imports the app's modules by their real paths.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(here, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/harness/**/*.test.ts"],
  },
});
