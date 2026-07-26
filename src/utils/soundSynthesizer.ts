// Web Audio API Synthesizer for Algorithmic Audio Feedback

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // Default muted for unobtrusive UX
  private volume: number = 0.08; // Gentle background volume

  constructor() {
    // AudioContext will be lazily initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.initContext();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Play a frequency tone corresponding to an array element value or operation step.
   * @param value Normalized value or element number (e.g. 1-100)
   * @param duration Tone length in seconds
   * @param type Oscillator type
   */
  public playNote(value: number = 50, duration: number = 0.08, type: OscillatorType = 'sine') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Map value (1-100) to pentatonic scale pitch range (220Hz - 880Hz)
      const freq = 220 + (Math.min(Math.max(value, 5), 100) / 100) * 660;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio errors if audio context was blocked by browser policies
    }
  }

  /**
   * Play swap effect (pitch glissando)
   */
  public playSwap(valA: number = 30, valB: number = 70) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freqA = 220 + (valA / 100) * 660;
      const freqB = 220 + (valB / 100) * 660;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freqA, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqB, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(this.volume * 1.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {}
  }

  /**
   * Play completion arpeggio
   */
  public playCompletion() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(this.volume * 1.5, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.2);
        } catch {}
      }, idx * 70);
    });
  }
}

export const soundSynth = new SoundSynthesizer();
