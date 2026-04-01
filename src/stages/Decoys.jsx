import { useState } from 'react'
import { GrownYesButton, NoButton } from '../components/Buttons'
import { useToast } from '../hooks/useToast'

export default function Decoys({ config, advanceStage, triggerCelebration }) {
  const showToast = useToast()
  const isMobile = window.innerWidth < 480
  const count = isMobile ? config.tuning.countMobile : config.tuning.countDesktop
  const labels = config.decoyLabels

  // Build a shuffled list: count decoys + 1 real, real at random index
  const [layout] = useState(() => {
    const realIndex = Math.floor(Math.random() * (count + 1))
    const items = []
    let decoyIdx = 0
    for (let i = 0; i <= count; i++) {
      if (i === realIndex) {
        items.push({ id: 'real', label: labels[Math.floor(Math.random() * labels.length)], isReal: true })
      } else {
        items.push({ id: `decoy-${decoyIdx}`, label: labels[decoyIdx % labels.length], isReal: false })
        decoyIdx++
      }
    }
    return items
  })

  const [alive, setAlive] = useState(() => new Set(layout.map((l) => l.id)))

  const killDecoy = (id) => {
    showToast(config.toasts.vanish)
    setAlive((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  return (
    <div className="flex gap-3 justify-center items-center flex-wrap">
      <GrownYesButton onClick={triggerCelebration} />
      {layout.map((item) => {
        if (!alive.has(item.id)) {
          return (
            <button
              key={item.id}
              className="animate-poof font-fredoka border-none rounded-full bg-coral text-white shadow-[0_4px_12px_rgba(255,107,107,0.3)] px-6 py-2.5 text-[clamp(0.85rem,2.5vw,1rem)] min-h-[44px] pointer-events-none"
            >
              {item.label}
            </button>
          )
        }

        if (item.isReal) {
          return (
            <NoButton key={item.id} onClick={advanceStage}>
              {item.label}
            </NoButton>
          )
        }

        return (
          <button
            key={item.id}
            onClick={() => killDecoy(item.id)}
            className="font-fredoka border-none rounded-full cursor-pointer bg-coral text-white shadow-[0_4px_12px_rgba(255,107,107,0.3)] hover:bg-coral-dark hover:scale-105 px-6 py-2.5 text-[clamp(0.85rem,2.5vw,1rem)] min-h-[44px] transition-all duration-200"
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
