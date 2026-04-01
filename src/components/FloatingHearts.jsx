import { useState } from 'react'
import { useConfig } from '../config/ConfigContext'

const DEFAULT_EMOJIS = ['💕', '💗', '💖', '💘', '💝', '🩷', '🤍', '🩵']

function generateHearts(count, emojis) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    left: Math.random() * 100,
    size: 16 + Math.random() * 20,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 10,
  }))
}

export default function FloatingHearts({ count = 18 }) {
  const config = useConfig()
  const emojis = config.floatingEmojis || DEFAULT_EMOJIS

  const [hearts] = useState(() => generateHearts(count, emojis))

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-[-50px] animate-float-up"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  )
}
