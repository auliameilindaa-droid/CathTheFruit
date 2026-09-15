/**
 * Sound synthesis engine using Web Audio API.
 * Features cheerful, pleasant arcade background music (BGM) and responsive sound effects.
 * Synthesized purely with Web Audio API - zero external file dependency, zero loading failures.
 */

import { GAME_CONSTANTS } from '../types';

// Musical notes frequencies (Hz) for cheerful C-Major / Pentatonic arcade music
const NOTE_FREQ: Record<string, number> = {
  // Bass register
  C2: 65.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  // Mid / Harmony register
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  // Lead melody register
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50, D6: 1174.66, E6: 1318.51, F6: 1396.91, G6: 1567.98,
};

// 8-Bar Cheerful Melodic Sequence (128 sixteenth-note steps at 124 BPM)
interface MusicStep {
  melody?: { note: string; dur: number };
  bass?: { note: string; dur: number };
  chord?: { notes: string[]; dur: number };
  shaker?: boolean;
  accent?: boolean;
}

const TOTAL_BGM_STEPS = 128;

function buildBGMScore(): Map<number, MusicStep> {
  const map = new Map<number, MusicStep>();

  const getOrCreate = (step: number): MusicStep => {
    let s = map.get(step);
    if (!s) {
      s = {};
      map.set(step, s);
    }
    return s;
  };

  // --- 1. MELODY: Joyful, bouncy, sunny fruit orchard tune ---
  // Bar 1 (C Major: bright start)
  getOrCreate(0).melody = { note: 'E5', dur: 0.16 };
  getOrCreate(2).melody = { note: 'G5', dur: 0.16 };
  getOrCreate(4).melody = { note: 'C6', dur: 0.22 };
  getOrCreate(6).melody = { note: 'G5', dur: 0.16 };
  getOrCreate(8).melody = { note: 'E5', dur: 0.16 };
  getOrCreate(10).melody = { note: 'D5', dur: 0.16 };
  getOrCreate(12).melody = { note: 'E5', dur: 0.18 };
  getOrCreate(14).melody = { note: 'G5', dur: 0.18 };

  // Bar 2 (F Major: playful bounce)
  getOrCreate(16).melody = { note: 'A5', dur: 0.18 };
  getOrCreate(18).melody = { note: 'C6', dur: 0.18 };
  getOrCreate(20).melody = { note: 'A5', dur: 0.18 };
  getOrCreate(22).melody = { note: 'F5', dur: 0.16 };
  getOrCreate(24).melody = { note: 'G5', dur: 0.16 };
  getOrCreate(26).melody = { note: 'A5', dur: 0.16 };
  getOrCreate(28).melody = { note: 'F5', dur: 0.22 };
  getOrCreate(30).melody = { note: 'D5', dur: 0.16 };

  // Bar 3 (G Major: uplifting sunshine)
  getOrCreate(32).melody = { note: 'B5', dur: 0.18 };
  getOrCreate(34).melody = { note: 'D6', dur: 0.18 };
  getOrCreate(36).melody = { note: 'B5', dur: 0.18 };
  getOrCreate(38).melody = { note: 'G5', dur: 0.16 };
  getOrCreate(40).melody = { note: 'A5', dur: 0.16 };
  getOrCreate(42).melody = { note: 'B5', dur: 0.16 };
  getOrCreate(44).melody = { note: 'G5', dur: 0.18 };
  getOrCreate(46).melody = { note: 'D5', dur: 0.18 };

  // Bar 4 (C Major: cheerful cadence)
  getOrCreate(48).melody = { note: 'E5', dur: 0.18 };
  getOrCreate(50).melody = { note: 'G5', dur: 0.18 };
  getOrCreate(52).melody = { note: 'C6', dur: 0.24 };
  getOrCreate(56).melody = { note: 'B5', dur: 0.16 };
  getOrCreate(58).melody = { note: 'A5', dur: 0.16 };
  getOrCreate(60).melody = { note: 'G5', dur: 0.18 };
  getOrCreate(62).melody = { note: 'E5', dur: 0.18 };

  // Bar 5 (C Major: higher register energetic phrase)
  getOrCreate(64).melody = { note: 'G5', dur: 0.16 };
  getOrCreate(66).melody = { note: 'C6', dur: 0.16 };
  getOrCreate(68).melody = { note: 'E6', dur: 0.24 };
  getOrCreate(70).melody = { note: 'D6', dur: 0.16 };
  getOrCreate(72).melody = { note: 'C6', dur: 0.16 };
  getOrCreate(74).melody = { note: 'D6', dur: 0.16 };
  getOrCreate(76).melody = { note: 'E6', dur: 0.22 };
  getOrCreate(78).melody = { note: 'C6', dur: 0.16 };

  // Bar 6 (F Major: high sparkle)
  getOrCreate(80).melody = { note: 'F6', dur: 0.24 };
  getOrCreate(82).melody = { note: 'E6', dur: 0.16 };
  getOrCreate(84).melody = { note: 'D6', dur: 0.16 };
  getOrCreate(86).melody = { note: 'C6', dur: 0.18 };
  getOrCreate(88).melody = { note: 'A5', dur: 0.18 };
  getOrCreate(90).melody = { note: 'C6', dur: 0.18 };
  getOrCreate(92).melody = { note: 'F6', dur: 0.22 };
  getOrCreate(94).melody = { note: 'E6', dur: 0.16 };

  // Bar 7 (D Minor -> G7: joyful anticipation)
  getOrCreate(96).melody = { note: 'D6', dur: 0.18 };
  getOrCreate(98).melody = { note: 'C6', dur: 0.18 };
  getOrCreate(100).melody = { note: 'B5', dur: 0.18 };
  getOrCreate(102).melody = { note: 'A5', dur: 0.16 };
  getOrCreate(104).melody = { note: 'B5', dur: 0.16 };
  getOrCreate(106).melody = { note: 'C6', dur: 0.16 };
  getOrCreate(108).melody = { note: 'D6', dur: 0.22 };
  getOrCreate(110).melody = { note: 'B5', dur: 0.18 };

  // Bar 8 (C Major: delightful turnaround flourish)
  getOrCreate(112).melody = { note: 'C6', dur: 0.30 };
  getOrCreate(116).melody = { note: 'G5', dur: 0.16 };
  getOrCreate(118).melody = { note: 'A5', dur: 0.16 };
  getOrCreate(120).melody = { note: 'B5', dur: 0.16 };
  getOrCreate(122).melody = { note: 'C6', dur: 0.30 };
  getOrCreate(124).melody = { note: 'E6', dur: 0.16 };
  getOrCreate(126).melody = { note: 'D6', dur: 0.16 };

  // --- 2. BASS: Warm bouncy plucked bassline ---
  // Bar 1
  getOrCreate(0).bass = { note: 'C3', dur: 0.18 };
  getOrCreate(4).bass = { note: 'G2', dur: 0.18 };
  getOrCreate(8).bass = { note: 'C3', dur: 0.18 };
  getOrCreate(12).bass = { note: 'E3', dur: 0.18 };
  // Bar 2
  getOrCreate(16).bass = { note: 'F2', dur: 0.18 };
  getOrCreate(20).bass = { note: 'C3', dur: 0.18 };
  getOrCreate(24).bass = { note: 'F2', dur: 0.18 };
  getOrCreate(28).bass = { note: 'A2', dur: 0.18 };
  // Bar 3
  getOrCreate(32).bass = { note: 'G2', dur: 0.18 };
  getOrCreate(36).bass = { note: 'D3', dur: 0.18 };
  getOrCreate(40).bass = { note: 'G2', dur: 0.18 };
  getOrCreate(44).bass = { note: 'B2', dur: 0.18 };
  // Bar 4
  getOrCreate(48).bass = { note: 'C3', dur: 0.18 };
  getOrCreate(52).bass = { note: 'G2', dur: 0.18 };
  getOrCreate(56).bass = { note: 'C3', dur: 0.18 };
  getOrCreate(60).bass = { note: 'E3', dur: 0.18 };
  // Bar 5
  getOrCreate(64).bass = { note: 'C3', dur: 0.18 };
  getOrCreate(68).bass = { note: 'G2', dur: 0.18 };
  getOrCreate(72).bass = { note: 'C3', dur: 0.18 };
  getOrCreate(76).bass = { note: 'E3', dur: 0.18 };
  // Bar 6
  getOrCreate(80).bass = { note: 'F2', dur: 0.18 };
  getOrCreate(84).bass = { note: 'C3', dur: 0.18 };
  getOrCreate(88).bass = { note: 'F2', dur: 0.18 };
  getOrCreate(92).bass = { note: 'A2', dur: 0.18 };
  // Bar 7
  getOrCreate(96).bass = { note: 'D3', dur: 0.18 };
  getOrCreate(100).bass = { note: 'A2', dur: 0.18 };
  getOrCreate(104).bass = { note: 'G2', dur: 0.18 };
  getOrCreate(108).bass = { note: 'D3', dur: 0.18 };
  // Bar 8
  getOrCreate(112).bass = { note: 'C3', dur: 0.18 };
  getOrCreate(116).bass = { note: 'G2', dur: 0.18 };
  getOrCreate(120).bass = { note: 'C3', dur: 0.18 };
  getOrCreate(124).bass = { note: 'G2', dur: 0.18 };

  // --- 3. HARMONY / CHORDS: Soft stabs on off-beats ---
  getOrCreate(4).chord = { notes: ['E4', 'G4'], dur: 0.14 };
  getOrCreate(12).chord = { notes: ['E4', 'G4'], dur: 0.14 };
  getOrCreate(20).chord = { notes: ['F4', 'A4'], dur: 0.14 };
  getOrCreate(28).chord = { notes: ['F4', 'A4'], dur: 0.14 };
  getOrCreate(36).chord = { notes: ['G4', 'B4'], dur: 0.14 };
  getOrCreate(44).chord = { notes: ['G4', 'B4'], dur: 0.14 };
  getOrCreate(52).chord = { notes: ['E4', 'G4'], dur: 0.14 };
  getOrCreate(60).chord = { notes: ['E4', 'G4'], dur: 0.14 };

  getOrCreate(68).chord = { notes: ['G4', 'C5'], dur: 0.14 };
  getOrCreate(76).chord = { notes: ['G4', 'C5'], dur: 0.14 };
  getOrCreate(84).chord = { notes: ['A4', 'C5'], dur: 0.14 };
  getOrCreate(92).chord = { notes: ['A4', 'C5'], dur: 0.14 };
  getOrCreate(100).chord = { notes: ['F4', 'A4'], dur: 0.14 };
  getOrCreate(108).chord = { notes: ['G4', 'B4'], dur: 0.14 };
  getOrCreate(116).chord = { notes: ['E4', 'G4', 'C5'], dur: 0.16 };
  getOrCreate(124).chord = { notes: ['E4', 'G4', 'C5'], dur: 0.16 };

  // --- 4. SHAKER & WOODBLOCK PERCUSSION ---
  for (let s = 0; s < TOTAL_BGM_STEPS; s += 2) {
    const stepObj = getOrCreate(s);
    stepObj.shaker = true;
    if (s % 8 === 4) {
      stepObj.accent = true;
    }
  }

  return map;
}

const BGM_SCORE = buildBGMScore();

class SoundSystem {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  // Music volume and scheduling
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private bgmFilterNode: BiquadFilterNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private bgmIntervalId: ReturnType<typeof setInterval> | null = null;
  private bgmActive: boolean = false;
  private bgmPaused: boolean = false;
  private currentBgmStep: number = 0;
  private nextStepTime: number = 0;

  // Tempo: 124 BPM => 16th note step = ~0.121s
  private readonly stepDuration = 60 / 124 / 4;

  constructor() {
    try {
      const saved = localStorage.getItem(GAME_CONSTANTS.LOCAL_STORAGE_SOUND_KEY);
      this.soundEnabled = saved !== null ? saved === 'true' : true;
    } catch {
      this.soundEnabled = true;
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem(GAME_CONSTANTS.LOCAL_STORAGE_SOUND_KEY, String(enabled));
    } catch {
      // Ignore storage errors
    }

    // Adjust music volume smoothly
    if (this.musicGainNode && this.ctx) {
      const targetGain = enabled ? 0.11 : 0.0;
      this.musicGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGainNode.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.15);
    }

    if (enabled && this.bgmActive && !this.bgmPaused && !this.bgmIntervalId) {
      this.resumeBGM();
    }
  }

  public toggle(): boolean {
    const newState = !this.soundEnabled;
    this.setEnabled(newState);
    if (newState) {
      this.playButtonClick();
    }
    return newState;
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }

    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      // Initialize Master Gain Nodes if not present
      if (!this.musicGainNode) {
        this.musicGainNode = this.ctx.createGain();
        this.musicGainNode.gain.setValueAtTime(this.soundEnabled ? 0.11 : 0.0, this.ctx.currentTime);

        // Lowpass filter to ensure sweet, warm arcade vibes
        this.bgmFilterNode = this.ctx.createBiquadFilter();
        this.bgmFilterNode.type = 'lowpass';
        this.bgmFilterNode.frequency.setValueAtTime(3200, this.ctx.currentTime);

        this.bgmFilterNode.connect(this.musicGainNode);
        this.musicGainNode.connect(this.ctx.destination);
      }

      if (!this.sfxGainNode) {
        this.sfxGainNode = this.ctx.createGain();
        this.sfxGainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.sfxGainNode.connect(this.ctx.destination);
      }
    }
  }

  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (!this.noiseBuffer) {
      const length = Math.floor(this.ctx.sampleRate * 0.06);
      this.noiseBuffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return this.noiseBuffer;
  }

  // --- BACKGROUND MUSIC ENGINE ---

  public startBGM() {
    this.initContext();
    if (!this.ctx) return;

    this.bgmActive = true;
    this.bgmPaused = false;
    this.currentBgmStep = 0;
    this.nextStepTime = this.ctx.currentTime + 0.05;

    if (this.musicGainNode) {
      this.musicGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGainNode.gain.setValueAtTime(
        this.soundEnabled ? 0.01 : 0.0,
        this.ctx.currentTime
      );
      if (this.soundEnabled) {
        this.musicGainNode.gain.linearRampToValueAtTime(0.11, this.ctx.currentTime + 0.3);
      }
    }

    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
    }

    this.bgmIntervalId = setInterval(() => {
      this.scheduler();
    }, 25);
  }

  public pauseBGM() {
    this.bgmPaused = true;
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    }
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  public resumeBGM() {
    if (!this.bgmActive) {
      this.startBGM();
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    this.bgmPaused = false;
    this.nextStepTime = this.ctx.currentTime + 0.05;

    if (this.musicGainNode && this.soundEnabled) {
      this.musicGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.musicGainNode.gain.linearRampToValueAtTime(0.11, this.ctx.currentTime + 0.2);
    }

    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
    }

    this.bgmIntervalId = setInterval(() => {
      this.scheduler();
    }, 25);
  }

  public stopBGM() {
    this.bgmActive = false;
    this.bgmPaused = false;

    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.15);
    }

    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.currentBgmStep = 0;
  }

  // Lookahead Web Audio note scheduler
  private scheduler() {
    if (!this.ctx || !this.bgmActive || this.bgmPaused) return;

    const scheduleAheadTime = 0.12;
    while (this.nextStepTime < this.ctx.currentTime + scheduleAheadTime) {
      this.playStep(this.currentBgmStep, this.nextStepTime);
      this.nextStepTime += this.stepDuration;
      this.currentBgmStep = (this.currentBgmStep + 1) % TOTAL_BGM_STEPS;
    }
  }

  private playStep(stepIndex: number, time: number) {
    if (!this.ctx || !this.bgmFilterNode) return;
    const item = BGM_SCORE.get(stepIndex);
    if (!item) return;

    // 1. Lead Melody Note (Marimba / Kalimba timbre)
    if (item.melody && NOTE_FREQ[item.melody.note]) {
      const freq = NOTE_FREQ[item.melody.note];
      const dur = item.melody.dur;

      // Primary tone: warm triangle
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(gain);
      gain.connect(this.bgmFilterNode);
      osc.start(time);
      osc.stop(time + dur);

      // Subtle sparkle overtone (octave harmonic for crisp wooden marimba pop)
      const overOsc = this.ctx.createOscillator();
      const overGain = this.ctx.createGain();
      overOsc.type = 'sine';
      overOsc.frequency.setValueAtTime(freq * 2, time);

      overGain.gain.setValueAtTime(0.001, time);
      overGain.gain.linearRampToValueAtTime(0.035, time + 0.004);
      overGain.gain.exponentialRampToValueAtTime(0.0001, time + Math.min(0.08, dur));

      overOsc.connect(overGain);
      overGain.connect(this.bgmFilterNode);
      overOsc.start(time);
      overOsc.stop(time + Math.min(0.08, dur));
    }

    // 2. Plucked Bassline
    if (item.bass && NOTE_FREQ[item.bass.note]) {
      const freq = NOTE_FREQ[item.bass.note];
      const dur = item.bass.dur;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(gain);
      gain.connect(this.bgmFilterNode);
      osc.start(time);
      osc.stop(time + dur);
    }

    // 3. Cheerful Chords (Gentle sine stabs)
    if (item.chord && item.chord.notes) {
      item.chord.notes.forEach((noteName) => {
        const freq = NOTE_FREQ[noteName];
        if (!freq || !this.ctx || !this.bgmFilterNode) return;
        const dur = item.chord?.dur || 0.12;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.04, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

        osc.connect(gain);
        gain.connect(this.bgmFilterNode);
        osc.start(time);
        osc.stop(time + dur);
      });
    }

    // 4. Rhythm Shaker / Percussion
    if (item.shaker) {
      const noiseBuffer = this.getNoiseBuffer();
      if (noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = item.accent ? 'bandpass' : 'highpass';
        filter.frequency.setValueAtTime(item.accent ? 4000 : 7500, time);

        const gain = this.ctx.createGain();
        const peakGain = item.accent ? 0.025 : 0.012;
        const dur = item.accent ? 0.04 : 0.028;

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(peakGain, time + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmFilterNode);

        noise.start(time);
        noise.stop(time + dur);
      }
    }
  }

  // --- SOUND EFFECTS (SFX) ---

  public playButtonClick() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Fallback
    }
  }

  public playFruitCatch() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.07); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.14); // G5

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Fallback
    }
  }

  public playGoldenCatch() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode) return;

      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.00, 1174.66, 1479.98]; // D5, F#5, A5, D6, F#6

      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.22, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.2);
      });
    } catch {
      // Fallback
    }
  }

  public playBombHit() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode) return;

      const now = this.ctx.currentTime;

      // Low frequency punch
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

      oscGain.gain.setValueAtTime(0.38, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGainNode);

      osc.start(now);
      osc.stop(now + 0.35);

      // Noise burst for explosion
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(100, now + 0.25);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.28, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGainNode);

      noise.start(now);
    } catch {
      // Fallback
    }
  }

  public playPhaseChange() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode) return;

      const now = this.ctx.currentTime;
      const chords = [440, 554.37, 659.25, 880];

      chords.forEach((freq, i) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.22, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } catch {
      // Fallback
    }
  }

  public playWin() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode) return;

      const now = this.ctx.currentTime;
      const melody = [
        { f: 523.25, d: 0.15 },
        { f: 659.25, d: 0.15 },
        { f: 783.99, d: 0.15 },
        { f: 1046.50, d: 0.45 },
      ];

      let t = now;
      melody.forEach((note) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + note.d);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);

        osc.start(t);
        osc.stop(t + note.d);

        t += note.d * 0.85;
      });
    } catch {
      // Fallback
    }
  }

  public playGameOver() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGainNode) return;

      const now = this.ctx.currentTime;
      const melody = [
        { f: 440, d: 0.25 },
        { f: 392, d: 0.25 },
        { f: 349.23, d: 0.25 },
        { f: 293.66, d: 0.6 },
      ];

      let t = now;
      melody.forEach((note) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + note.d);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);

        osc.start(t);
        osc.stop(t + note.d);

        t += note.d * 0.9;
      });
    } catch {
      // Fallback
    }
  }
}

export const sound = new SoundSystem();

