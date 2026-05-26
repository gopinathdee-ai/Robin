'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Toast } from './Toast'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  variant: 'success' | 'error' | 'warning' | 'info'
}

interface ToastContextType {
  toast: (message: Omit<ToastMessage, 'id'>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const toast = useCallback(
    (message: Omit<ToastMessage, 'id'>) => {
      const id = Date.now().toString()
      const newToast: ToastMessage = { ...message, id }

      setToasts((prev) => [...prev, newToast])

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 4000)
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            {...t}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
