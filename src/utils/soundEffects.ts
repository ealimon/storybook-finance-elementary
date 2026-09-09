// Pleasant, zero-dependency Web Audio sound effects calibrated for both Desktop and iOS/iPadOS
let audioCtx: AudioContext | null = null;
let isMuted = false;
let isUnlocked = false;

// Create singleton AudioContext
function initAudioContext(): AudioContext | null {
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

  if (ctx.state !== 'running') {
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

// Helper to execute sound after ensuring audio context is actively running
function withAudio(callback: (ctx: AudioContext) => void) {
  if (isMuted) return;
  const ctx = initAudioContext();
  if (!ctx) return;

  if (ctx.state !== 'running') {
    ctx.resume().then(() => {
      try {
        callback(ctx);
      } catch {
        // ignore audio errors
      }
    }).catch(() => {});
  } else {
    try {
      callback(ctx);
    } catch {
      // ignore audio errors
    }
  }
}

export function toggleMute(): boolean {
  isMuted = !isMuted;
  return isMuted;
}

export function getMuteState(): boolean {
  return isMuted;
}

export function setMuteState(muted: boolean): void {
  isMuted = muted;
}

// Soft tactile button pop
export function playPopSound() {
  withAudio((ctx) => {
    const now = ctx.currentTime + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.085);
  });
}

// Bright cheerful coin chime
export function playCoinSound() {
  withAudio((ctx) => {
    const now = ctx.currentTime + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.285);
  });
}

// Star achievement fanfare
export function playFanfareSound() {
  withAudio((ctx) => {
    const now = ctx.currentTime + 0.005;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.26, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);

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
    const now = ctx.currentTime + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.07); // D6

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.255);
  });
}

// Soft friendly boop (for items/taps)
export function playSoftBoop() {
  withAudio((ctx) => {
    const now = ctx.currentTime + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.12);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.125);
  });
}

// Register beep for scanners & calculators
export function playBeepSound() {
  withAudio((ctx) => {
    const now = ctx.currentTime + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.145);
  });
}
