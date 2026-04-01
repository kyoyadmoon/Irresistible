import { useState, useEffect, useRef } from 'react'
import { YesButton, NoButton } from '../components/Buttons'
import { useToast } from '../hooks/useToast'

export default function SpeedRound({ config, advanceStage, triggerCelebration }) {
  const showToast = useToast()
  const duration = config.tuning.duration
  const [timeLeft, setTimeLeft] = useState(duration)
  const done = useRef(false)

  const pct = (timeLeft / duration) * 100

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        const next = +(prev - 0.1).toFixed(1)
        if (next <= 0 && !done.current) {
          done.current = true
          clearInterval(id)
          showToast(config.toasts.timeout)
          setTimeout(triggerCelebration, 1000)
        }
        return Math.max(next, 0)
      })
    }, 100)
    return () => clearInterval(id)
  }, [showToast, triggerCelebration, config.toasts.timeout])

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Time bar */}
      <div className="w-full max-w-xs h-4 rounded-full bg-white/30 overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-100 ease-linear"
          style={{
            width: `${pct}%`,
            backgroundColor: pct > 50 ? '#7ecfa0' : pct > 25 ? '#ffd700' : '#ff6b6b',
          }}
        />
      </div>
      <div className="font-fredoka text-2xl text-coral">
        {timeLeft.toFixed(1)}s
      </div>
      <div className="flex gap-4 justify-center items-center flex-wrap">
        <YesButton onClick={triggerCelebration} />
        <NoButton onClick={advanceStage} className="animate-jitter" />
      </div>
    </div>
  )
}
