'use client';

import { AuthButtons } from '@/features/auth/components/AuthButtons';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">ログインが必要です</h3>
        <p className="mt-2 text-sm text-base-content/70">
          ブックマークやModリストを利用するにはログインしてください。
        </p>
        <div className="mt-6">
          <AuthButtons />
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </dialog>
  );
}
