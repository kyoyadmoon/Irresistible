import { useEffect, useRef, useState, useCallback } from 'react'
import { YesButton } from '../components/Buttons'
import { useToast } from '../hooks/useToast'

export default function FinalBoss({ config, cardRef, triggerCelebration }) {
  const showToast = useToast()
  const noRef = useRef(null)
  const [noPos, setNoPos] = useState({ left: 0, top: 0 })

  const moveNo = useCallback(() => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setNoPos({
      left: Math.random() * (rect.width - 20),
      top: Math.random() * (rect.height - 20),
    })
  }, [cardRef])

  useEffect(() => {
    moveNo()
    const id = setInterval(moveNo, config.tuning.moveInterval)
    return () => clearInterval(id)
  }, [moveNo, config.tuning.moveInterval])

  const handleNoClick = () => {
    showToast(config.toasts.caught)
    setTimeout(triggerCelebration, config.tuning.celebrationDelay)
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 relative min-h-[120px]">
      <YesButton
        onClick={triggerCelebration}
        className="!text-[clamp(2rem,6vw,3rem)] !px-[clamp(2rem,8vw,4rem)] !py-[clamp(1.5rem,4vw,2rem)] !min-w-[min(60vw,100%)] animate-pulse-btn animate-rainbow-glow"
      />
      {/* Invisible NO button */}
      <button
        ref={noRef}
        onClick={handleNoClick}
        className="absolute w-5 h-5 p-0 border-none rounded-full cursor-default opacity-0"
        style={{ left: noPos.left, top: noPos.top }}
        aria-label="NO"
      />
    </div>
  )
}
