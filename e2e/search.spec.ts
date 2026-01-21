import { test, expect } from '@playwright/test';

test('検索結果が表示される', async ({ page }) => {
  await page.route('https://api.modrinth.com/v2/search**', async (route) => {
    await route.fulfill({
      json: {
        hits: [
          {
            project_id: 'modrinth-id',
            slug: 'sodium',
            title: 'Sodium',
            description: '高速化Mod',
            icon_url: null,
            versions: ['1.20.1'],
            categories: ['fabric'],
            downloads: 100,
            date_modified: '2026-01-20T00:00:00Z',
            project_url: 'https://modrinth.com/mod/sodium',
          },
        ],
        total_hits: 1,
      },
    });
  });

  await page.goto('/search');
  await page.getByPlaceholder('Mod名やキーワードを入力').fill('sodium');
  await page.getByRole('button', { name: '検索' }).click();

  await expect(page.getByRole('heading', { name: 'Sodium' })).toBeVisible();
});
