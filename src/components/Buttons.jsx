/**
 * Reusable YES / NO button primitives.
 * Levels compose these with their own props, refs, and styles.
 */
import { forwardRef } from 'react'
import { useConfig } from '../config/ConfigContext'

const BASE = 'font-fredoka border-none rounded-full cursor-pointer select-none min-h-[44px] transition-all duration-300'

export const YesButton = forwardRef(function YesButton({ onClick, className = '', children, ...props }, ref) {
  const config = useConfig()
  children = children ?? config.yesLabel ?? 'YES'
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`${BASE} bg-mint text-white shadow-[0_4px_15px_rgba(126,207,160,0.4)] hover:bg-mint-dark hover:scale-105 hover:shadow-[0_6px_20px_rgba(126,207,160,0.6)] px-9 py-3.5 text-[clamp(1rem,3vw,1.2rem)] min-w-[120px] ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

export const NoButton = forwardRef(function NoButton({ onClick, className = '', children, ...props }, ref) {
  const config = useConfig()
  children = children ?? config.noLabel ?? 'NO'
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`${BASE} bg-coral text-white shadow-[0_4px_15px_rgba(255,107,107,0.4)] hover:bg-coral-dark px-9 py-3.5 text-[clamp(1rem,3vw,1.2rem)] min-w-[120px] ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

/** Grown YES — used in multiple levels */
export const GrownYesButton = forwardRef(function GrownYesButton({ onClick, className = '', children, ...props }, ref) {
  return (
    <YesButton
      ref={ref}
      onClick={onClick}
      className={`!text-[clamp(1.4rem,4vw,1.7rem)] !px-12 !py-4.5 animate-pulse-btn ${className}`}
      {...props}
    >
      {children}
    </YesButton>
  )
})
