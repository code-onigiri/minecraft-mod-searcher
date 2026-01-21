'use client';

import { authService } from '@/features/auth/services/authService';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function UserMenu() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const initials = (user.email ?? user.provider).slice(0, 1).toUpperCase();

  const handleSignOut = async () => {
    await authService.signOut();
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="ユーザーアバター" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-base-300 text-sm">
              {initials}
            </div>
          )}
        </div>
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
      >
        <li className="menu-title">
          <span>{user.email ?? 'ユーザー'}</span>
        </li>
        <li>
          <button onClick={handleSignOut}>ログアウト</button>
        </li>
      </ul>
    </div>
  );
}
