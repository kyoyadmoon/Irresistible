import { useRef, useState, useEffect } from 'react'
import { useGameState } from './hooks/useGameState'
import { ToastProvider } from './hooks/useToast'
import { ConfigProvider, useConfig } from './config/ConfigContext'
import { stageRegistry } from './stages'
import FloatingHearts from './components/FloatingHearts'
import CelebrationOverlay from './components/CelebrationOverlay'
import { YesButton, NoButton } from './components/Buttons'
import SetupPage from './components/SetupPage'

function Game() {
  const config = useConfig()
  const { currentStage, celebrating, advanceStage, triggerCelebration } = useGameState()
  const cardRef = useRef(null)

  const isInitial = currentStage === 0
  const stageDef = !isInitial ? config.stages[currentStage - 1] : null
  const StageComponent = stageDef ? stageRegistry[stageDef.type] : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink to-lavender font-quicksand overflow-hidden relative">
      <FloatingHearts />

      <div
        ref={cardRef}
        className="relative z-10 bg-white rounded-3xl p-[clamp(24px,5vw,48px)] max-w-[620px] w-[92vw] shadow-[0_20px_60px_rgba(0,0,0,0.1)] text-center"
      >
        <h1 className="font-fredoka text-[clamp(1.3rem,4vw,1.8rem)] text-gray-800 mb-2 leading-snug">
          {isInitial ? config.title : stageDef?.title ?? ''}
        </h1>
        <p className="text-[clamp(0.9rem,2.5vw,1.1rem)] text-gray-400 mb-6 font-semibold">
          {isInitial ? config.subtitle : stageDef?.hint ?? ''}
        </p>

        {isInitial ? (
          <div className="flex gap-4 justify-center items-center flex-wrap">
            <YesButton onClick={triggerCelebration}>{config.yesLabel}</YesButton>
            <NoButton onClick={advanceStage}>{config.noLabel}</NoButton>
          </div>
        ) : StageComponent ? (
          <StageComponent
            config={stageDef}
            cardRef={cardRef}
            advanceStage={advanceStage}
            triggerCelebration={triggerCelebration}
          />
        ) : null}
      </div>

      <CelebrationOverlay active={celebrating} />

      <p className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs font-quicksand whitespace-nowrap select-none">
        made with ♥ by kyoyadmoon — with absolutely zero ulterior motives
      </p>

      <button
        onClick={() => { window.location.hash = 'setup' }}
        className="fixed bottom-4 right-4 w-8 h-8 rounded-full bg-white/30 hover:bg-white/60 transition-all
          text-white/60 hover:text-white/90 text-sm flex items-center justify-center cursor-pointer"
        title="Setup"
        aria-label="Open setup"
      >
        ⚙
      </button>
    </div>
  )
}

function useHashRoute() {
  const [page, setPage] = useState(() =>
    window.location.hash === '#setup' ? 'setup' : 'game'
  )

  useEffect(() => {
    const onHashChange = () => {
      setPage(window.location.hash === '#setup' ? 'setup' : 'game')
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return page
}

export default function App() {
  const page = useHashRoute()

  if (page === 'setup') {
    return <SetupPage />
  }

  return (
    <ConfigProvider>
      <ToastProvider>
        <Game />
      </ToastProvider>
    </ConfigProvider>
  )
}
