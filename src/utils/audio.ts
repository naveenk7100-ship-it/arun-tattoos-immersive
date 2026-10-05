/**
 * Procedural Web Audio API soundscape generator for Arun Tattoos
 * Generates subtle luxury studio ambience without external file dependencies
 */

class StudioAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private gainNode: GainNode | null = null;
  private oscillator1: OscillatorNode | null = null;
  private oscillator2: OscillatorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    } catch {
      // AudioContext not supported
    }
  }

  public toggle(): boolean {
    if (!this.ctx) {
      this.init();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isMuted) {
      this.startAmbience();
      this.isMuted = false;
    } else {
      this.stopAmbience();
      this.isMuted = true;
    }

    return !this.isMuted;
  }

  public getIsPlaying(): boolean {
    return !this.isMuted;
  }

  private startAmbience() {
    if (!this.ctx) return;

    try {
      // Master gain
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 3);

      // Low pass filter for dark, warm analog studio feel
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(140, this.ctx.currentTime);

      // Sub-harmonic drone (55Hz - A1 fundamental warmth)
      this.oscillator1 = this.ctx.createOscillator();
      this.oscillator1.type = 'sine';
      this.oscillator1.frequency.setValueAtTime(55, this.ctx.currentTime);

      // Warm upper harmonic (110Hz - A2 soft whisper)
      this.oscillator2 = this.ctx.createOscillator();
      this.oscillator2.type = 'triangle';
      this.oscillator2.frequency.setValueAtTime(110.2, this.ctx.currentTime);

      // Connections
      this.oscillator1.connect(this.filterNode);
      this.oscillator2.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.oscillator1.start();
      this.oscillator2.start();
    } catch {
      // fallback
    }
  }

  private stopAmbience() {
    if (!this.ctx || !this.gainNode) return;
    try {
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
      setTimeout(() => {
        try {
          this.oscillator1?.stop();
          this.oscillator2?.stop();
          this.oscillator1?.disconnect();
          this.oscillator2?.disconnect();
        } catch {
          // ignore
        }
      }, 1000);
    } catch {
      // ignore
    }
  }

  /**
   * Subtle tactile feedback tick when transitioning between zones
   */
  public playZoneTransitionChime() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // ignore
    }
  }
}

export const studioAudio = new StudioAudioEngine();
