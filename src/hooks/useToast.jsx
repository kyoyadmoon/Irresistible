import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [current, setCurrent] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((message) => {
    const id = ++toastId
    if (timerRef.current) clearTimeout(timerRef.current)
    setCurrent({ id, message })
    timerRef.current = setTimeout(() => {
      setCurrent(null)
    }, 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ current, showToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx.showToast
}

export function ToastViewport({ className = '' }) {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('ToastViewport must be used within ToastProvider')
  if (!ctx.current) return null

  return (
    <div className={className}>
      <div
        key={ctx.current.id}
        className="animate-toast-pop bg-gray-800/90 backdrop-blur-md text-white px-[clamp(1.5rem,5vw,2.5rem)] py-[clamp(0.75rem,2.5vw,1.25rem)] rounded-2xl font-quicksand font-semibold text-[clamp(0.9rem,3vw,1.25rem)] shadow-[0_8px_30px_rgba(0,0,0,0.25)] max-w-[85vw] text-center leading-relaxed"
      >
        {ctx.current.message}
      </div>
    </div>
  )
}
