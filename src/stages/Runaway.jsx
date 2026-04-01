import { useRef, useState, useCallback } from 'react'
import { YesButton, NoButton } from '../components/Buttons'

export default function Runaway({ config, cardRef, advanceStage, triggerCelebration }) {
  const dodgeCount = useRef(0)
  const [maxDodges] = useState(() =>
    config.tuning.minDodges + Math.floor(Math.random() * (config.tuning.maxDodges - config.tuning.minDodges + 1))
  )
  const noRef = useRef(null)
  const justDodged = useRef(false)

  const dodge = useCallback(() => {
    if (dodgeCount.current >= maxDodges || !cardRef.current || !noRef.current) return
    dodgeCount.current++
    justDodged.current = true
    setTimeout(() => { justDodged.current = false }, 400)

    const boundsRect =
      noRef.current.offsetParent?.getBoundingClientRect() ??
      noRef.current.parentElement?.getBoundingClientRect() ??
      cardRef.current.getBoundingClientRect()
    const buttonRect = noRef.current.getBoundingClientRect()
    const maxX = Math.max(0, boundsRect.width - buttonRect.width)
    const maxY = Math.max(0, boundsRect.height - buttonRect.height)

    noRef.current.style.position = 'absolute'
    noRef.current.style.left = `${Math.random() * maxX}px`
    noRef.current.style.top = `${Math.random() * maxY}px`
    noRef.current.style.transition = 'none'
    noRef.current.style.zIndex = '5'
  }, [cardRef, maxDodges])

  const handleYes = useCallback(() => {
    if (justDodged.current) return
    triggerCelebration()
  }, [triggerCelebration])

  const handleNo = useCallback(() => {
    if (justDodged.current) return
    advanceStage()
  }, [advanceStage])

  const handleTouchStart = useCallback((e) => {
    // After maxDodges, let the tap go through as a normal click
    if (dodgeCount.current >= maxDodges) return
    e.preventDefault()
    dodge()
  }, [dodge, maxDodges])

  return (
    <div className="flex gap-4 justify-center items-center flex-wrap relative min-h-[120px]">
      <YesButton onClick={handleYes} />
      <NoButton
        ref={noRef}
        onClick={handleNo}
        onMouseEnter={dodge}
        onTouchStart={handleTouchStart}
      />
    </div>
  )
}
