import { createContext, useContext, useMemo } from 'react'
import { gameConfig } from './game'
import { loadConfigFromLocalStorage } from './parseParams'

const ConfigContext = createContext(gameConfig)

export function ConfigProvider({ children }) {
  const config = useMemo(() => {
    const overrides = loadConfigFromLocalStorage()
    return {
      ...gameConfig,
      ...overrides,
      celebration: {
        ...gameConfig.celebration,
        ...overrides.celebration,
      },
      // Keep stages from default (not URL-configurable)
      stages: gameConfig.stages,
    }
  }, [])

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  return useContext(ConfigContext)
}
