'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (!query.trim()) {
      return;
    }
    router.push(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <input
        className="input input-bordered input-lg w-full"
        placeholder="Mod名やキーワードで検索"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <button className="btn btn-primary btn-wide" onClick={handleSearch}>
        検索する
      </button>
    </div>
  );
}
