// Web Audio API Synthesizer - Louder & punchier audio cues designed for gym environments

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * High-clarity chime when a set is marked as complete.
 * Louder gain (0.55) with harmonic overtone.
 */
export function playSetCompleteSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Primary tone (D5 to A5)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(587.33, now); // D5
  osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

  gain1.gain.setValueAtTime(0.55, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.28);

  // Harmonic bell overtone (D6)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1174.66, now + 0.05);

  gain2.gain.setValueAtTime(0.35, now + 0.05);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.05);
  osc2.stop(now + 0.32);
}

/**
 * Urgent 3-tone punchy alert when rest timer ends.
 * Louder gain (0.75) to cut through gym background noise.
 */
export function playTimerDoneSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 3 punchy resonant beeps
  [0, 0.18, 0.36].forEach((offset, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = idx === 2 ? 1174.66 : 880; // A5 or D6

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + offset);

    // Boosted volume
    gain.gain.setValueAtTime(0.75, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + offset);
    osc.stop(now + offset + 0.17);
  });
}

/**
 * Triumphant fanfare chord when completing an entire workout session.
 * Louder gain (0.60).
 */
export function playCelebrationSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C-E-G-C major chord

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.09);

    gain.gain.setValueAtTime(0.6, now + idx * 0.09);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.09);
    osc.stop(now + idx * 0.09 + 0.5);
  });
}
