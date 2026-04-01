import { useState } from 'react'
import { YesButton, NoButton } from '../components/Buttons'

const STEPS = 4

export default function ShrinkGrow({ config, advanceStage, triggerCelebration }) {
  const [step, setStep] = useState(0)

  function handleNo() {
    const next = step + 1
    if (next >= STEPS) {
      advanceStage()
      return
    }
    setStep(next)
  }

  // YES grows: scale from 1 → 1.8, padding/font increase
  const yesScale = 1 + step * (0.8 / (STEPS - 1))
  // NO shrinks: scale from 1 → 0.35
  const noScale = 1 - step * (0.65 / (STEPS - 1))
  const noOpacity = 1 - step * (0.4 / (STEPS - 1))

  const noLabels = config.noLabels

  return (
    <div className="flex gap-4 justify-center items-center flex-wrap">
      <YesButton
        onClick={triggerCelebration}
        className="animate-pulse-btn"
        style={{
          transform: `scale(${yesScale})`,
          transition: 'transform 0.4s ease, box-shadow 0.4s ease',
        }}
      />
      <NoButton
        onClick={handleNo}
        style={{
          transform: `scale(${noScale})`,
          opacity: noOpacity,
          transition: 'transform 0.4s ease, opacity 0.4s ease',
        }}
      >
        {noLabels[step] ?? noLabels[noLabels.length - 1]}
      </NoButton>
    </div>
  )
}
