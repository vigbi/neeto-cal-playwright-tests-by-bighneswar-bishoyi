// playwright.config.ts

import { defineConfig, devices } from "@playwright/test";

export const STORAGE_STATE = "./auth/session.json";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
    baseURL: "https://bighneswar-bishoyi-july-2024.neetocal.net",
    testIdAttribute: "data-cy"
  },
  projects: [
    {
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

