import { gameConfig } from './game'

const STORAGE_KEY = 'proposal-game-config'

const MAX_LEN = {
  title: 60,
  subtitle: 80,
  yesLabel: 20,
  noLabel: 20,
  celebrationTitle: 60,
  celebrationSubtitle: 80,
}

function sanitize(key, val) {
  if (typeof val !== 'string') return null
  const max = MAX_LEN[key]
  return max ? val.slice(0, max) : val
}

/** Load saved config from localStorage and return a partial config override object. */
export function loadConfigFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const saved = JSON.parse(raw)
    const overrides = {}

    for (const key of ['title', 'subtitle', 'yesLabel', 'noLabel']) {
      if (saved[key] != null) {
        const clean = sanitize(key, saved[key])
        if (clean) overrides[key] = clean
      }
    }

    if (saved.celebrationTitle) {
      const clean = sanitize('celebrationTitle', saved.celebrationTitle)
      if (clean) overrides.celebration = { ...overrides.celebration, title: clean }
    }
    if (saved.celebrationSubtitle) {
      const clean = sanitize('celebrationSubtitle', saved.celebrationSubtitle)
      if (clean) overrides.celebration = { ...overrides.celebration, subtitle: clean }
    }

    if (saved.floatingEmojis) {
      const arr = saved.floatingEmojis.split(',').filter(Boolean)
      if (arr.length) overrides.floatingEmojis = arr
    }

    return overrides
  } catch {
    return {}
  }
}

/** Load raw form values from localStorage for the SetupPage. */
export function loadFormValues() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Save form values to localStorage. */
export function saveConfigToLocalStorage(values) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
}

/** Return default form values from gameConfig. */
export function getDefaultFormValues() {
  return {
    title: gameConfig.title,
    subtitle: gameConfig.subtitle,
    yesLabel: gameConfig.yesLabel,
    noLabel: gameConfig.noLabel,
    celebrationTitle: gameConfig.celebration.title,
    celebrationSubtitle: gameConfig.celebration.subtitle,
    floatingEmojis: gameConfig.floatingEmojis.join(','),
  }
}
