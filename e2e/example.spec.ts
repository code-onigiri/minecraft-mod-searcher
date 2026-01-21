import { test, expect } from '@playwright/test';

test('homepage shows title', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173');
  await expect(page.locator('text=Minecraft Mod Searcher')).toHaveCount(1);
});
