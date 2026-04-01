import { useState, useRef, useCallback, useEffect } from 'react'
import { GrownYesButton } from '../components/Buttons'
import { useToast } from '../hooks/useToast'

const RADIUS = 54
const STROKE = 6
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const SIZE = (RADIUS + STROKE) * 2
const TICK_MS = 50
const EMPTY_MILESTONES = []

export default function HoldToConfirm({ config, advanceStage, triggerCelebration }) {
  const showToast = useToast()
  const [progress, setProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const holdingRef = useRef(false)
  const intervalRef = useRef(null)
  const shownMilestones = useRef(new Set())
  const doneRef = useRef(false)

  const { holdDuration = 10 } = config.tuning || {}
  const milestones = config.toasts?.milestones ?? EMPTY_MILESTONES

  // Speed curve: (1 - p)^1.5, starts ~1x, ends ~0.15x
  const getSpeed = (p) => Math.max(0.15, Math.pow(1 - p, 1.5))

  const clearTick = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startHold = useCallback((e) => {
    e.preventDefault()
    if (doneRef.current) return
    holdingRef.current = true
    setIsHolding(true)

    clearTick()
    intervalRef.current = setInterval(() => {
      if (!holdingRef.current) return

      setProgress((prev) => {
        const speed = getSpeed(prev)
        const dt = TICK_MS / 1000
        const next = Math.min(prev + (dt / holdDuration) * speed, 1)

        // Fire milestone toasts
        for (const m of milestones) {
          if (next >= m.at && !shownMilestones.current.has(m.at)) {
            shownMilestones.current.add(m.at)
            showToast(m.text)
          }
        }

        // Completed!
        if (next >= 1 && !doneRef.current) {
          doneRef.current = true
          holdingRef.current = false
          clearTick()
          setTimeout(advanceStage, 0)
          return 1
        }

        return next
      })
    }, TICK_MS)
  }, [clearTick, holdDuration, milestones, showToast, advanceStage])

  const stopHold = useCallback(() => {
    if (doneRef.current) return
    holdingRef.current = false
    setIsHolding(false)
    clearTick()
  }, [clearTick])

  useEffect(() => clearTick, [clearTick])

  const pct = Math.round(progress * 100)
  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const strokeColor = progress < 0.4 ? '#ff6b6b' : progress < 0.75 ? '#ffd700' : '#7ecfa0'

  return (
    <div className="flex flex-col items-center gap-5">
      <GrownYesButton onClick={triggerCelebration} />

      {/* Circular progress + hold button */}
      <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          className="absolute top-0 left-0 -rotate-90"
        >
          <circle
            cx={RADIUS + STROKE}
            cy={RADIUS + STROKE}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={STROKE}
          />
          <circle
            cx={RADIUS + STROKE}
            cy={RADIUS + STROKE}
            r={RADIUS}
            fill="none"
            stroke={strokeColor}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: `stroke-dashoffset ${TICK_MS}ms linear, stroke 0.3s ease` }}
          />
        </svg>

        <button
          onMouseDown={startHold}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={startHold}
          onTouchEnd={stopHold}
          className={`relative z-10 font-fredoka border-none rounded-full cursor-pointer select-none transition-all duration-200 bg-coral text-white shadow-[0_4px_15px_rgba(255,107,107,0.4)] flex flex-col items-center justify-center ${isHolding ? 'scale-90 brightness-90' : 'hover:bg-coral-dark'}`}
          style={{ width: RADIUS * 2 - 8, height: RADIUS * 2 - 8 }}
        >
          <span className="text-[clamp(0.8rem,2.5vw,1rem)] leading-tight">
            {isHolding ? config.ui.holdingButton : config.ui.holdButton}
          </span>
          <span className="text-xs opacity-75 mt-0.5">{pct}%</span>
        </button>
      </div>

      <p className="font-fredoka text-sm text-gray-400">
        {isHolding ? config.ui.holdingInstruction : config.ui.holdInstruction}
      </p>
    </div>
  )
}
