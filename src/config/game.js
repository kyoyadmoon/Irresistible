/**
 * Game configuration — single source of truth for all text, stage order, and tuning.
 * Non-developers can edit this file to create a different game.
 *
 * To reorder stages: move entries in the `stages` array.
 * To remove a stage: delete its entry.
 * To add a stage: add an entry here + create a component + register in stages/index.js
 */

export const gameConfig = {
  // Game-level text
  title: 'So... will you get me a Switch 2 for Pokopia? 🎮',
  subtitle: 'Choose carefully, okay?',
  yesLabel: 'YES',
  noLabel: 'NO',

  // Floating background emojis
  floatingEmojis: ['💕', '💗', '💖', '💘', '💝', '🩷', '🤍', '🩵', '🎮', '⭐', '🌟', '✨', '🎯', '🏆', '👾'],

  // Celebration screen
  celebration: {
    title: 'I knew you\'d say yes 🎉',
    subtitle: 'Switch 2 + Pokopia = the happiest me 🎮❤️',
  },

  // Stages — order here = order in game
  stages: [
    {
      type: 'runaway',
      title: 'Really? Think again',
      hint: 'That NO button seems a little... skittish. Good luck catching it.',
      tuning: { minDodges: 5, maxDodges: 10 },
    },
    {
      type: 'shrinkGrow',
      title: 'Are you sure about that?',
      hint: 'Hmm, something about these buttons feels off... do you notice it too?',
      noLabels: ['NO', 'no...', 'n-no...', '...'],
    },
    {
      type: 'speedRound',
      title: 'Last chance — be quick ⚡',
      hint: 'Blink and you\'ll miss it... maybe just hit YES?',
      toasts: { timeout: 'Too slow~ I\'ll take that as a yes ⏰' },
      tuning: { duration: 1.5 },
    },
    {
      type: 'decoys',
      title: 'I\'ll be good, I promise 🎭',
      hint: 'Only one of these is real. The rest are just pretending.',
      toasts: { vanish: 'Poof~ that was a fake 💨' },
      tuning: { countDesktop: 10, countMobile: 6 },
      decoyLabels: ['NO', 'Nope', 'No way', 'Nah', 'Never', 'NO!', 'Nuh-uh', 'Decline', 'Pass', 'Nein'],
    },
    {
      type: 'holdToConfirm',
      title: 'Fine — but you have to mean it',
      hint: 'Hold the button to confirm. Should be easy... right?',
      toasts: {
        milestones: [
          { at: 0.10, text: 'Oh, you\'re actually doing this?' },
          { at: 0.35, text: 'You\'re quite patient, huh~' },
          { at: 0.50, text: 'Is it getting slower? Must be your imagination...' },
          { at: 0.70, text: 'Most people have given up by now, just saying' },
          { at: 0.80, text: 'Your finger must be tired. YES is right there~' },
          { at: 0.90, text: 'Okay I\'m genuinely impressed' },
          { at: 0.95, text: 'Wait... you might actually make it?!' },
        ],
      },
      ui: {
        holdButton: 'Hold NO',
        holdingButton: 'Holding...',
        holdInstruction: 'Press and hold to refuse',
        holdingInstruction: "Don't let go~",
      },
      tuning: { holdDuration: 5 },
    },
    {
      type: 'mathGate',
      title: 'Want to say no? Earn it 🧠',
      hint: 'Math is such a hassle... YES is right there, you know~',
      toasts: { giveUp: 'You know YES is right there, right? 😏' },
      ui: {
        mathPrompt: 'Want to say NO? Solve this first:',
        placeholder: 'Answer...',
        wrongAnswer: 'Wrong!',
        submitButton: 'Submit',
        timerLabel: "Time you've spent not buying me a Switch 2:",
      },
      tuning: { wrongAttemptsBeforeHint: 3 },
    },
    {
      type: 'finalBoss',
      title: 'At this point, do you really think the ending will change? 👾',
      hint: 'Even the buttons are on my side now. Just give in~',
      toasts: { caught: 'Nice try~ but we both know how this ends 🌟' },
      tuning: { moveInterval: 500, celebrationDelay: 2000 },
    },
  ],
}
