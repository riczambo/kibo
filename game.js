(() => {
  'use strict';

  const STORAGE_KEY = 'kibo_tamagotchi_save_v1';

  const STAGES = [
    { id: 'semino', name: 'Semino', minXp: 0, minHealth: 0, icon: '🌱', bodyRx: 46, bodyRy: 36, scale: 0.96 },
    { id: 'germoglio', name: 'Germoglio', minXp: 80, minHealth: 50, icon: '🌿', bodyRx: 51, bodyRy: 39, scale: 1.05 },
    { id: 'bocciolo', name: 'Bocciolo', minXp: 220, minHealth: 60, icon: '🌷', bodyRx: 55, bodyRy: 42, scale: 1.12 },
    { id: 'fiorito', name: 'Fiorito', minXp: 450, minHealth: 70, icon: '🌻', bodyRx: 59, bodyRy: 45, scale: 1.18 },
    { id: 'guardiano', name: 'Guardiano', minXp: 800, minHealth: 80, icon: '🌳', bodyRx: 62, bodyRy: 47, scale: 1.24 },
  ];

  const FOODS = [
    { id: 'berry', name: 'Bacca Dolce', icon: '🍓', price: 8, hunger: 22, happiness: 8, hydration: 4, xp: 10, desc: '+22 Fame, +8 Felicità' },
    { id: 'apple', name: 'Mela Croccante', icon: '🍎', price: 14, hunger: 36, happiness: 10, hydration: 8, xp: 14, desc: '+36 Fame, +8 Idro' },
    { id: 'melon', name: 'Fetta Fresca', icon: '🍉', price: 12, hunger: 18, hydration: 28, happiness: 10, xp: 12, desc: '+18 Fame, +28 Idro' },
    { id: 'sun_biscuit', name: 'Biscotto Sole', icon: '🍪', price: 18, hunger: 28, happiness: 16, energy: 16, xp: 16, desc: '+28 Fame, +16 Energia' },
    { id: 'dew_cake', name: 'Tortino Rugiada', icon: '🧁', price: 24, hunger: 34, happiness: 26, hydration: 14, xp: 20, desc: '+34 Fame, +26 Felicità' },
    { id: 'sap_tea', name: 'Tisana di Linfa', icon: '🍵', price: 26, health: 42, hydration: 16, energy: 12, xp: 18, desc: 'Cura +42 Salute, +16 Idro' },
  ];

  const HATS = [
    { id: 'cap_green', name: 'Cappellino Verde', icon: '🧢', price: 0, perk: '+10% XP dai mini-giochi', desc: 'Classico berretto (+10% XP mini-giochi).' },
    { id: 'cap_red', name: 'Berretto Fragola', icon: '🍓', price: 45, perk: '-20% consumo Fame', desc: 'Rallenta il calo della Fame del 20%.' },
    { id: 'sun_hat', name: 'Cappello Paglia', icon: '👒', price: 60, perk: 'Protegge dal caldo (-50%)', desc: 'Dimezza la sete durante le Ondate di Caldo.' },
    { id: 'flower_crown', name: 'Corona Fiori', icon: '🌸', price: 85, perk: '+25% Felicità e rigenera Salute', desc: 'Più felicità dalle coccole e cura lenta.' },
    { id: 'wizard_hat', name: 'Cappello Mago', icon: '🧙', price: 120, perk: '+25% Monete bonus', desc: 'Aumenta del 25% le monete guadagnate.' },
  ];

  const DECORS = [
    { id: 'mushroom', name: 'Funghetto Rosso', icon: '🍄', price: 40, pos: { left: '14%', bottom: '42%' }, desc: 'Riduce leggermente il calo di Fame.' },
    { id: 'daisy', name: 'Pratolina', icon: '🌼', price: 36, pos: { left: '78%', bottom: '44%' }, desc: 'Mantiene più alto il buonumore sul prato.' },
    { id: 'lantern', name: 'Lanterna Lucciole', icon: '🏮', price: 70, pos: { left: '82%', bottom: '68%' }, desc: 'Riduce la stanchezza notturna.' },
    { id: 'butterfly', name: 'Farfalla Amica', icon: '🦋', price: 90, pos: { left: '18%', bottom: '70%' }, desc: 'Rallenta l’arrivo dei parassiti!' },
  ];

  const QUEST_TEMPLATES = [
    { id: 'care', type: 'care', title: 'Cura Kibo (nutri o annaffia)', target: 4, xpReward: 34, coinReward: 16 },
    { id: 'pest', type: 'pest', title: 'Scaccia parassiti dal prato', target: 2, xpReward: 42, coinReward: 20 },
    { id: 'minigame', type: 'minigame', title: 'Completa un mini-gioco', target: 1, xpReward: 38, coinReward: 18 },
    { id: 'flourish', type: 'flourish', title: 'Resta in Rigoglio (20s)', target: 8, xpReward: 48, coinReward: 24 },
  ];

  const PHRASES = {
    pet: ['Eheh, mi fa solletico!', 'Che belle coccole ♥', 'Yay! Ti voglio bene!', 'Piuuu~ ♪'],
    petTired: ['Troppo solletico! Dammi un attimo 😅', 'Basta coccole per ora, giochiamo!'],
    water: ['Che bella pioggerella!', 'Fresco fresco! 💧', 'Le mie foglioline ringraziano!'],
    eat: ['Gnam gnam, buonissimo!', 'Che delizia! 😋', 'Mi sento subito più forte!'],
    heal: ['Mmm, che tisana rigenerante! 🍵', 'Mi sento già molto meglio! ✨'],
    clean: ['Tutto pulito e profumato!', 'Che bello il prato ordinato ✨'],
    pestClear: ['Via brutti insetti! Bravo!', 'Grazie per avermi difeso! 🛡️'],
    sleep: ['Buonanotte... Zzz...', 'Sogni d’oro sotto la luna...'],
    wake: ['Buongiorno! Pronto a giocare!', 'Ho dormito benissimo! ☀️'],
    hungry: ['Ho un po’ di languorino... 🍓', 'Mi dai uno spuntino?'],
    thirsty: ['Le mie foglie hanno sete... 💧', 'Un goccio d’acqua per favore!'],
    tired: ['Sbadiglio... ho sonno 😴', 'Spegniamo la luce per la nanna?'],
    sad: ['Mi sento un po’ solo... 💛', 'Giochiamo insieme?'],
    sick: ['Non mi sento bene... serve cura 🤒', 'Ho bisogno di riposo e tisana...'],
    evolve: ['Evviva! Sono cresciuto!! 🎉', 'Guarda la mia nuova forma! ✨'],
    evolveBlocked: ['Ho abbastanza XP, ma serve più Salute per evolvere! ❤️'],
  };

  function createQuest(excludeType = null) {
    const pool = QUEST_TEMPLATES.filter((q) => q.type !== excludeType);
    const tpl = pick(pool.length ? pool : QUEST_TEMPLATES);
    return { ...tpl, progress: 0 };
  }

  function createDefaultState() {
    return {
      name: 'Kibo',
      coins: 35,
      xp: 0,
      hunger: 74,
      hydration: 72,
      happiness: 78,
      energy: 84,
      health: 95,
      isSleeping: false,
      timeMode: 'auto',
      weather: 'clear', // 'clear' | 'heatwave' | 'rain'
      weatherTicksLeft: 0,
      soundOn: true,
      equippedHat: 'cap_green',
      ownedHats: ['cap_green'],
      ownedDecors: [],
      activeDecors: [],
      inventory: {
        berry: 2,
        apple: 1,
      },
      messes: [],
      pests: [], // { id, icon, name, hp, maxHp, left, bottom }
      quest: { ...QUEST_TEMPLATES[0], progress: 0 },
      questsCompleted: 0,
      petCooldownCount: 0,
      petCooldownUntil: 0,
      totalPets: 0,
      daysCared: 1,
      createdAt: Date.now(),
      lastSavedAt: Date.now(),
    };
  }

  let state = loadState();
  let currentModal = null;
  let currentTab = 'food';
  let temporaryExpression = null;
  let expressionTimer = null;
  let speechTimer = null;
  let isBlinking = false;
  let audioCtx = null;

  // ==================== DOM ELEMENTS ====================
  const el = {
    device: document.getElementById('gameDevice'),
    petNameDisplay: document.getElementById('petNameDisplay'),
    stageBadge: document.getElementById('stageBadge'),
    hudMiniAvatar: document.getElementById('hudMiniAvatar'),
    xpBarFill: document.getElementById('xpBarFill'),
    coinsDisplay: document.getElementById('coinsDisplay'),
    timeToggleBtn: document.getElementById('timeToggleBtn'),
    timeToggleIcon: document.getElementById('timeToggleIcon'),
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    soundToggleIcon: document.getElementById('soundToggleIcon'),
    settingsBtn: document.getElementById('settingsBtn'),
    openStatusBtn: document.getElementById('openStatusBtn'),
    statHunger: document.getElementById('statHunger'),
    statHydration: document.getElementById('statHydration'),
    statHappiness: document.getElementById('statHappiness'),
    statEnergy: document.getElementById('statEnergy'),
    questPill: document.getElementById('questPill'),
    questPillText: document.getElementById('questPillText'),
    conditionPill: document.getElementById('conditionPill'),
    conditionPillText: document.getElementById('conditionPillText'),
    kiboButton: document.getElementById('kiboButton'),
    kiboSvg: document.getElementById('kiboSvg'),
    speechBubble: document.getElementById('speechBubble'),
    meadow: document.getElementById('meadow'),
    gardenDecorLayer: document.getElementById('gardenDecorLayer'),
    messLayer: document.getElementById('messLayer'),
    pestsLayer: document.getElementById('pestsLayer'),
    fxLayer: document.getElementById('fxLayer'),
    waterBtn: document.getElementById('waterBtn'),
    cleanBtn: document.getElementById('cleanBtn'),
    sleepBtn: document.getElementById('sleepBtn'),
    sleepBtnIcon: document.getElementById('sleepBtnIcon'),
    sleepBtnLabel: document.getElementById('sleepBtnLabel'),
    minigameBtn: document.getElementById('minigameBtn'),
    shopBtn: document.getElementById('shopBtn'),
    basketBtn: document.getElementById('basketBtn'),
    basketBadge: document.getElementById('basketBadge'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    modalTitle: document.getElementById('modalTitle'),
    modalTabs: document.getElementById('modalTabs'),
    modalBody: document.getElementById('modalBody'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    toastContainer: document.getElementById('toastContainer'),
    minigameOverlay: document.getElementById('minigameOverlay'),
    minigameCanvas: document.getElementById('minigameCanvas'),
    memoryBoard: document.getElementById('memoryBoard'),
    memoryStatus: document.getElementById('memoryStatus'),
    memoryGrid: document.getElementById('memoryGrid'),
    mgLeftStat: document.getElementById('mgLeftStat'),
    mgMidStat: document.getElementById('mgMidStat'),
    mgLivesStat: document.getElementById('mgLivesStat'),
    mgTimer: document.getElementById('mgTimer'),
    mgScore: document.getElementById('mgScore'),
    mgCombo: document.getElementById('mgCombo'),
    mgHint: document.getElementById('mgHint'),
    mgQuitBtn: document.getElementById('mgQuitBtn'),
  };

  // ==================== AUDIO SYNTH ====================
  function playTone(type) {
    if (!state.soundOn) return;
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const playNote = (freq, start, dur, wave = 'sine', vol = 0.08) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(vol, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.02);
      };

      if (type === 'pet') {
        playNote(523.25, now, 0.11, 'sine', 0.08);
        playNote(659.25, now + 0.07, 0.13, 'sine', 0.08);
      } else if (type === 'water') {
        playNote(440, now, 0.09, 'triangle', 0.07);
        playNote(554.37, now + 0.06, 0.09, 'triangle', 0.07);
        playNote(659.25, now + 0.12, 0.12, 'triangle', 0.07);
      } else if (type === 'eat') {
        playNote(392, now, 0.08, 'triangle', 0.09);
        playNote(493.88, now + 0.08, 0.1, 'triangle', 0.09);
        playNote(587.33, now + 0.16, 0.14, 'sine', 0.08);
      } else if (type === 'coin') {
        playNote(880, now, 0.08, 'sine', 0.07);
        playNote(1174.66, now + 0.07, 0.14, 'sine', 0.07);
      } else if (type === 'bonk') {
        playNote(196, now, 0.14, 'sawtooth', 0.05);
      } else if (type === 'evolve') {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
          playNote(f, now + idx * 0.1, 0.22, 'triangle', 0.09);
        });
      } else if (type === 'click') {
        playNote(600, now, 0.05, 'sine', 0.05);
      } else if (type.startsWith('pad_')) {
        const idx = Number(type.split('_')[1]) || 0;
        const freqs = [392.0, 493.88, 587.33, 739.99];
        playNote(freqs[idx % 4], now, 0.18, 'triangle', 0.09);
      }
    } catch {
      // Ignore audio errors if blocked
    }
  }

  // ==================== PERSISTENCE ====================
  function loadState() {
    const fallback = createDefaultState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      const merged = {
        ...fallback,
        ...parsed,
        inventory: { ...(parsed.inventory || {}) },
        ownedHats: Array.isArray(parsed.ownedHats) ? parsed.ownedHats : fallback.ownedHats,
        ownedDecors: Array.isArray(parsed.ownedDecors) ? parsed.ownedDecors : [],
        activeDecors: Array.isArray(parsed.activeDecors) ? parsed.activeDecors : [],
        messes: Array.isArray(parsed.messes) ? parsed.messes : [],
        pests: Array.isArray(parsed.pests) ? parsed.pests : [],
        quest: parsed.quest && parsed.quest.title ? parsed.quest : fallback.quest,
      };
      applyOfflineProgress(merged);
      return merged;
    } catch {
      return fallback;
    }
  }

  function applyOfflineProgress(s) {
    const now = Date.now();
    const elapsedSec = Math.min(8 * 3600, Math.max(0, (now - (s.lastSavedAt || now)) / 1000));
    if (elapsedSec < 15) return;

    const mins = elapsedSec / 60;
    if (s.isSleeping) {
      s.energy = clamp(s.energy + mins * 1.8, 0, 100);
      s.hunger = clamp(s.hunger - mins * 0.28, 8, 100);
      s.hydration = clamp(s.hydration - mins * 0.28, 8, 100);
      if (s.energy >= 100) s.isSleeping = false;
    } else {
      s.hunger = clamp(s.hunger - mins * 0.65, 5, 100);
      s.hydration = clamp(s.hydration - mins * 0.6, 5, 100);
      s.happiness = clamp(s.happiness - mins * 0.45, 10, 100);
      s.energy = clamp(s.energy - mins * 0.4, 8, 100);
      if (s.hunger < 20 || s.hydration < 20) {
        s.health = clamp(s.health - mins * 0.35, 25, 100);
      }
    }
    s.daysCared = Math.max(1, Math.floor((now - (s.createdAt || now)) / (1000 * 3600 * 24)) + 1);
    s.lastSavedAt = now;
  }

  function saveState() {
    state.lastSavedAt = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }

  // ==================== HELPERS & PROGRESSION ====================
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function isSick() {
    return state.health < 45;
  }

  function isFlourishing() {
    return (
      !isSick() &&
      !state.isSleeping &&
      state.hunger >= 75 &&
      state.hydration >= 75 &&
      state.happiness >= 75 &&
      state.energy >= 75 &&
      state.pests.length === 0 &&
      state.messes.length === 0
    );
  }

  function getCurrentStage() {
    let stage = STAGES[0];
    for (const s of STAGES) {
      if (state.xp >= s.minXp && state.health >= s.minHealth) {
        stage = s;
      } else {
        break;
      }
    }
    return stage;
  }

  function getNextStage() {
    const curr = getCurrentStage();
    const idx = STAGES.findIndex((s) => s.id === curr.id);
    return idx >= 0 && idx < STAGES.length - 1 ? STAGES[idx + 1] : null;
  }

  function awardCoins(baseCoins) {
    const bonus = state.equippedHat === 'wizard_hat' ? Math.ceil(baseCoins * 0.25) : 0;
    const total = baseCoins + bonus;
    state.coins += total;
    return total;
  }

  function addXp(baseAmount) {
    const prevStage = getCurrentStage();
    let mult = 1;
    if (isSick()) mult = 0.45;
    else if (isFlourishing()) mult = 1.5;

    const gained = Math.max(1, Math.round(baseAmount * mult));
    state.xp += gained;

    const nextStageCandidate = getNextStage();
    const afterStage = getCurrentStage();
    if (afterStage.id !== prevStage.id) {
      playTone('evolve');
      showToast(`✨ ${state.name} si è evoluto in ${afterStage.name}!`);
      showSpeech(pick(PHRASES.evolve), 3400);
      spawnFxBurst(['✨', '🌟', '🎉', '🌱'], 8);
      triggerAnimation('is-happy', 900);
    } else if (nextStageCandidate && state.xp >= nextStageCandidate.minXp && state.health < nextStageCandidate.minHealth) {
      showSpeech(pick(PHRASES.evolveBlocked), 3000);
    }
    return gained;
  }

  function advanceQuest(type, amount = 1) {
    if (!state.quest || state.quest.type !== type) return;
    state.quest.progress = Math.min(state.quest.target, state.quest.progress + amount);
    if (state.quest.progress >= state.quest.target) {
      const q = state.quest;
      state.questsCompleted += 1;
      const gotCoins = awardCoins(q.coinReward);
      addXp(q.xpReward);
      playTone('evolve');
      showToast(`🎯 Sfida completata! +${q.xpReward} XP e +${gotCoins} 💰`);
      state.quest = createQuest(q.type);
    }
  }

  function showToast(msg) {
    while (el.toastContainer.children.length >= 2) {
      el.toastContainer.firstElementChild.remove();
    }
    const div = document.createElement('div');
    div.className = 'toast';
    div.textContent = msg;
    el.toastContainer.appendChild(div);
    setTimeout(() => div.remove(), 2250);
  }

  function showSpeech(text, duration = 2600) {
    el.speechBubble.textContent = text;
    el.speechBubble.classList.add('is-visible');
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => {
      el.speechBubble.classList.remove('is-visible');
    }, duration);
  }

  function triggerAnimation(cls, duration = 650) {
    el.kiboButton.classList.remove('is-happy', 'is-eating');
    void el.kiboButton.offsetWidth;
    el.kiboButton.classList.add(cls);
    setTimeout(() => el.kiboButton.classList.remove(cls), duration);
  }

  function setTemporaryExpression(expr, duration = 1200) {
    temporaryExpression = expr;
    renderKiboSvg();
    clearTimeout(expressionTimer);
    expressionTimer = setTimeout(() => {
      temporaryExpression = null;
      renderKiboSvg();
    }, duration);
  }

  function spawnFxBurst(emojis, count = 4) {
    const rect = el.meadow.getBoundingClientRect();
    const cx = rect.width * 0.5;
    const cy = rect.height * 0.34;
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.className = 'fx-particle';
      span.textContent = pick(emojis);
      span.style.left = `${cx + (Math.random() * 110 - 55)}px`;
      span.style.top = `${cy + (Math.random() * 40 - 20)}px`;
      span.style.animationDelay = `${i * 0.07}s`;
      el.fxLayer.appendChild(span);
      setTimeout(() => span.remove(), 1200);
    }
  }

  function spawnRainBurst() {
    const rect = el.meadow.getBoundingClientRect();
    const cx = rect.width * 0.5;
    for (let i = 0; i < 12; i++) {
      const drop = document.createElement('div');
      drop.className = 'raindrop-fx';
      drop.style.left = `${cx + (Math.random() * 100 - 50)}px`;
      drop.style.top = `${10 + Math.random() * 25}px`;
      drop.style.animationDelay = `${i * 0.04}s`;
      el.fxLayer.appendChild(drop);
      setTimeout(() => drop.remove(), 900);
    }
  }

  // ==================== TIME OF DAY ====================
  function resolveTimeTheme() {
    if (state.timeMode !== 'auto') return state.timeMode;
    const h = new Date().getHours();
    if (h >= 7 && h < 17) return 'day';
    if (h >= 17 && h < 20) return 'sunset';
    return 'night';
  }

  function renderTimeTheme() {
    const theme = resolveTimeTheme();
    el.device.dataset.time = theme;
    el.device.dataset.weather = state.weather || 'clear';
    const icons = { auto: '🕒', night: '🌙', day: '☀️', sunset: '🌅' };
    el.timeToggleIcon.textContent = state.timeMode === 'auto'
      ? (theme === 'night' ? '🌙' : theme === 'day' ? '☀️' : '🌅')
      : icons[state.timeMode];
    el.timeToggleBtn.title = `Cielo attuale: ${state.timeMode === 'auto' ? 'automatico' : state.timeMode}`;
  }

  // ==================== RENDER KIBO SVG ====================
  function getKiboExpression() {
    if (state.isSleeping) return 'sleeping';
    if (temporaryExpression) return temporaryExpression;
    if (isSick()) return 'sick';
    if (state.hunger < 25 || state.hydration < 25 || state.happiness < 25) return 'sad';
    if (isFlourishing() || (state.happiness > 85 && state.hunger > 70 && state.hydration > 70)) return 'happy';
    return 'normal';
  }

  function renderHatSvg(hatId, stageIndex) {
    const yOff = stageIndex === 0 ? 4 : stageIndex >= 2 ? -3 : 0;
    if (hatId === 'cap_green') {
      return `
        <g transform="translate(0, ${yOff})">
          <path d="M72,115 C74,89 146,89 148,115 Z" fill="#5e7c44" />
          <path d="M97,94 C104,91 116,91 123,94 L126,114 L94,114 Z" fill="#7fa15f" />
          <path d="M70,113 Q110,103 150,113 L152,121 Q110,112 68,121 Z" fill="#3a5128" />
        </g>
      `;
    }
    if (hatId === 'cap_red') {
      return `
        <g transform="translate(0, ${yOff})">
          <path d="M72,115 C74,89 146,89 148,115 Z" fill="#df4c3a" />
          <path d="M97,94 C104,91 116,91 123,94 L126,114 L94,114 Z" fill="#ff7c68" />
          <path d="M70,113 Q110,103 150,113 L152,121 Q110,112 68,121 Z" fill="#a82d1f" />
        </g>
      `;
    }
    if (hatId === 'sun_hat') {
      return `
        <g transform="translate(0, ${yOff})">
          <ellipse cx="110" cy="116" rx="58" ry="11" fill="#f3d078" />
          <path d="M78,114 C80,92 140,92 142,114 Z" fill="#f7da8c" />
          <path d="M78,109 Q110,114 142,109" stroke="#e46336" stroke-width="4" fill="none" />
        </g>
      `;
    }
    if (hatId === 'flower_crown') {
      return `
        <g transform="translate(0, ${yOff + 4})">
          <path d="M72,114 Q110,104 148,114" stroke="#6aa83d" stroke-width="5" fill="none" stroke-linecap="round" />
          <circle cx="80" cy="111" r="6" fill="#ff9ebb" /><circle cx="80" cy="111" r="2.2" fill="#ffe169" />
          <circle cx="100" cy="107" r="6.5" fill="#ffffff" /><circle cx="100" cy="107" r="2.5" fill="#ffe169" />
          <circle cx="121" cy="107" r="6.5" fill="#ffd166" /><circle cx="121" cy="107" r="2.3" fill="#ff7a59" />
          <circle cx="140" cy="111" r="6" fill="#ff9ebb" /><circle cx="140" cy="111" r="2.2" fill="#ffe169" />
        </g>
      `;
    }
    if (hatId === 'wizard_hat') {
      return `
        <g transform="translate(0, ${yOff})">
          <ellipse cx="110" cy="115" rx="54" ry="10" fill="#4f428c" />
          <path d="M80,114 L106,68 L138,114 Z" fill="#6354a8" />
          <path d="M84,109 Q110,113 136,109" stroke="#ffd166" stroke-width="4" fill="none" />
          <text x="104" y="99" font-size="11" fill="#ffe066">★</text>
        </g>
      `;
    }
    return '';
  }

  function renderStemAndLeavesSvg(stageIndex) {
    if (stageIndex === 0) {
      return `
        <g class="kibo-stem-group">
          <path d="M110,96 Q109,75 117,64" stroke="#68b729" stroke-width="5.5" stroke-linecap="round" fill="none" />
          <path d="M117,64 C116,44 140,42 142,56 C140,68 122,70 117,64 Z" fill="#7ec936" />
          <path d="M117,64 Q129,56 138,54" stroke="#62a724" stroke-width="1.8" fill="none" stroke-linecap="round" />
        </g>
      `;
    }

    const flowerBud = stageIndex === 2
      ? `<g transform="translate(110, 42)">
           <circle cx="0" cy="-6" r="10" fill="#ff8fab" />
           <path d="M-8,-2 Q0,8 8,-2 Q0,4 -8,-2 Z" fill="#68b729" />
         </g>`
      : '';

    const fullFlower = stageIndex === 3
      ? `<g transform="translate(111, 36)">
           <circle cx="0" cy="-13" r="8" fill="#ffe066" />
           <circle cx="12" cy="-5" r="8" fill="#ffe066" />
           <circle cx="8" cy="9" r="8" fill="#ffe066" />
           <circle cx="-8" cy="9" r="8" fill="#ffe066" />
           <circle cx="-12" cy="-5" r="8" fill="#ffe066" />
           <circle cx="0" cy="-1" r="8.5" fill="#ff8c42" />
         </g>`
      : '';

    const guardianCrown = stageIndex >= 4
      ? `<g transform="translate(112, 34)">
           <circle cx="-18" cy="4" r="16" fill="#5fb832" />
           <circle cx="18" cy="4" r="16" fill="#6cc73c" />
           <circle cx="0" cy="-8" r="20" fill="#7cd849" />
           <circle cx="-8" cy="-10" r="5" fill="#ffe066" />
           <circle cx="12" cy="-2" r="4.5" fill="#ff8fab" />
           <circle cx="2" cy="8" r="4.5" fill="#ffe066" />
         </g>`
      : '';

    return `
      <g class="kibo-stem-group">
        <path d="M110,98 Q109,62 126,38" stroke="#65b826" stroke-width="6" stroke-linecap="round" fill="none" />
        <path d="M110,72 C85,73 68,58 64,46 C86,42 103,52 110,72 Z" fill="#7fc834" />
        <path d="M108,71 Q88,58 72,50" stroke="#60a322" stroke-width="1.8" fill="none" stroke-linecap="round" />
        <path d="M126,40 C123,20 144,10 158,10 C156,30 142,42 126,40 Z" fill="#82cc38" />
        <path d="M127,39 Q141,25 153,16" stroke="#60a322" stroke-width="1.8" fill="none" stroke-linecap="round" />
        ${flowerBud}
        ${fullFlower}
        ${guardianCrown}
      </g>
    `;
  }

  function renderEyesSvg(expr) {
    if (expr === 'sleeping') {
      return `
        <path d="M89,138 Q95,144 101,138" stroke="#1e242b" stroke-width="3.2" stroke-linecap="round" fill="none" />
        <path d="M119,138 Q125,144 131,138" stroke="#1e242b" stroke-width="3.2" stroke-linecap="round" fill="none" />
      `;
    }
    if (expr === 'sick') {
      return `
        <path d="M89,134 L100,142 M100,134 L89,142" stroke="#1e242b" stroke-width="3" stroke-linecap="round" />
        <path d="M120,134 L131,142 M131,134 L120,142" stroke="#1e242b" stroke-width="3" stroke-linecap="round" />
        <path d="M103,152 Q107,147 110,151 Q113,155 117,150" stroke="#852b12" stroke-width="2.4" stroke-linecap="round" fill="none" />
      `;
    }
    if (isBlinking) {
      return `
        <line x1="89" y1="138" x2="100" y2="138" stroke="#1e242b" stroke-width="3.2" stroke-linecap="round" />
        <line x1="120" y1="138" x2="131" y2="138" stroke="#1e242b" stroke-width="3.2" stroke-linecap="round" />
      `;
    }
    if (expr === 'happy') {
      return `
        <path d="M88,140 Q95,131 102,140" stroke="#1e242b" stroke-width="3.4" stroke-linecap="round" fill="none" />
        <path d="M118,140 Q125,131 132,140" stroke="#1e242b" stroke-width="3.4" stroke-linecap="round" fill="none" />
        <ellipse cx="81" cy="147" rx="7" ry="4" fill="#ff9a7b" opacity="0.7" />
        <ellipse cx="139" cy="147" rx="7" ry="4" fill="#ff9a7b" opacity="0.7" />
        <path d="M105,146 Q110,152 115,146" stroke="#852b12" stroke-width="2.4" stroke-linecap="round" fill="none" />
      `;
    }
    if (expr === 'eating') {
      return `
        <ellipse cx="95" cy="136" rx="5.5" ry="8" fill="#1c2229" />
        <ellipse cx="125" cy="136" rx="5.5" ry="8" fill="#1c2229" />
        <circle cx="93" cy="133" r="2" fill="#ffffff" />
        <circle cx="123" cy="133" r="2" fill="#ffffff" />
        <ellipse cx="110" cy="149" rx="6" ry="5" fill="#852b12" />
      `;
    }
    if (expr === 'sad') {
      return `
        <ellipse cx="95" cy="138" rx="5.5" ry="7.5" fill="#1c2229" />
        <ellipse cx="125" cy="138" rx="5.5" ry="7.5" fill="#1c2229" />
        <circle cx="94" cy="136" r="2" fill="#ffffff" />
        <circle cx="124" cy="136" r="2" fill="#ffffff" />
        <path d="M104,152 Q110,147 116,152" stroke="#852b12" stroke-width="2.4" stroke-linecap="round" fill="none" />
      `;
    }
    return `
      <ellipse cx="95" cy="138" rx="6" ry="8.5" fill="#1a2129" />
      <ellipse cx="125" cy="138" rx="6" ry="8.5" fill="#1a2129" />
      <circle cx="93" cy="134.5" r="2.2" fill="#ffffff" />
      <circle cx="123" cy="134.5" r="2.2" fill="#ffffff" />
    `;
  }

  function renderKiboSvg() {
    const stage = getCurrentStage();
    const stageIdx = STAGES.findIndex((s) => s.id === stage.id);
    const expr = getKiboExpression();
    const bodyFill = isSick() ? '#cc7c5c' : '#e26236';

    const bodySvg = `
      <g transform="translate(110, 144) scale(${stage.scale}) translate(-110, -144)">
        ${renderStemAndLeavesSvg(stageIdx)}
        <ellipse cx="110" cy="140" rx="${stage.bodyRx}" ry="${stage.bodyRy}" fill="${bodyFill}" />
        <ellipse cx="102" cy="130" rx="${stage.bodyRx * 0.55}" ry="${stage.bodyRy * 0.35}" fill="#ed794d" opacity="0.4" />
        ${renderHatSvg(state.equippedHat, stageIdx)}
        ${renderEyesSvg(expr)}
      </g>
    `;
    el.kiboSvg.innerHTML = bodySvg;
  }

  // ==================== RENDER HUD & SCENE ====================
  function updateStatBar(fillEl, value) {
    const v = Math.round(clamp(value, 0, 100));
    fillEl.style.width = `${v}%`;
    const chip = fillEl.closest('.stat-chip');
    chip.classList.toggle('is-low', v < 40 && v >= 20);
    chip.classList.toggle('is-critical', v < 20);
  }

  function renderGardenDecors() {
    el.gardenDecorLayer.innerHTML = '';
    for (const decorId of state.activeDecors) {
      const def = DECORS.find((d) => d.id === decorId);
      if (!def) continue;
      const span = document.createElement('span');
      span.className = 'garden-decor';
      span.textContent = def.icon;
      span.style.left = def.pos.left;
      span.style.bottom = def.pos.bottom;
      span.title = def.name;
      el.gardenDecorLayer.appendChild(span);
    }
  }

  function renderMesses() {
    el.messLayer.innerHTML = '';
    for (const mess of state.messes) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mess-item';
      btn.textContent = mess.icon === '🪵' ? '🍁' : mess.icon;
      btn.style.left = `${mess.left}%`;
      btn.style.bottom = `${mess.bottom}%`;
      btn.title = 'Clicca per pulire!';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        cleanSingleMess(mess.id);
      });
      el.messLayer.appendChild(btn);
    }
  }

  function renderPests() {
    el.pestsLayer.innerHTML = '';
    for (const pest of state.pests) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pest-item';
      btn.style.left = `${pest.left}%`;
      btn.style.bottom = `${pest.bottom}%`;
      btn.title = `${pest.name}: tocca per scacciarlo!`;
      const pestIcon = pest.icon === '🪲' ? '🐜' : pest.icon;
      btn.innerHTML = `<span>${pestIcon}</span><span class="pest-item__hp">${pest.hp}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        tapPest(pest.id);
      });
      el.pestsLayer.appendChild(btn);
    }
  }

  function renderConditionAndQuest() {
    if (state.quest) {
      el.questPillText.textContent = `🎯 ${state.quest.title} (${state.quest.progress}/${state.quest.target})`;
    }

    el.conditionPill.className = 'condition-pill';
    if (isSick()) {
      el.conditionPill.classList.add('is-sick');
      el.conditionPillText.textContent = `🤒 Appassito ❤️ ${Math.round(state.health)}%`;
    } else if (state.weather === 'heatwave') {
      el.conditionPill.classList.add('is-heat');
      el.conditionPillText.textContent = `☀️ Caldo! ❤️ ${Math.round(state.health)}%`;
    } else if (state.weather === 'rain') {
      el.conditionPill.classList.add('is-rain');
      el.conditionPillText.textContent = `🌧️ Pioggia ❤️ ${Math.round(state.health)}%`;
    } else if (isFlourishing()) {
      el.conditionPill.classList.add('is-flourishing');
      el.conditionPillText.textContent = `✨ Rigoglio x1.5 XP`;
    } else {
      el.conditionPillText.textContent = `❤️ Salute ${Math.round(state.health)}%`;
    }
  }

  function renderUI() {
    const stage = getCurrentStage();
    const nextStage = getNextStage();

    el.petNameDisplay.textContent = state.name;
    el.stageBadge.textContent = stage.name;
    el.hudMiniAvatar.textContent = stage.icon;
    el.coinsDisplay.textContent = Math.floor(state.coins);

    if (nextStage) {
      const span = nextStage.minXp - stage.minXp;
      const progress = clamp(((state.xp - stage.minXp) / span) * 100, 5, 100);
      el.xpBarFill.style.width = `${progress}%`;
    } else {
      el.xpBarFill.style.width = '100%';
    }

    updateStatBar(el.statHunger, state.hunger);
    updateStatBar(el.statHydration, state.hydration);
    updateStatBar(el.statHappiness, state.happiness);
    updateStatBar(el.statEnergy, state.energy);
    renderConditionAndQuest();

    el.device.classList.toggle('is-sleeping', state.isSleeping);
    el.sleepBtn.classList.toggle('is-active', state.isSleeping);
    el.sleepBtnIcon.textContent = state.isSleeping ? '☀️' : '😴';
    el.sleepBtnLabel.textContent = state.isSleeping ? 'Sveglia' : 'Nanna';
    el.soundToggleIcon.textContent = state.soundOn ? '🔊' : '🔇';

    const foodCount = Object.values(state.inventory).reduce((acc, q) => acc + q, 0);
    el.basketBadge.textContent = foodCount;

    renderTimeTheme();
    renderKiboSvg();
    renderGardenDecors();
    renderMesses();
    renderPests();
  }

  // ==================== ACTIONS ====================
  function petKibo() {
    if (state.isSleeping) {
      showSpeech('Shhh... sta dormendo 😴');
      playTone('click');
      return;
    }

    const now = Date.now();
    if (now > state.petCooldownUntil) {
      state.petCooldownCount = 0;
    }

    if (state.petCooldownCount >= 3) {
      state.happiness = clamp(state.happiness + 1, 0, 100);
      playTone('click');
      showSpeech(pick(PHRASES.petTired));
      saveState();
      renderUI();
      return;
    }

    state.petCooldownCount += 1;
    state.petCooldownUntil = now + 18000;
    state.totalPets += 1;

    const happyGain = state.equippedHat === 'flower_crown' ? 10 : 7;
    state.happiness = clamp(state.happiness + happyGain, 0, 100);
    addXp(5);

    if (state.totalPets % 3 === 0) {
      awardCoins(2);
      spawnFxBurst(['💛', '💰'], 4);
    } else {
      spawnFxBurst(['💛', '✨'], 3);
    }

    playTone('pet');
    triggerAnimation('is-happy', 600);
    setTemporaryExpression('happy', 1100);
    showSpeech(pick(PHRASES.pet));
    saveState();
    renderUI();
  }

  function waterKibo() {
    if (state.isSleeping) {
      showToast('Sveglia prima Kibo per annaffiarlo!');
      return;
    }
    if (state.hydration >= 98) {
      showToast(`${state.name} è già ben idratato!`);
      playTone('click');
      return;
    }
    state.hydration = clamp(state.hydration + 24, 0, 100);
    state.happiness = clamp(state.happiness + 4, 0, 100);
    if (state.weather === 'heatwave') {
      state.health = clamp(state.health + 4, 0, 100);
      addXp(10);
    } else {
      addXp(6);
    }
    advanceQuest('care', 1);
    playTone('water');
    spawnRainBurst();
    triggerAnimation('is-happy', 600);
    setTemporaryExpression('happy', 1100);
    showSpeech(pick(PHRASES.water));
    saveState();
    renderUI();
  }

  function cleanSingleMess(messId) {
    state.messes = state.messes.filter((m) => m.id !== messId);
    state.happiness = clamp(state.happiness + 6, 0, 100);
    awardCoins(3);
    addXp(6);
    playTone('coin');
    spawnFxBurst(['✨', '🌟', '💰'], 4);
    showSpeech(pick(PHRASES.clean));
    saveState();
    renderUI();
  }

  function cleanGarden() {
    if (state.messes.length === 0 && state.pests.length === 0) {
      playTone('click');
      showToast('Il prato è già pulitissimo! ✨');
      return;
    }
    if (state.messes.length === 0 && state.pests.length > 0) {
      playTone('click');
      showToast('Tocca i parassiti sul prato per scacciarli!');
      return;
    }
    const count = state.messes.length;
    state.messes = [];
    state.happiness = clamp(state.happiness + count * 6, 0, 100);
    awardCoins(count * 3);
    addXp(count * 6);
    playTone('coin');
    spawnFxBurst(['✨', '🌟', '💰'], 6);
    showSpeech(pick(PHRASES.clean));
    saveState();
    renderUI();
  }

  function tapPest(pestId) {
    const pest = state.pests.find((p) => p.id === pestId);
    if (!pest) return;
    pest.hp -= 1;
    if (pest.hp <= 0) {
      state.pests = state.pests.filter((p) => p.id !== pestId);
      const gotCoins = awardCoins(5);
      addXp(10);
      state.happiness = clamp(state.happiness + 6, 0, 100);
      advanceQuest('pest', 1);
      playTone('coin');
      spawnFxBurst(['🛡️', '✨', '💰'], 5);
      showToast(`Scacciato ${pest.name}! +${gotCoins} 💰`);
      showSpeech(pick(PHRASES.pestClear));
    } else {
      playTone('bonk');
      spawnFxBurst(['💥'], 2);
    }
    saveState();
    renderUI();
  }

  function toggleSleep() {
    state.isSleeping = !state.isSleeping;
    playTone('click');
    if (state.isSleeping) {
      showSpeech(pick(PHRASES.sleep));
    } else {
      showSpeech(pick(PHRASES.wake));
      triggerAnimation('is-happy', 600);
    }
    saveState();
    renderUI();
  }

  function feedKibo(foodId) {
    const food = FOODS.find((f) => f.id === foodId);
    if (!food) return;
    if ((state.inventory[foodId] || 0) <= 0) return;

    if (state.isSleeping) {
      showToast('Sveglia prima Kibo per farlo mangiare!');
      return;
    }

    state.inventory[foodId] -= 1;
    if (state.inventory[foodId] <= 0) delete state.inventory[foodId];

    state.hunger = clamp(state.hunger + (food.hunger || 0), 0, 100);
    state.hydration = clamp(state.hydration + (food.hydration || 0), 0, 100);
    state.happiness = clamp(state.happiness + (food.happiness || 0), 0, 100);
    state.energy = clamp(state.energy + (food.energy || 0), 0, 100);
    state.health = clamp(state.health + (food.health || 3), 0, 100);
    addXp(food.xp || 10);
    advanceQuest('care', 1);

    playTone('eat');
    triggerAnimation('is-eating', 750);
    setTemporaryExpression('eating', 1000);
    spawnFxBurst([food.icon, '💛', '✨'], 5);
    showSpeech(food.health ? pick(PHRASES.heal) : pick(PHRASES.eat));
    closeModal();
    saveState();
    renderUI();
  }

  function buyItem(kind, itemId) {
    if (kind === 'food') {
      const food = FOODS.find((f) => f.id === itemId);
      if (!food || state.coins < food.price) return;
      state.coins -= food.price;
      state.inventory[itemId] = (state.inventory[itemId] || 0) + 1;
      playTone('coin');
      showToast(`Comprato ${food.icon} ${food.name}!`);
    } else if (kind === 'hat') {
      const hat = HATS.find((h) => h.id === itemId);
      if (!hat || state.ownedHats.includes(itemId) || state.coins < hat.price) return;
      state.coins -= hat.price;
      state.ownedHats.push(itemId);
      state.equippedHat = itemId;
      playTone('evolve');
      showToast(`Indossato ${hat.icon} ${hat.name}!`);
    } else if (kind === 'decor') {
      const decor = DECORS.find((d) => d.id === itemId);
      if (!decor || state.ownedDecors.includes(itemId) || state.coins < decor.price) return;
      state.coins -= decor.price;
      state.ownedDecors.push(itemId);
      state.activeDecors.push(itemId);
      playTone('evolve');
      showToast(`Aggiunto ${decor.icon} al prato!`);
    }
    saveState();
    renderUI();
    renderModalContent();
  }

  function toggleHat(hatId) {
    if (!state.ownedHats.includes(hatId)) return;
    state.equippedHat = state.equippedHat === hatId ? 'none' : hatId;
    playTone('click');
    saveState();
    renderUI();
    renderModalContent();
  }

  function toggleDecor(decorId) {
    if (!state.ownedDecors.includes(decorId)) return;
    if (state.activeDecors.includes(decorId)) {
      state.activeDecors = state.activeDecors.filter((id) => id !== decorId);
    } else {
      state.activeDecors.push(decorId);
    }
    playTone('click');
    saveState();
    renderUI();
    renderModalContent();
  }

  // ==================== MODALS ====================
  function openModal(type, defaultTab = 'food') {
    currentModal = type;
    currentTab = defaultTab;
    playTone('click');
    el.modalBackdrop.hidden = false;
    renderModalContent();
  }

  function closeModal() {
    currentModal = null;
    el.modalBackdrop.hidden = true;
  }

  function renderTabs(tabs) {
    el.modalTabs.hidden = false;
    el.modalTabs.innerHTML = '';
    for (const t of tabs) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `tab-btn ${currentTab === t.id ? 'is-active' : ''}`;
      btn.textContent = t.label;
      btn.addEventListener('click', () => {
        currentTab = t.id;
        playTone('click');
        renderModalContent();
      });
      el.modalTabs.appendChild(btn);
    }
  }

  function renderModalContent() {
    if (!currentModal) return;
    el.modalBody.innerHTML = '';

    if (currentModal === 'games') {
      el.modalTitle.textContent = 'Scegli un Mini-Gioco';
      el.modalTabs.hidden = true;
      const grid = document.createElement('div');
      grid.className = 'item-grid';
      grid.innerHTML = `
        <div class="item-card">
          <div class="item-card__icon">💧</div>
          <div class="item-card__name">Acchiappa Gocce</div>
          <div class="item-card__desc">3 vite, combo x3 e velocità crescente! Raccogli gocce, soli e stelle, evita le castagne.</div>
          <button class="item-card__btn" id="startDropGameBtn" type="button">Gioca (30s)</button>
        </div>
        <div class="item-card">
          <div class="item-card__icon">🌸</div>
          <div class="item-card__name">Memoria del Prato</div>
          <div class="item-card__desc">Ripeti la sequenza musicale del giardino! Più round superi, più monete ed XP ottieni.</div>
          <button class="item-card__btn item-card__btn--equip" id="startMemoryGameBtn" type="button">Gioca a Round</button>
        </div>
      `;
      el.modalBody.appendChild(grid);
      document.getElementById('startDropGameBtn').addEventListener('click', () => {
        closeModal();
        startDropMinigame();
      });
      document.getElementById('startMemoryGameBtn').addEventListener('click', () => {
        closeModal();
        startMemoryMinigame();
      });
      return;
    }

    if (currentModal === 'shop') {
      el.modalTitle.textContent = `Negozietto (${Math.floor(state.coins)} 💰)`;
      renderTabs([
        { id: 'food', label: '🍓 Cibo & Cure' },
        { id: 'hats', label: '🧢 Cappelli' },
        { id: 'decor', label: '🌼 Giardino' },
      ]);

      const grid = document.createElement('div');
      grid.className = 'item-grid';

      if (currentTab === 'food') {
        for (const f of FOODS) {
          const ownedQty = state.inventory[f.id] || 0;
          const canBuy = state.coins >= f.price;
          const card = document.createElement('div');
          card.className = 'item-card';
          card.innerHTML = `
            <div class="item-card__icon">${f.icon}</div>
            <div class="item-card__name">${f.name}</div>
            <div class="item-card__desc">${f.desc}${ownedQty ? ` · Hai: ${ownedQty}` : ''}</div>
            <button class="item-card__btn" type="button" ${canBuy ? '' : 'disabled'}>
              Compra ${f.price} 💰
            </button>
          `;
          card.querySelector('button').addEventListener('click', () => buyItem('food', f.id));
          grid.appendChild(card);
        }
      } else if (currentTab === 'hats') {
        for (const h of HATS) {
          const owned = state.ownedHats.includes(h.id);
          const canBuy = state.coins >= h.price;
          const card = document.createElement('div');
          card.className = 'item-card';
          card.innerHTML = `
            <div class="item-card__icon">${h.icon}</div>
            <div class="item-card__name">${h.name}</div>
            <div class="item-card__desc">${h.desc}</div>
            <button class="item-card__btn ${owned ? 'item-card__btn--equipped' : ''}" type="button" ${owned || !canBuy ? 'disabled' : ''}>
              ${owned ? 'Già tuo ✓' : `Compra ${h.price} 💰`}
            </button>
          `;
          if (!owned) {
            card.querySelector('button').addEventListener('click', () => buyItem('hat', h.id));
          }
          grid.appendChild(card);
        }
      } else if (currentTab === 'decor') {
        for (const d of DECORS) {
          const owned = state.ownedDecors.includes(d.id);
          const canBuy = state.coins >= d.price;
          const card = document.createElement('div');
          card.className = 'item-card';
          card.innerHTML = `
            <div class="item-card__icon">${d.icon}</div>
            <div class="item-card__name">${d.name}</div>
            <div class="item-card__desc">${d.desc}</div>
            <button class="item-card__btn ${owned ? 'item-card__btn--equipped' : ''}" type="button" ${owned || !canBuy ? 'disabled' : ''}>
              ${owned ? 'Già tuo ✓' : `Compra ${d.price} 💰`}
            </button>
          `;
          if (!owned) {
            card.querySelector('button').addEventListener('click', () => buyItem('decor', d.id));
          }
          grid.appendChild(card);
        }
      }
      el.modalBody.appendChild(grid);
    } else if (currentModal === 'basket') {
      el.modalTitle.textContent = 'Cestino di Kibo';
      renderTabs([
        { id: 'food', label: '🍓 Merende' },
        { id: 'hats', label: '🧢 Cappelli' },
        { id: 'decor', label: '🌼 Giardino' },
      ]);

      if (currentTab === 'food') {
        const ownedFoods = FOODS.filter((f) => (state.inventory[f.id] || 0) > 0);
        if (ownedFoods.length === 0) {
          el.modalBody.innerHTML = `<div class="empty-state">Il cestino delle merende è vuoto!<br/>Passa dal <b>Negozio</b> per comprare cibo o tisane.</div>`;
          return;
        }
        const grid = document.createElement('div');
        grid.className = 'item-grid';
        for (const f of ownedFoods) {
          const qty = state.inventory[f.id];
          const card = document.createElement('div');
          card.className = 'item-card';
          card.innerHTML = `
            <div class="item-card__icon">${f.icon}</div>
            <div class="item-card__name">${f.name} (x${qty})</div>
            <div class="item-card__desc">${f.desc}</div>
            <button class="item-card__btn" type="button">Dai a ${state.name}</button>
          `;
          card.querySelector('button').addEventListener('click', () => feedKibo(f.id));
          grid.appendChild(card);
        }
        el.modalBody.appendChild(grid);
      } else if (currentTab === 'hats') {
        const grid = document.createElement('div');
        grid.className = 'item-grid';
        for (const h of HATS.filter((x) => state.ownedHats.includes(x.id))) {
          const equipped = state.equippedHat === h.id;
          const card = document.createElement('div');
          card.className = 'item-card';
          card.innerHTML = `
            <div class="item-card__icon">${h.icon}</div>
            <div class="item-card__name">${h.name}</div>
            <div class="item-card__desc">${h.perk}</div>
            <button class="item-card__btn ${equipped ? 'item-card__btn--equipped' : 'item-card__btn--equip'}" type="button">
              ${equipped ? 'Togli' : 'Indossa'}
            </button>
          `;
          card.querySelector('button').addEventListener('click', () => toggleHat(h.id));
          grid.appendChild(card);
        }
        el.modalBody.appendChild(grid);
      } else if (currentTab === 'decor') {
        const owned = DECORS.filter((d) => state.ownedDecors.includes(d.id));
        if (owned.length === 0) {
          el.modalBody.innerHTML = `<div class="empty-state">Non hai ancora decorazioni.<br/>Scopri il reparto <b>Giardino</b> nel Negozio!</div>`;
          return;
        }
        const grid = document.createElement('div');
        grid.className = 'item-grid';
        for (const d of owned) {
          const active = state.activeDecors.includes(d.id);
          const card = document.createElement('div');
          card.className = 'item-card';
          card.innerHTML = `
            <div class="item-card__icon">${d.icon}</div>
            <div class="item-card__name">${d.name}</div>
            <div class="item-card__desc">${d.desc}</div>
            <button class="item-card__btn ${active ? 'item-card__btn--equipped' : 'item-card__btn--equip'}" type="button">
              ${active ? 'Rimuovi' : 'Posiziona'}
            </button>
          `;
          card.querySelector('button').addEventListener('click', () => toggleDecor(d.id));
          grid.appendChild(card);
        }
        el.modalBody.appendChild(grid);
      }
    } else if (currentModal === 'status') {
      el.modalTitle.textContent = `Scheda di ${state.name}`;
      el.modalTabs.hidden = true;
      const stage = getCurrentStage();
      const nextStage = getNextStage();
      const hatObj = HATS.find((h) => h.id === state.equippedHat);

      const stepsHtml = STAGES.map((s) => {
        const unlocked = state.xp >= s.minXp && state.health >= s.minHealth;
        return `
          <div class="stage-step ${unlocked ? 'is-unlocked' : ''}">
            <span class="stage-step__emoji">${s.icon}</span>
            <strong>${s.name}</strong><br/>
            <span>${s.minXp} XP${s.minHealth ? ` · ❤️${s.minHealth}%` : ''}</span>
          </div>
        `;
      }).join('');

      el.modalBody.innerHTML = `
        <div class="profile-card">
          <div class="profile-row"><span>Stadio attuale</span><strong>${stage.icon} ${stage.name}</strong></div>
          <div class="profile-row"><span>Salute</span><strong>❤️ ${Math.round(state.health)}% ${isSick() ? '(Appassito)' : ''}</strong></div>
          <div class="profile-row"><span>Esperienza (XP)</span><strong>${state.xp}${nextStage ? ` / ${nextStage.minXp}` : ' (MAX)'}</strong></div>
          <div class="profile-row"><span>Bonus cappellino</span><strong>${hatObj ? hatObj.perk : 'Nessuno'}</strong></div>
          <div class="profile-row"><span>Sfide completate</span><strong>${state.questsCompleted} 🎯</strong></div>
        </div>
        ${state.quest ? `
        <div class="profile-card" style="background:#fff7e2;">
          <div style="font-family: var(--font-display); font-weight: 700;">🎯 Sfida attuale (${state.quest.progress}/${state.quest.target})</div>
          <div style="font-size: 13px;">${state.quest.title} — Premio: <b>+${state.quest.xpReward} XP, +${state.quest.coinReward} 💰</b></div>
        </div>` : ''}
        <div style="font-family: var(--font-display); font-weight: 600; margin-top: 2px;">Percorso di crescita</div>
        <div class="stage-roadmap">${stepsHtml}</div>
      `;
    } else if (currentModal === 'settings') {
      el.modalTitle.textContent = 'Impostazioni';
      el.modalTabs.hidden = true;
      el.modalBody.innerHTML = `
        <div class="profile-card">
          <label for="renameInput" style="font-family: var(--font-display); font-weight: 600;">Nome della creaturina</label>
          <div class="input-row">
            <input class="text-input" id="renameInput" type="text" maxlength="16" value="${escapeHtml(state.name)}" />
            <button class="btn-secondary" id="saveNameBtn" type="button">Salva</button>
          </div>
        </div>
        <div class="profile-card">
          <div style="font-family: var(--font-display); font-weight: 600;">Consigli per crescere al meglio</div>
          <div style="font-size: 13px; color: var(--ui-muted); line-height: 1.45;">
            • Mantieni tutte le barre sopra il <b>75%</b> per attivare <b>Rigoglio (x1.5 XP)</b>.<br/>
            • Ogni evoluzione richiede sia gli <b>XP</b> sia un livello minimo di <b>Salute ❤️</b>.<br/>
            • Tocca i <b>parassiti (🐛/🐜)</b> sul prato per scacciarli prima che indeboliscano Kibo!<br/>
            • Cappelli e decorazioni offrono bonus reali contro caldo, fame e parassiti.
          </div>
        </div>
        <button class="btn-danger" id="resetGameBtn" type="button">Ricomincia partita da capo</button>
      `;

      document.getElementById('saveNameBtn').addEventListener('click', () => {
        const val = document.getElementById('renameInput').value.trim();
        if (!val) return;
        state.name = val;
        playTone('coin');
        saveState();
        renderUI();
        closeModal();
        showToast(`Nome aggiornato in ${state.name}!`);
      });

      document.getElementById('resetGameBtn').addEventListener('click', () => {
        if (!confirm('Vuoi davvero ricominciare da capo con un nuovo Kibo?')) return;
        state = createDefaultState();
        saveState();
        renderUI();
        closeModal();
        showToast('Nuovo inizio! Prenditi cura di Kibo 🌱');
      });
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]));
  }

  // ==================== MINI-GIOCHI ====================
  let activeMinigame = null; // 'drop' | 'memory' | null
  let mgRaf = null;
  let mgState = null;

  function canPlayMinigame() {
    if (state.isSleeping) {
      showToast('Kibo sta dormendo! Sveglialo per giocare.');
      return false;
    }
    if (isSick()) {
      showToast('Kibo è appassito 🤒! Curalo prima con una Tisana o riposo.');
      return false;
    }
    if (state.energy < 14) {
      showToast('Kibo è troppo stanco! Fagli fare un pisolino 😴');
      return false;
    }
    return true;
  }

  function startDropMinigame() {
    if (!canPlayMinigame()) return;

    playTone('click');
    activeMinigame = 'drop';
    el.minigameOverlay.hidden = false;
    el.minigameCanvas.hidden = false;
    el.memoryBoard.hidden = true;
    el.mgLivesStat.hidden = false;
    el.mgLeftStat.innerHTML = '⏱️ <span id="mgTimer">30</span>s';
    el.mgTimer = document.getElementById('mgTimer');
    el.mgHint.textContent = 'Trascina o usa ⬅️ ➡️! Prendi 💧☀️⭐ in combo, evita le 🌰 (3 vite)!';

    const canvas = el.minigameCanvas;
    const ctx = canvas.getContext('2d');

    mgState = {
      playerX: canvas.width / 2,
      keys: { left: false, right: false },
      items: [],
      score: 0,
      combo: 0,
      lives: 3,
      timeLeft: 30,
      lastFrame: performance.now(),
      spawnAcc: 0,
      secAcc: 0,
    };

    el.mgScore.textContent = '0';
    el.mgCombo.hidden = true;
    el.mgLivesStat.textContent = '❤️❤️❤️';

    const loop = (now) => {
      if (activeMinigame !== 'drop') return;
      const dt = Math.min(0.05, (now - mgState.lastFrame) / 1000);
      mgState.lastFrame = now;

      updateDropMinigame(dt, canvas);
      drawDropMinigame(ctx, canvas);
      if (activeMinigame === 'drop') {
        mgRaf = requestAnimationFrame(loop);
      }
    };

    mgRaf = requestAnimationFrame(loop);
  }

  function updateDropMinigame(dt, canvas) {
    if (mgState.keys.left) mgState.playerX -= 290 * dt;
    if (mgState.keys.right) mgState.playerX += 290 * dt;
    mgState.playerX = clamp(mgState.playerX, 34, canvas.width - 34);

    mgState.secAcc += dt;
    if (mgState.secAcc >= 1) {
      mgState.secAcc -= 1;
      mgState.timeLeft -= 1;
      el.mgTimer.textContent = String(Math.max(0, mgState.timeLeft));
      if (mgState.timeLeft <= 0) {
        finishDropMinigame(true);
        return;
      }
    }

    const elapsed = 30 - mgState.timeLeft;
    const speedScale = 1 + elapsed * 0.032; // accelera progressivamente!
    const spawnInterval = Math.max(0.28, 0.48 - elapsed * 0.006);

    mgState.spawnAcc += dt;
    if (mgState.spawnAcc >= spawnInterval) {
      mgState.spawnAcc = 0;
      const roll = Math.random();
      const hazardChance = elapsed > 18 ? 0.34 : 0.24;
      let kind = 'drop';
      if (roll < hazardChance) kind = 'spike';
      else if (roll < hazardChance + 0.08) kind = 'star';
      else if (roll < hazardChance + 0.24) kind = 'sun';

      mgState.items.push({
        x: 24 + Math.random() * (canvas.width - 48),
        y: -20,
        vx: (Math.random() - 0.5) * (elapsed > 12 ? 55 : 20),
        vy: (170 + Math.random() * 100) * speedScale,
        kind,
      });
    }

    const py = canvas.height - 56;
    for (let i = mgState.items.length - 1; i >= 0; i--) {
      const it = mgState.items[i];
      it.x = clamp(it.x + it.vx * dt, 18, canvas.width - 18);
      it.y += it.vy * dt;

      if (Math.hypot(it.x - mgState.playerX, it.y - py) < 38) {
        if (it.kind === 'spike') {
          mgState.lives -= 1;
          mgState.combo = 0;
          el.mgCombo.hidden = true;
          el.mgLivesStat.textContent = '❤️'.repeat(Math.max(0, mgState.lives)) || '💔';
          playTone('bonk');
          mgState.items.splice(i, 1);
          if (mgState.lives <= 0) {
            finishDropMinigame(false, true);
            return;
          }
          continue;
        }

        mgState.combo += 1;
        const mult = mgState.combo >= 10 ? 3 : mgState.combo >= 5 ? 2 : 1;
        const pts = it.kind === 'star' ? 5 : it.kind === 'sun' ? 3 : 1;
        mgState.score += pts * mult;

        if (mult > 1) {
          el.mgCombo.hidden = false;
          el.mgCombo.textContent = `x${mult}`;
        }
        el.mgScore.textContent = String(mgState.score);
        playTone(it.kind === 'drop' ? 'pet' : 'coin');
        mgState.items.splice(i, 1);
        continue;
      }

      if (it.y > canvas.height + 24) {
        if (it.kind !== 'spike') {
          mgState.combo = 0;
          el.mgCombo.hidden = true;
        }
        mgState.items.splice(i, 1);
      }
    }
  }

  function drawDropMinigame(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#b4d65c';
    ctx.fillRect(0, canvas.height - 46, canvas.width, 46);

    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const it of mgState.items) {
      const glyph = it.kind === 'drop' ? '💧' : it.kind === 'sun' ? '☀️' : it.kind === 'star' ? '⭐' : '🌰';
      ctx.fillText(glyph, it.x, it.y);
    }

    const px = mgState.playerX;
    const py = canvas.height - 54;

    ctx.fillStyle = 'rgba(72, 95, 25, 0.25)';
    ctx.beginPath();
    ctx.ellipse(px, py + 23, 30, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#62b325';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(px, py - 18);
    ctx.quadraticCurveTo(px + 2, py - 34, px + 10, py - 42);
    ctx.stroke();

    ctx.fillStyle = '#7ec936';
    ctx.beginPath();
    ctx.ellipse(px - 10, py - 30, 10, 5, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(px + 14, py - 42, 10, 5, -0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e26236';
    ctx.beginPath();
    ctx.ellipse(px, py, 28, 21, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#5e7c44';
    ctx.beginPath();
    ctx.arc(px, py - 10, 19, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#3a5128';
    ctx.fillRect(px - 21, py - 12, 42, 4);

    ctx.fillStyle = '#1a2129';
    ctx.beginPath();
    ctx.ellipse(px - 8, py + 1, 3.2, 4.5, 0, 0, Math.PI * 2);
    ctx.ellipse(px + 8, py + 1, 3.2, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function finishDropMinigame(survived, knockedOut = false) {
    activeMinigame = null;
    cancelAnimationFrame(mgRaf);
    el.minigameOverlay.hidden = true;

    if (!mgState) return;
    if (!survived && !knockedOut) {
      showToast('Partita annullata.');
      return;
    }

    const baseCoins = survived ? Math.max(4, Math.round(mgState.score * 0.55)) : Math.max(1, Math.floor(mgState.score * 0.25));
    const gotCoins = awardCoins(baseCoins);
    const hatXpBonus = state.equippedHat === 'cap_green' ? 1.1 : 1;
    const baseXp = survived ? 22 + Math.min(18, Math.floor(mgState.score / 3)) : 8;
    const gotXp = addXp(Math.round(baseXp * hatXpBonus));

    state.happiness = clamp(state.happiness + (survived ? 18 : 8), 0, 100);
    state.hydration = clamp(state.hydration + 8, 0, 100);
    state.energy = clamp(state.energy - 12, 0, 100);
    if (survived) advanceQuest('minigame', 1);

    playTone(survived ? 'evolve' : 'bonk');
    showToast(survived ? `🎮 Vittoria! +${gotCoins} 💰 e +${gotXp} XP` : `💥 Oh no! +${gotCoins} 💰 e +${gotXp} XP`);
    showSpeech(survived ? `Che bravura! +${gotCoins} 💰` : 'Ahi, quelle castagne pungono!');
    if (survived) triggerAnimation('is-happy', 700);
    saveState();
    renderUI();
  }

  // ---- MINI-GIOCO 2: MEMORIA DEL PRATO ----
  let memState = null;

  function startMemoryMinigame() {
    if (!canPlayMinigame()) return;

    playTone('click');
    activeMinigame = 'memory';
    el.minigameOverlay.hidden = false;
    el.minigameCanvas.hidden = true;
    el.memoryBoard.hidden = false;
    el.mgLivesStat.hidden = true;
    el.mgCombo.hidden = true;
    el.mgLeftStat.innerHTML = '🌸 Round <span id="mgMemRound">1</span>';
    el.mgScore.textContent = '0';
    el.mgHint.textContent = 'Guarda i simboli illuminarsi e ripeti la sequenza nell’ordine esatto!';

    memState = {
      sequence: [],
      userIndex: 0,
      round: 0,
      locked: true,
    };

    nextMemoryRound();
  }

  function nextMemoryRound() {
    if (activeMinigame !== 'memory') return;
    memState.round += 1;
    memState.userIndex = 0;
    memState.locked = true;
    memState.sequence.push(Math.floor(Math.random() * 4));

    const roundEl = document.getElementById('mgMemRound');
    if (roundEl) roundEl.textContent = String(memState.round);
    el.memoryStatus.textContent = `Round ${memState.round}: osserva la sequenza...`;

    const speed = Math.max(280, 560 - memState.round * 35);
    memState.sequence.forEach((padIdx, stepIdx) => {
      setTimeout(() => {
        if (activeMinigame !== 'memory') return;
        flashMemoryPad(padIdx, speed * 0.65);
        if (stepIdx === memState.sequence.length - 1) {
          setTimeout(() => {
            if (activeMinigame !== 'memory') return;
            memState.locked = false;
            el.memoryStatus.textContent = 'Tocca a te! Ripeti la sequenza!';
          }, speed * 0.75);
        }
      }, 500 + stepIdx * speed);
    });
  }

  function flashMemoryPad(padIdx, duration = 300) {
    const pad = el.memoryGrid.querySelector(`[data-pad="${padIdx}"]`);
    if (!pad) return;
    pad.classList.add('is-lit');
    playTone(`pad_${padIdx}`);
    setTimeout(() => pad.classList.remove('is-lit'), duration);
  }

  function handleMemoryPadClick(padIdx) {
    if (activeMinigame !== 'memory' || memState.locked) return;
    flashMemoryPad(padIdx, 220);

    if (padIdx !== memState.sequence[memState.userIndex]) {
      finishMemoryMinigame(false);
      return;
    }

    memState.userIndex += 1;
    if (memState.userIndex >= memState.sequence.length) {
      memState.locked = true;
      const cleared = memState.round;
      el.mgScore.textContent = String(cleared);
      el.memoryStatus.textContent = 'Perfetto! Prossimo round... ✨';
      setTimeout(() => nextMemoryRound(), 850);
    }
  }

  function finishMemoryMinigame(quitEarly) {
    const clearedRounds = memState ? Math.max(0, memState.round - 1) : 0;
    activeMinigame = null;
    el.minigameOverlay.hidden = true;

    if (quitEarly && clearedRounds < 1) {
      showToast('Partita annullata.');
      return;
    }

    const baseCoins = clearedRounds > 0 ? 4 + clearedRounds * 4 : 1;
    const gotCoins = awardCoins(baseCoins);
    const hatXpBonus = state.equippedHat === 'cap_green' ? 1.1 : 1;
    const gotXp = addXp(Math.round((8 + clearedRounds * 6) * hatXpBonus));

    state.happiness = clamp(state.happiness + 12 + clearedRounds * 2, 0, 100);
    state.energy = clamp(state.energy - 10, 0, 100);
    if (clearedRounds >= 2) advanceQuest('minigame', 1);

    playTone(clearedRounds >= 2 ? 'evolve' : 'bonk');
    showToast(`🌸 Superati ${clearedRounds} round! +${gotCoins} 💰 e +${gotXp} XP`);
    showSpeech(clearedRounds >= 3 ? `Che memoria d’oro! +${gotCoins} 💰` : 'Bel tentativo! Riproviamo!');
    saveState();
    renderUI();
  }

  // ==================== GAME LOOP & EVENTS ====================
  function maybeTriggerWeatherEvent() {
    if (state.weather !== 'clear') {
      state.weatherTicksLeft -= 1;
      if (state.weatherTicksLeft <= 0) {
        state.weather = 'clear';
        showToast('Il meteo è tornato sereno! 🌤️');
      }
      return;
    }

    if (!state.isSleeping && Math.random() < 0.025) {
      if (Math.random() < 0.55) {
        state.weather = 'heatwave';
        state.weatherTicksLeft = 18;
        showToast('☀️ Ondata di caldo! Kibo ha più sete!');
      } else {
        state.weather = 'rain';
        state.weatherTicksLeft = 18;
        showToast('🌧️ Acquazzone! Idratazione gratis, ma occhio alle erbacce!');
      }
    }
  }

  function gameTick() {
    maybeTriggerWeatherEvent();

    const hasMushroom = state.activeDecors.includes('mushroom');
    const hasDaisy = state.activeDecors.includes('daisy');
    const hasLantern = state.activeDecors.includes('lantern');
    const hasButterfly = state.activeDecors.includes('butterfly');

    if (state.isSleeping) {
      state.energy = clamp(state.energy + 1.6, 0, 100);
      state.hunger = clamp(state.hunger - 0.14, 0, 100);
      state.hydration = clamp(state.hydration - 0.14, 0, 100);
      state.health = clamp(state.health + 0.35, 0, 100);
      if (state.energy >= 100) {
        state.isSleeping = false;
        showSpeech(pick(PHRASES.wake));
        playTone('pet');
      }
    } else {
      let hungerDrain = 0.42;
      if (state.equippedHat === 'cap_red') hungerDrain *= 0.8;
      if (hasMushroom) hungerDrain *= 0.9;

      let hydroDrain = 0.38;
      if (state.weather === 'heatwave') {
        hydroDrain *= state.equippedHat === 'sun_hat' ? 1.25 : 1.9;
      }

      let happyDrain = hasDaisy ? 0.2 : 0.28;
      let energyDrain = hasLantern ? 0.22 : 0.3;

      // Danno da parassiti attivi
      if (state.pests.length > 0) {
        hungerDrain += state.pests.length * 0.25;
        happyDrain += state.pests.length * 0.25;
      }

      state.hunger = clamp(state.hunger - hungerDrain, 0, 100);
      if (state.weather === 'rain') {
        state.hydration = clamp(state.hydration + 0.35, 0, 100);
      } else {
        state.hydration = clamp(state.hydration - hydroDrain, 0, 100);
      }
      state.happiness = clamp(state.happiness - happyDrain, 0, 100);
      state.energy = clamp(state.energy - energyDrain, 0, 100);

      // Gestione Salute & Rigoglio
      if (state.hunger < 20 || state.hydration < 20 || state.pests.length >= 2) {
        state.health = clamp(state.health - 0.65, 0, 100);
      } else if (isFlourishing()) {
        state.health = clamp(state.health + 0.45, 0, 100);
        advanceQuest('flourish', 1);
        if (Math.random() < 0.14) awardCoins(1);
      } else if (state.equippedHat === 'flower_crown' && state.hunger > 40 && state.hydration > 40) {
        state.health = clamp(state.health + 0.2, 0, 100);
      }

      // Sporcizia sul prato
      const messChance = state.weather === 'rain' ? 0.08 : 0.04;
      if (state.messes.length < 3 && Math.random() < messChance) {
        const onLeft = Math.random() < 0.5;
        state.messes.push({
          id: `${Date.now()}_${Math.random()}`,
          icon: Math.random() < 0.55 ? '🍂' : '🍁',
          left: onLeft ? (10 + Math.random() * 20) : (68 + Math.random() * 18),
          bottom: 42 + Math.random() * 34,
        });
      }

      // Parassiti interattivi sul prato
      const pestChance = hasButterfly ? 0.018 : 0.036;
      if (state.pests.length < 2 && Math.random() < pestChance) {
        const onLeft = Math.random() < 0.5;
        const pestType = Math.random() < 0.55
          ? { icon: '🐛', name: 'Bruco Goloso', hp: 2 }
          : { icon: '🐜', name: 'Formica Birichina', hp: 3 };
        state.pests.push({
          id: `${Date.now()}_${Math.random()}`,
          ...pestType,
          maxHp: pestType.hp,
          left: onLeft ? (5 + Math.random() * 12) : (72 + Math.random() * 14),
          bottom: 42 + Math.random() * 32,
        });
        showToast(`${pestType.icon} È apparso un ${pestType.name}! Toccalo per scacciarlo!`);
      }

      // Promemoria bisogni
      if (!el.speechBubble.classList.contains('is-visible') && Math.random() < 0.12) {
        if (isSick()) showSpeech(pick(PHRASES.sick));
        else if (state.hunger < 30) showSpeech(pick(PHRASES.hungry));
        else if (state.hydration < 30) showSpeech(pick(PHRASES.thirsty));
        else if (state.energy < 25) showSpeech(pick(PHRASES.tired));
        else if (state.happiness < 30) showSpeech(pick(PHRASES.sad));
      }
    }

    saveState();
    renderUI();
  }

  function scheduleBlink() {
    setTimeout(() => {
      if (!state.isSleeping && !temporaryExpression && !isSick()) {
        isBlinking = true;
        renderKiboSvg();
        setTimeout(() => {
          isBlinking = false;
          renderKiboSvg();
        }, 130);
      }
      scheduleBlink();
    }, 2600 + Math.random() * 3200);
  }

  // ==================== EVENT LISTENERS ====================
  el.kiboButton.addEventListener('click', petKibo);
  el.waterBtn.addEventListener('click', waterKibo);
  el.cleanBtn.addEventListener('click', cleanGarden);
  el.sleepBtn.addEventListener('click', toggleSleep);
  el.minigameBtn.addEventListener('click', () => openModal('games'));

  el.shopBtn.addEventListener('click', () => openModal('shop', 'food'));
  el.basketBtn.addEventListener('click', () => openModal('basket', 'food'));
  el.openStatusBtn.addEventListener('click', () => openModal('status'));
  el.questPill.addEventListener('click', () => openModal('status'));
  el.settingsBtn.addEventListener('click', () => openModal('settings'));

  el.timeToggleBtn.addEventListener('click', () => {
    const order = ['auto', 'night', 'day', 'sunset'];
    const nextIdx = (order.indexOf(state.timeMode) + 1) % order.length;
    state.timeMode = order[nextIdx];
    const labels = { auto: 'Automatico', night: 'Notte stellata', day: 'Giorno di sole', sunset: 'Tramonto' };
    playTone('click');
    showToast(`Cielo: ${labels[state.timeMode]}`);
    saveState();
    renderTimeTheme();
  });

  el.soundToggleBtn.addEventListener('click', () => {
    state.soundOn = !state.soundOn;
    if (state.soundOn) playTone('click');
    saveState();
    renderUI();
  });

  el.modalCloseBtn.addEventListener('click', closeModal);
  el.modalBackdrop.addEventListener('click', (e) => {
    if (e.target === el.modalBackdrop) closeModal();
  });

  el.mgQuitBtn.addEventListener('click', () => {
    if (activeMinigame === 'drop') finishDropMinigame(false, false);
    else if (activeMinigame === 'memory') finishMemoryMinigame(true);
  });

  el.memoryGrid.querySelectorAll('.memory-pad').forEach((btn) => {
    btn.addEventListener('click', () => handleMemoryPadClick(Number(btn.dataset.pad)));
  });

  window.addEventListener('keydown', (e) => {
    if (activeMinigame !== 'drop' || !mgState) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') mgState.keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') mgState.keys.right = true;
  });

  window.addEventListener('keyup', (e) => {
    if (activeMinigame !== 'drop' || !mgState) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') mgState.keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') mgState.keys.right = false;
  });

  const movePlayerToPointer = (clientX) => {
    if (activeMinigame !== 'drop' || !mgState) return;
    const rect = el.minigameCanvas.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * el.minigameCanvas.width;
    mgState.playerX = clamp(relX, 34, el.minigameCanvas.width - 34);
  };

  el.minigameCanvas.addEventListener('pointerdown', (e) => movePlayerToPointer(e.clientX));
  el.minigameCanvas.addEventListener('pointermove', (e) => {
    if (e.buttons > 0 || e.pointerType === 'touch') movePlayerToPointer(e.clientX);
  });

  // ==================== INIT ====================
  renderUI();
  showSpeech(`Ciao! Sono ${state.name} 🌱`, 2600);
  setInterval(gameTick, 2500);
  scheduleBlink();
})();
