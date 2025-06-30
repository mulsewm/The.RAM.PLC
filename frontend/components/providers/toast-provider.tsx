'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster 
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: '!font-sans',
          title: '!font-medium',
          description: '!text-sm',
        },
        duration: 5000,
      }}
    />
  );
}
