'use client';

import { useState } from 'react';

import { authService } from '@/features/auth/services/authService';

export function AuthButtons() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    await authService.signInWithGitHub();
    setIsLoading(false);
  };

  const handleEmailSignIn = async () => {
    setIsLoading(true);
    await authService.signInWithEmail(email, password);
    setIsLoading(false);
  };

  const handleEmailSignUp = async () => {
    setIsLoading(true);
    await authService.signUp(email, password);
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <button
        className="btn btn-neutral w-full"
        onClick={handleGitHubSignIn}
        disabled={isLoading}
      >
        GitHubでログイン
      </button>
      <div className="divider">または</div>
      <div className="space-y-3">
        <label className="form-control w-full">
          <span className="label-text">メールアドレス</span>
          <input
            className="input input-bordered w-full"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="form-control w-full">
          <span className="label-text">パスワード</span>
          <input
            className="input input-bordered w-full"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
        </label>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          className="btn btn-primary flex-1"
          onClick={handleEmailSignIn}
          disabled={isLoading}
        >
          メールでログイン
        </button>
        <button
          className="btn btn-ghost flex-1"
          onClick={handleEmailSignUp}
          disabled={isLoading}
        >
          新規登録
        </button>
      </div>
    </div>
  );
}
