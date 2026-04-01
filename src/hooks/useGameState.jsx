import { useState, useCallback, useRef } from 'react'
import { useConfig } from '../config/ConfigContext'

export function useGameState() {
  const config = useConfig()
  const [currentStage, setCurrentStage] = useState(0)
  const [celebrating, setCelebrating] = useState(false)
  const transitioning = useRef(false)

  const advanceStage = useCallback(() => {
    if (transitioning.current || celebrating) return
    transitioning.current = true
    setCurrentStage((prev) => {
      const next = prev + 1
      if (next > config.stages.length) {
        setCelebrating(true)
      }
      return next
    })
    setTimeout(() => { transitioning.current = false }, 300)
  }, [celebrating, config.stages.length])

  const triggerCelebration = useCallback(() => {
    setCelebrating(true)
  }, [])

  return { currentStage, celebrating, advanceStage, triggerCelebration }
}
