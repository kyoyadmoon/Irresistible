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
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-[12vh] left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
        {current && (
          <div
            key={current.id}
            className="animate-toast-pop bg-gray-800/90 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-quicksand font-semibold text-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] max-w-[85vw] text-center leading-relaxed"
          >
            {current.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
