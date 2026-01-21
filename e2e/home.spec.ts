import { test, expect } from '@playwright/test';

test('ホーム画面で検索フォームが表示される', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Minecraft Mod Searcher' })).toBeVisible();
  await expect(page.getByPlaceholder('Mod名やキーワードで検索')).toBeVisible();
});

test('検索フォームから検索ページへ遷移できる', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Mod名やキーワードで検索').fill('sodium');
  await page.getByRole('button', { name: '検索する' }).click();
  await expect(page).toHaveURL(/\/search\?query=sodium/);
});
