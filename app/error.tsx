'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-xl font-semibold">エラーが発生しました</h2>
      <p className="text-sm text-base-content/70">ページを再読み込みしてください。</p>
      <button className="btn btn-primary" onClick={reset}>
        再試行
      </button>
    </main>
  );
}
