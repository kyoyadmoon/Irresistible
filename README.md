# Irresistible

An interactive mini-game that makes it (almost) impossible to say NO. Inspired by [SahilGogna/v-day](https://github.com/SahilGogna/v-day), originally built to propose buying a Switch 2 — but designed to be fully customizable for any yes/no question you want answered.

The recipient faces 7 escalating stages — each one makes clicking "NO" harder than the last. Eventually, they'll have no choice but to say YES!

## Stages

1. **Runaway** — The NO button dodges away from the cursor
2. **Shrink & Grow** — Buttons shift sizes to confuse your selection
3. **Hold to Confirm** — Must hold the NO button for 10 seconds while being mocked
4. **Decoys** — Multiple fake NO buttons appear alongside the real one
5. **Math Gate** — Solve a math problem before you can decline
6. **Speed Round** — 1.5-second timer or it auto-accepts as YES
7. **Final Boss** — Buttons move autonomously — you can't escape

## Getting Started

```bash
npm install
npm run dev
```

## How to Use

### 1. Open the Setup Page

Visit `http://localhost:5173/#setup` to customize the game. Settings are saved to the browser's localStorage — no URL parameters involved.

| Field | Description |
|-------|-------------|
| Title | The main question |
| Subtitle | Hint text below the title |
| YES Button Label | Label for the YES button |
| NO Button Label | Label for the NO button |
| Celebration Title | Title shown after saying YES |
| Celebration Subtitle | Subtitle for the celebration screen |
| Floating Emojis | Comma-separated emojis in the background (e.g. `💕,💗,🎮,⭐`) |

### 2. Save & Start

Click **Save & Start Game** — settings are stored locally and the game launches immediately. You can also click **Save** to store without navigating, or **Reset** to restore defaults.

### 3. Hand Over the Device

Settings only live in this browser. Set up the game, then hand the device to your target. When they open the page, they'll see your custom question.

### 4. Watch Them Try to Say No

If they click YES — confetti and celebration! If they click NO, they enter 7 stages of increasingly impossible challenges until they inevitably give in.

## Forking & Customizing

Want to make it your own? Here's how:

### Fork the repo

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/proposal-website.git
cd proposal-website
npm install
npm run dev
```

### Change the defaults

Edit `src/config/game.js` — this is the single source of truth for all text, emojis, and stage behavior:

```js
export const gameConfig = {
  title: "Your question here?",
  subtitle: "Some persuasive hint...",
  yesLabel: "YES!",
  noLabel: "No",
  floatingEmojis: ['💕', '💗', '✨'],
  celebration: {
    title: "They said yes!",
    subtitle: "🎉",
  },
  stages: [ /* ... */ ],
}
```

### Tune individual stages

Each stage in `game.js` has a `tuning` object. For example:

```js
{ type: 'runaway', tuning: { dodgeRadius: 120, maxDodges: 8 } }
{ type: 'holdToConfirm', tuning: { holdDuration: 10000 } }
{ type: 'speedRound', tuning: { timeLimit: 1500 } }
```

### Add or remove stages

The `stages` array in `game.js` controls the order and selection of stages. Remove entries to shorten the game, reorder them to change difficulty progression.

## Project Structure

The active app now lives at the repository root.

The original vanilla HTML prototype is preserved under `prototype/` for reference. It is not used by the Vite build or deployment workflow.

### Deploy

The app is a static Vite build — deploy anywhere:

```bash
npm run build   # outputs to dist/
```

Works with GitHub Pages, Vercel, Netlify, Cloudflare Pages, etc.

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS 4
- canvas-confetti for celebrations

## Credits

Inspired by [SahilGogna/v-day](https://github.com/SahilGogna/v-day).
