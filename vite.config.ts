import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "production-security-policy",
      apply: "build",
      transformIndexHtml() {
        return [
          {
            tag: "meta",
            attrs: {
              "http-equiv": "Content-Security-Policy",
              content:
                "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'",
            },
            injectTo: "head-prepend",
          },
          {
            tag: "meta",
            attrs: {
              name: "referrer",
              content: "strict-origin-when-cross-origin",
            },
            injectTo: "head",
          },
        ];
      },
    },
  ],
  test: { include: ["tests/**/*.test.{ts,js}"] },
});
