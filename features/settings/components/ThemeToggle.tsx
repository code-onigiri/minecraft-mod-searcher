'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
  }, []);

  const handleToggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <label className="flex items-center gap-3">
      <span className="text-sm">ダークモード</span>
      <input
        type="checkbox"
        className="toggle"
        checked={theme === 'dark'}
        onChange={handleToggle}
      />
    </label>
  );
}
