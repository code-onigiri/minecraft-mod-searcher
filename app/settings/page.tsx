'use client';

import { VaultPanel } from '@/features/settings/components/VaultPanel';
import { ThemeToggle } from '@/features/settings/components/ThemeToggle';

export default function SettingsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-8 px-6 py-10">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">設定</h2>
        <div className="rounded-box border border-base-200 bg-base-100 p-6">
          <h3 className="text-lg font-semibold">外観</h3>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </div>
      </section>
      <section>
        <VaultPanel />
      </section>
    </main>
  );
}
