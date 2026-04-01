// ===== State =====
let currentLevel = 0;
const totalLevels = 7;
let transitioning = false; // guard against rapid clicks
let noBlocked = false;     // levels can block normal NO behavior

// DOM refs (stable elements only)
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const buttons = document.getElementById('buttons');
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const levelExtra = document.getElementById('levelExtra');
const card = document.getElementById('card');
const celebrationOverlay = document.getElementById('celebrationOverlay');
const toastContainer = document.getElementById('toastContainer');
const heartsBg = document.getElementById('heartsBg');

// AbortController for per-level event listeners
let levelAC = null;

// ===== Floating Hearts =====
function createFloatingHearts() {
  const hearts = ['💕', '💗', '💖', '💘', '💝', '🩷', '🤍', '🩵'];
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (16 + Math.random() * 40) + 'px';
    heart.style.animationDuration = (6 + Math.random() * 8) + 's';
    heart.style.animationDelay = (Math.random() * 10) + 's';
    heartsBg.appendChild(heart);
  }
}
createFloatingHearts();

// ===== Toast System =====
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ===== YES Handler =====
btnYes.addEventListener('click', triggerCelebration);

function triggerCelebration() {
  clearAllTimers();
  if (levelAC) levelAC.abort();

  celebrationOverlay.classList.add('active');

  // Initial big burst
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#ff85a2', '#ffd700', '#7ecfa0', '#c9a0dc', '#ff6b6b'],
  });

  // Continuous fireworks from sides
  const end = Date.now() + 4000;
  const interval = setInterval(() => {
    if (Date.now() > end) { clearInterval(interval); return; }
    confetti({
      particleCount: 40, angle: 60, spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#ff85a2', '#ffd700', '#7ecfa0'],
    });
    confetti({
      particleCount: 40, angle: 120, spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#c9a0dc', '#ff6b6b', '#ffd700'],
    });
  }, 300);
}

// ===== NO Handler (persistent — always on btnNo) =====
function onNoClick() {
  if (transitioning || noBlocked) return;
  transitioning = true;
  currentLevel++;
  if (currentLevel > totalLevels) {
    triggerCelebration();
    return;
  }
  activateLevel(currentLevel);
  // Small delay to prevent double-click skipping
  setTimeout(() => { transitioning = false; }, 300);
}
btnNo.addEventListener('click', onNoClick);

// ===== Level Hints =====
const levelHints = {
  1: { title: "Round 1: The Shy Button 🐁", hint: "That NO button seems a little... skittish. Good luck catching it." },
  2: { title: "Round 2: Honey, I Shrunk the NO 🔬", hint: "Hmm, something about these buttons feels off." },
  3: { title: "Round 3: Catch Me If You Can 🧈", hint: "It's a bit slippery today~ think you can keep up?" },
  4: { title: "Round 4: Spot the Real One 🎭", hint: "One of these is real. The rest are just pretending." },
  5: { title: "Round 5: Prove You Mean It 🧠", hint: "If you really want to say NO, earn it." },
  6: { title: "Round 6: Now or Never ⚡", hint: "Blink and you'll miss your chance... literally." },
  7: { title: "Round 7: The Final Boss 👾", hint: "At this point, I think the universe is trying to tell you something." },
};

// ===== Level Activation =====
function activateLevel(level) {
  resetLevelState();
  const { title: t, hint } = levelHints[level];
  title.textContent = t;
  subtitle.textContent = hint;

  switch (level) {
    case 1: level1_runaway(); break;
    case 2: level2_shrinkGrow(); break;
    case 3: level3_slippery(); break;
    case 4: level4_decoys(); break;
    case 5: level5_mathGate(); break;
    case 6: level6_speedRound(); break;
    case 7: level7_finalBoss(); break;
  }
}

function resetLevelState() {
  // Abort previous level's listeners
  if (levelAC) levelAC.abort();
  levelAC = new AbortController();
  noBlocked = false;

  // Reset button styles/classes
  btnYes.className = 'btn btn-yes';
  btnYes.style.cssText = '';
  btnNo.className = 'btn btn-no';
  btnNo.textContent = 'NO';
  btnNo.style.cssText = '';

  // Clear extra area
  levelExtra.innerHTML = '';

  // Remove decoy buttons
  document.querySelectorAll('.btn-decoy').forEach(el => el.remove());

  // Reset buttons container
  buttons.style.position = '';
  buttons.style.minHeight = '';

  // Show buttons
  btnYes.style.display = '';
  btnNo.style.display = '';
  buttons.style.display = '';

  clearAllTimers();
}

// Timer management
let activeTimers = [];
function registerTimer(id) { activeTimers.push(id); }
function clearAllTimers() {
  activeTimers.forEach(id => { clearTimeout(id); clearInterval(id); });
  activeTimers = [];
}

// ===== Level 1: The Runaway Button =====
function level1_runaway() {
  let dodgeCount = 0;
  const maxDodges = 3 + Math.floor(Math.random() * 4); // 3-6

  function dodge(e) {
    if (dodgeCount >= maxDodges) return;
    dodgeCount++;

    const cardRect = card.getBoundingClientRect();
    const maxX = cardRect.width - 120;
    const maxY = cardRect.height - 50;
    btnNo.style.position = 'absolute';
    btnNo.style.left = Math.random() * maxX + 'px';
    btnNo.style.top = Math.random() * maxY + 'px';
    btnNo.style.transition = 'none';
    btnNo.style.zIndex = '5';
  }

  buttons.style.position = 'relative';
  buttons.style.minHeight = '120px';

  btnNo.addEventListener('mouseenter', dodge, { signal: levelAC.signal });
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodge(e);
  }, { passive: false, signal: levelAC.signal });
}

// ===== Level 2: Shrink & Grow =====
function level2_shrinkGrow() {
  btnYes.classList.add('grown');
  btnNo.classList.add('shrunk');
  btnNo.textContent = 'no...';
}

// ===== Level 3: The Slippery Button =====
function level3_slippery() {
  const RADIUS = 120;

  buttons.style.position = 'relative';
  buttons.style.minHeight = '120px';
  btnNo.style.position = 'absolute';
  btnNo.style.transition = 'left 0.3s ease, top 0.3s ease';
  btnNo.style.left = '50%';
  btnNo.style.top = '50%';

  let slideCount = 0;
  const maxSlides = 4 + Math.floor(Math.random() * 4); // 4-7

  function slideAway(e) {
    if (slideCount >= maxSlides) return;

    const noRect = btnNo.getBoundingClientRect();
    const noCenterX = noRect.left + noRect.width / 2;
    const noCenterY = noRect.top + noRect.height / 2;

    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const dx = noCenterX - clientX;
    const dy = noCenterY - clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < RADIUS) {
      slideCount++;
      const cardRect = card.getBoundingClientRect();
      const angle = Math.atan2(dy, dx);
      const pushX = Math.cos(angle) * 150;
      const pushY = Math.sin(angle) * 150;

      let newLeft = btnNo.offsetLeft + pushX;
      let newTop = btnNo.offsetTop + pushY;

      newLeft = Math.max(0, Math.min(newLeft, cardRect.width - noRect.width));
      newTop = Math.max(0, Math.min(newTop, 120 - noRect.height));

      btnNo.style.left = newLeft + 'px';
      btnNo.style.top = newTop + 'px';
    }
  }

  document.addEventListener('mousemove', slideAway, { signal: levelAC.signal });
  document.addEventListener('touchmove', slideAway, { passive: true, signal: levelAC.signal });
}

// ===== Level 4: Decoy Buttons =====
function level4_decoys() {

  // Hide the real NO among decoys
  const decoyTexts = ['NO', 'Nope', 'No way', 'Nah', 'Never', 'NO!', 'Nuh-uh', 'Decline', 'Pass', 'Nein'];
  const count = window.innerWidth < 480 ? 6 : 10;

  // Pick a random slot for the real NO
  const realIndex = Math.floor(Math.random() * (count + 1));

  // Temporarily hide real NO, we'll insert it at the right position
  btnNo.style.display = 'none';

  for (let i = 0; i <= count; i++) {
    if (i === realIndex) {
      // Insert the real NO button here
      const placeholder = document.createElement('span');
      placeholder.id = 'realNoSlot';
      placeholder.style.display = 'contents';
      buttons.appendChild(placeholder);
      // Move real NO into flow — style it like a decoy
      btnNo.style.display = '';
      btnNo.className = 'btn btn-no btn-decoy';
      btnNo.textContent = decoyTexts[Math.floor(Math.random() * decoyTexts.length)];
      buttons.appendChild(btnNo);
    } else {
      const decoy = document.createElement('button');
      decoy.className = 'btn-decoy';
      decoy.textContent = decoyTexts[i % decoyTexts.length];
      decoy.addEventListener('click', () => {
        // Fade out with a poof
        decoy.style.transition = 'all 0.3s ease';
        decoy.style.transform = 'scale(0)';
        decoy.style.opacity = '0';
        setTimeout(() => decoy.remove(), 300);
        showToast("Poof~ that was a fake 💨");
      });
      buttons.appendChild(decoy);
    }
  }

  btnYes.classList.add('grown');
}

// ===== Level 5: The Math Gate =====
function level5_mathGate() {
  noBlocked = true;
  btnNo.style.display = 'none';

  const a = 100 + Math.floor(Math.random() * 900);
  const b = 100 + Math.floor(Math.random() * 900);
  const answer = a * b;
  let attempts = 0;
  const startTime = Date.now();

  levelExtra.innerHTML = `
    <div class="math-gate">
      <p>Want to say NO? Fine — solve this first: ${a} &times; ${b} = ?</p>
      <div>
        <input type="number" id="mathInput" placeholder="Answer..." />
        <button id="mathSubmit">Submit</button>
      </div>
      <p class="math-timer" id="mathTimer">Time you've spent not buying me a Switch 2: 0s</p>
    </div>
  `;

  const timerId = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const timerEl = document.getElementById('mathTimer');
    if (timerEl) timerEl.textContent = `Time you've spent not buying me a Switch 2: ${elapsed}s`;
  }, 1000);
  registerTimer(timerId);

  document.getElementById('mathSubmit').addEventListener('click', () => {
    const input = document.getElementById('mathInput');
    const val = parseInt(input.value);
    attempts++;

    if (val === answer) {
      btnNo.style.display = '';
      levelExtra.innerHTML = '';
      clearInterval(timerId);
      // Advance to next level
      currentLevel++;
      if (currentLevel > totalLevels) { triggerCelebration(); return; }
      activateLevel(currentLevel);
    } else {
      input.value = '';
      input.placeholder = 'Wrong!';
      if (attempts >= 3) {
        showToast("You know YES is right there, right? 😏");
      }
    }
  });

  levelExtra.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('mathSubmit')?.click();
  });

  btnYes.classList.add('grown');
}

// ===== Level 6: Speed Round =====
function level6_speedRound() {
  let timeLeft = 1.5;

  levelExtra.innerHTML = `<div class="countdown-bar" id="countdown">${timeLeft.toFixed(1)}s</div>`;
  btnNo.classList.add('jitter');

  const countdownInterval = setInterval(() => {
    timeLeft -= 0.1;
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) countdownEl.textContent = timeLeft.toFixed(1) + 's';

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      showToast("Too slow~ I'll take that as a yes ⏰");
      setTimeout(triggerCelebration, 1000);
    }
  }, 100);
  registerTimer(countdownInterval);
}

// ===== Level 7: The Final Boss =====
function level7_finalBoss() {
  noBlocked = true; // prevent normal NO advancement

  btnYes.classList.add('enormous');
  btnNo.classList.add('invisible-btn');

  function moveInvisibleNo() {
    const cardRect = card.getBoundingClientRect();
    btnNo.style.left = Math.random() * (cardRect.width - 20) + 'px';
    btnNo.style.top = Math.random() * (cardRect.height - 20) + 'px';
  }
  moveInvisibleNo();

  const moveInterval = setInterval(moveInvisibleNo, 500);
  registerTimer(moveInterval);

  // Clicking NO in final boss triggers YES after 2s
  btnNo.addEventListener('click', () => {
    showToast("Nice try~ but we both know how this ends 🌟");
    setTimeout(triggerCelebration, 2000);
  }, { signal: levelAC.signal });

  // Add sparkle particles
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'floating-heart';
    sparkle.textContent = ['✨', '⭐', '💫', '🌟'][i % 4];
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.fontSize = (20 + Math.random() * 16) + 'px';
    sparkle.style.animationDuration = (4 + Math.random() * 4) + 's';
    sparkle.style.animationDelay = (Math.random() * 2) + 's';
    heartsBg.appendChild(sparkle);
  }

  buttons.style.position = 'relative';
  buttons.style.minHeight = '120px';
}
