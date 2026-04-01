import { useState, useEffect, useRef } from 'react'
import { GrownYesButton } from '../components/Buttons'
import { useToast } from '../hooks/useToast'

export default function MathGate({ config, advanceStage, triggerCelebration }) {
  const showToast = useToast()
  const [input, setInput] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [placeholder, setPlaceholder] = useState(config.ui.placeholder)
  const [startTimeMs] = useState(() => Date.now())
  const startTime = useRef(startTimeMs)

  const [{ a, b, c, answer }] = useState(() => {
    const a = 10 + Math.floor(Math.random() * 90)
    const b = 10 + Math.floor(Math.random() * 90)
    const c = 10 + Math.floor(Math.random() * 90)
    return { a, b, c, answer: a + b + c }
  })

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const handleSubmit = () => {
    const val = parseInt(input)
    if (val === answer) {
      advanceStage()
    } else {
      setInput('')
      setPlaceholder(config.ui.wrongAnswer)
      showToast(config.toasts.giveUp)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <GrownYesButton onClick={triggerCelebration} />

      <div className="mt-2">
        <p className="font-fredoka text-[clamp(1rem,3vw,1.2rem)] text-gray-600 mb-2">
          {config.ui.mathPrompt} {a} + {b} + {c} = ?
        </p>
        <div className="flex gap-2 justify-center">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={placeholder}
            className="font-quicksand text-base px-4 py-2.5 border-2 border-gray-200 rounded-xl w-40 text-center outline-none focus:border-pink transition-colors"
          />
          <button
            onClick={handleSubmit}
            className="font-fredoka px-5 py-2.5 border-none rounded-xl bg-coral text-white cursor-pointer text-sm"
          >
            {config.ui.submitButton}
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {config.ui.timerLabel} {elapsed}s
        </p>
      </div>
    </div>
  )
}
