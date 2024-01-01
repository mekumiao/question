import { test, expect } from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/home');
  await expect(page.locator('div.n-card-header > div')).toHaveText('轻量级在线答题系统');
})
