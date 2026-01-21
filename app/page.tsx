import Link from 'next/link';

import { UserMenu } from '@/features/auth/components/UserMenu';
import { HomeSearch } from '@/features/search/components/HomeSearch';

type TrendingMod = {
  title: string;
  description: string;
  slug: string;
};

const fetchTrendingMods = async (): Promise<TrendingMod[]> => {
  const response = await fetch(
    'https://api.modrinth.com/v2/search?query=&limit=6&index=downloads',
    { next: { revalidate: 3600 } },
  );
  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as { hits: TrendingMod[] };
  return data.hits ?? [];
};

export default async function HomePage() {
  const trendingMods = await fetchTrendingMods();

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minecraft Mod Searcher</h1>
          <p className="text-base-content/70">分散したMod探しの旅を終わらせる</p>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-3 text-sm">
            <Link className="link" href="/search">
              検索
            </Link>
            <Link className="link" href="/library">
              マイライブラリ
            </Link>
            <Link className="link" href="/settings">
              設定
            </Link>
          </nav>
          <UserMenu />
        </div>
      </header>
      <section className="rounded-box border border-base-200 bg-base-100 p-8 text-center">
        <h2 className="text-xl font-semibold">今すぐ検索</h2>
        <p className="mt-2 text-sm text-base-content/70">Modrinth / CurseForge / GitHubを横断検索</p>
        <div className="mt-6 flex justify-center">
          <HomeSearch />
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">トレンドMod</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trendingMods.map((mod) => (
            <div key={mod.slug} className="rounded-box border border-base-200 bg-base-100 p-4">
              <h3 className="text-base font-semibold">{mod.title}</h3>
              <p className="mt-2 text-sm text-base-content/70">{mod.description}</p>
              <Link className="link mt-3 inline-block text-sm" href={`/search?query=${mod.slug}`}>
                検索で見る
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
