'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { AuthModal } from '@/features/auth/components/AuthModal';
import { FilterSidebar } from '@/features/search/components/FilterSidebar';
import { SearchBar } from '@/features/search/components/SearchBar';
import { SearchResults } from '@/features/search/components/SearchResults';
import { useSearch } from '@/features/search/hooks/useSearch';
import { useToast } from '@/components/ui/ToastProvider';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') ?? '';
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { addToast } = useToast();

  const {
    query,
    setQuery,
    minecraftVersion,
    setMinecraftVersion,
    loader,
    setLoader,
    sources,
    setSources,
    result,
    isLoading,
    error,
    runSearch,
  } = useSearch();

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      void runSearch();
    }
  }, [initialQuery, runSearch, setQuery]);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }
    void runSearch();
  }, [query, minecraftVersion, loader, sources, runSearch]);

  useEffect(() => {
    if (error) {
      addToast(error, 'error');
    }
  }, [addToast, error]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <div className="mb-8">
        <SearchBar query={query} onQueryChange={setQuery} onSearch={runSearch} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <FilterSidebar
          minecraftVersion={minecraftVersion}
          onMinecraftVersionChange={setMinecraftVersion}
          loader={loader}
          onLoaderChange={setLoader}
          sources={sources}
          onSourcesChange={setSources}
        />
        <section>
          <SearchResults
            mods={result.mods}
            isLoading={isLoading}
            onRequireAuth={() => setIsAuthModalOpen(true)}
          />
        </section>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </main>
  );
}
