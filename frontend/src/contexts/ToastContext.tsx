import { createContext, useState, useCallback, type ReactNode } from 'react';
import type { ToastContextType, ToastProps } from '../types';

export const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

interface Toast {
  id: number;
  message: string;
  type: ToastProps['type'];
  duration: number;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((
    message: string,
    type: ToastProps['type'] = 'info',
    duration: number = 3000
  ): number => {
    const id = Date.now();
    const toast: Toast = { id, message, type, duration };

    setToasts(prev => [...prev, toast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // shadcn/ui 스타일의 toast API 지원
  const toast = useCallback((props: {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
    duration?: number;
  }) => {
    const message = props.title || props.description || '';
    const type = props.variant === 'destructive' ? 'error' : 'success';
    const duration = props.duration || 3000;
    return showToast(message, type, duration);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toast }}>
      {children}
      {/* TODO: ToastContainer 컴포넌트 추가 */}
    </ToastContext.Provider>
  );
}
