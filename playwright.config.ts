import { defineConfig, devices } from "@playwright/test";
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
  },
  webServer: {
    command: `npm run ${process.env.TEST_PRODUCTION ? "preview" : "dev"} -- --port ${port} --strictPort`,
    url,
    reuseExistingServer: !process.env.CI,
  },
});
