'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Toast = {
  id: string;
  message: string;
  tone?: 'info' | 'success' | 'error';
};

type ToastContextValue = {
  addToast: (message: string, tone?: Toast['tone']) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toneClass = (tone: Toast['tone']) => {
  switch (tone) {
    case 'success':
      return 'alert-success';
    case 'error':
      return 'alert-error';
    default:
      return 'alert-info';
  }
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, tone: Toast['tone'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const value = useMemo(() => ({ addToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast toast-top toast-end z-50">
        {toasts.map((toast) => (
          <div key={toast.id} className={`alert ${toneClass(toast.tone)}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('ToastProviderが必要です');
  }
  return ctx;
};
