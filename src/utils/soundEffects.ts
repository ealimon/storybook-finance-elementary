// Pleasant, zero-dependency Web Audio sound effects calibrated for Desktop, iPadOS, and iOS WebKit
let audioCtx: AudioContext | null = null;
let isMuted = false;
let isUnlocked = false;

// Create singleton AudioContext
export function initAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

// iOS WebKit requires an explicit user gesture to unlock audio
export function unlockAudio() {
  const ctx = initAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().then(() => {
      isUnlocked = true;
    }).catch(() => {});
  } else {
    isUnlocked = true;
  }

  // Play an imperceptible 1-sample silent buffer to prime iOS hardware
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // ignore
  }
}

// Attach automatic unlock listeners on the first user interaction
if (typeof window !== 'undefined') {
  const handleFirstInteraction = () => {
    unlockAudio();
    if (isUnlocked && audioCtx && audioCtx.state === 'running') {
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('touchend', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    }
  };

  ['touchstart', 'touchend', 'pointerdown', 'click'].forEach((event) => {
    window.addEventListener(event, handleFirstInteraction, { passive: true });
  });
}

// Helper to execute sound immediately and synchronously within the user gesture
function withAudio(callback: (ctx: AudioContext) => void) {
  if (isMuted) return;
  const ctx = initAudioContext();
  if (!ctx) return;

  // Crucial for iOS WebKit: resume synchronously within the user gesture stack
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  try {
    callback(ctx);
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

export function toggleMute(): boolean {
  isMuted = !isMuted;
  if (isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  return isMuted;
}

export function getMuteState(): boolean {
  return isMuted;
}

export function setMuteState(muted: boolean): void {
  isMuted = muted;
  if (isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

// Soft tactile button pop
export function playPopSound() {
  withAudio((ctx) => {
    const now = Math.max(ctx.currentTime, 0.001) + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.085);
  });
}

// Bright cheerful coin chime
export function playCoinSound() {
  withAudio((ctx) => {
    const now = Math.max(ctx.currentTime, 0.001) + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.38, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.285);
  });
}

// Star achievement fanfare
export function playFanfareSound() {
  withAudio((ctx) => {
    const now = Math.max(ctx.currentTime, 0.001) + 0.005;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.32, noteTime);
      gain.gain.linearRampToValueAtTime(0.001, noteTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.23);
    });
  });
}

// Gentle pleasant chime (for correct drops/choices)
export function playSoftChime() {
  withAudio((ctx) => {
    const now = Math.max(ctx.currentTime, 0.001) + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.07); // D6

    gain.gain.setValueAtTime(0.32, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.255);
  });
}

// Soft friendly boop (for items/incorrect attempts)
export function playSoftBoop() {
  withAudio((ctx) => {
    const now = Math.max(ctx.currentTime, 0.001) + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(220, now + 0.12);

    gain.gain.setValueAtTime(0.30, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.125);
  });
}

// Register beep for scanners & calculators
export function playBeepSound() {
  withAudio((ctx) => {
    const now = Math.max(ctx.currentTime, 0.001) + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.40, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.125);
  });
}

// Authentic high-pitch supermarket checkout barcode scanner beep
export function playScannerBeep() {
  withAudio((ctx) => {
    const now = Math.max(ctx.currentTime, 0.001) + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2093.00, now); // C7 - authentic scanner laser ping

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.095);
  });
}

// Cheerful cash register drawer bell ("Ka-ching!")
export function playCashRegisterSound() {
  withAudio((ctx) => {
    const now = Math.max(ctx.currentTime, 0.001) + 0.005;

    // First bell ring
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1480, now); // F#6
    gain1.gain.setValueAtTime(0.40, now);
    gain1.gain.linearRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.29);

    // Second bell ring (bright high overtone)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2217.46, now + 0.06); // C#7
    gain2.gain.setValueAtTime(0.35, now + 0.06);
    gain2.gain.linearRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.36);
  });
}

// Friendly speech synthesizer for item scanning & math prompts (fully supported on iOS Safari / iPad)
export function speakText(text: string) {
  if (isMuted) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // cheerful, friendly pitch for young learners
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

