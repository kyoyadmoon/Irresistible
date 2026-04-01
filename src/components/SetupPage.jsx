import { useState, useCallback } from 'react'
import {
  loadFormValues,
  saveConfigToLocalStorage,
  getDefaultFormValues,
} from '../config/parseParams'

const FIELDS = [
  { key: 'title', label: 'Title', placeholder: 'Your question...', type: 'text', maxLength: 60 },
  { key: 'subtitle', label: 'Subtitle', placeholder: 'Hint text...', type: 'text', maxLength: 80 },
  { key: 'yesLabel', label: 'YES Button Text', placeholder: 'YES', type: 'text', maxLength: 20 },
  { key: 'noLabel', label: 'NO Button Text', placeholder: 'NO', type: 'text', maxLength: 20 },
  { key: 'celebrationTitle', label: 'Celebration Title', placeholder: 'Title after success...', type: 'text', maxLength: 60 },
  { key: 'celebrationSubtitle', label: 'Celebration Subtitle', placeholder: 'Subtitle after success...', type: 'text', maxLength: 80 },
  { key: 'floatingEmojis', label: 'Floating Emojis', placeholder: '💕,💗,🎮,⭐ (comma separated)', type: 'text' },
]

function getInitialValues() {
  const saved = loadFormValues()
  const defaults = getDefaultFormValues()
  return saved ? { ...defaults, ...saved } : defaults
}

export default function SetupPage() {
  const [values, setValues] = useState(getInitialValues)
  const [saved, setSaved] = useState(false)

  const onChange = useCallback((key, val) => {
    setValues(prev => ({ ...prev, [key]: val }))
    setSaved(false)
  }, [])

  const handleSaveAndPlay = () => {
    saveConfigToLocalStorage(values)
    window.location.hash = ''
  }

  const handleSave = () => {
    saveConfigToLocalStorage(values)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setValues(getDefaultFormValues())
    setSaved(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink to-lavender font-quicksand p-4">
      <div className="bg-white rounded-3xl p-[clamp(24px,5vw,40px)] max-w-[600px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
        <h1 className="font-fredoka text-[clamp(1.4rem,4vw,1.8rem)] text-gray-800 mb-1 text-center">
          Irresistible
        </h1>
        <p className="text-gray-400 text-sm text-center mb-4 font-semibold">
          Customize your proposal game
        </p>

        {/* Guidance banner */}
        <div className="mb-6 px-4 py-3 rounded-xl bg-pink/10 border border-pink/20 text-sm text-gray-600 text-center leading-relaxed">
          Settings are saved to <strong>this browser only</strong>.<br />
          Once you're done, hand the device to the recipient and let them start the game.
        </div>

        <div className="space-y-4">
          {FIELDS.map(({ key, label, placeholder, type, maxLength }) => (
            <div key={key}>
              <label className="block text-sm font-bold text-gray-600 mb-1">
                {label}
              </label>
              <input
                type={type}
                value={values[key]}
                onChange={e => onChange(key, e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full px-4 py-2.5 rounded-xl border border-pink/30 bg-pink/5 text-gray-700 text-sm
                  outline-none transition-all focus:border-pink focus:ring-2 focus:ring-pink/20"
              />
            </div>
          ))}
        </div>

        {/* Emoji preview */}
        {values.floatingEmojis && (
          <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
            {values.floatingEmojis.split(',').filter(Boolean).map((emoji, i) => (
              <span key={i} className="text-xl">{emoji}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <button
            onClick={handleSaveAndPlay}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all
              bg-gradient-to-r from-pink to-coral hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            Save &amp; Start Game
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all
              bg-gradient-to-r from-mint to-mint-dark hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            {saved ? 'Saved! ✓' : 'Save'}
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 transition-all
              bg-gray-100 hover:bg-gray-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
