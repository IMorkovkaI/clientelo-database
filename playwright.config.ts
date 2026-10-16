import { defineConfig, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
// Windows sandbox profiles can deny Chromium's file renames in the default
// TEMP folder, canceling downloads and stalling browser shutdown. Keep both
// browser profiles and downloads in the writable workspace; assertions stay strict.
if (process.platform === "win32") {
  const browserTemp = resolve("work/playwright-temp");
  mkdirSync(browserTemp, { recursive: true });
  process.env.TEMP = browserTemp;
  process.env.TMP = browserTemp;
}
const port = Number(process.env.TEST_PORT || 4173);
const url = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: url,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    launchOptions: { downloadsPath: resolve("work/playwright-downloads") },
  },
  // A separately managed preview avoids Windows sandbox process-tree shutdown
  // restrictions. CI keeps Playwright's normal managed production server.
  webServer: process.env.TEST_EXTERNAL_SERVER
    ? undefined
    : {
        command: `npm run ${process.env.TEST_PRODUCTION ? "preview" : "dev"} -- --port ${port} --strictPort`,
        url,
        reuseExistingServer: !process.env.CI && !process.env.TEST_PRODUCTION,
      },
});
