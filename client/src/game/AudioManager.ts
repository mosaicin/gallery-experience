export class AudioManager {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private unlocked = false;

  unlock() {
    if (this.unlocked) return;
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.master.gain.value = 0.08;
    this.master.connect(this.context.destination);
    this.unlocked = true;
    this.roomHum();
  }

  private tone(frequency: number, duration: number, type: OscillatorType, volume: number, slide?: number) {
    if (!this.context || !this.master) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (slide) oscillator.frequency.exponentialRampToValueAtTime(slide, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  }

  roomHum() { this.tone(54, 1.2, "sine", 0.16, 48); }
  collect() { this.tone(330, 0.18, "triangle", 0.28, 660); }
  transition() { this.tone(90, 0.48, "sine", 0.22, 220); }
  error() { this.tone(110, 0.22, "square", 0.13, 74); }
  exit() { this.tone(440, 0.45, "sine", 0.24, 880); window.setTimeout(() => this.tone(660, 0.6, "triangle", 0.18, 990), 120); }
}
