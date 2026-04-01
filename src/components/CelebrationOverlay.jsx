import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { useConfig } from '../config/ConfigContext'

export default function CelebrationOverlay({ active }) {
  const config = useConfig()
  useEffect(() => {
    if (!active) return

    // Initial burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff85a2', '#ffd700', '#7ecfa0', '#c9a0dc', '#ff6b6b'],
    })

    // Side fireworks
    const end = Date.now() + 4000
    const interval = setInterval(() => {
      if (Date.now() > end) { clearInterval(interval); return }
      confetti({
        particleCount: 40, angle: 60, spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff85a2', '#ffd700', '#7ecfa0'],
      })
      confetti({
        particleCount: 40, angle: 120, spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#c9a0dc', '#ff6b6b', '#ffd700'],
      })
    }, 300)

    return () => clearInterval(interval)
  }, [active])

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center text-center p-5 bg-gradient-to-br from-gold to-orange-400">
      <div className="animate-bounce-in">
        <h1 className="font-fredoka text-white text-[clamp(2rem,8vw,4rem)] drop-shadow-lg mb-4">
          {config.celebration.title}
        </h1>
        <p className="font-quicksand text-white/90 text-[clamp(1rem,4vw,1.5rem)] font-bold">
          {config.celebration.subtitle}
        </p>
      </div>
    </div>
  )
}
