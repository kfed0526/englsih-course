// Original synthesized sounds: no downloads, external requests or extra media files.
// Keep one context unlocked by a real tap; recreating it at the end of a round
// can leave iOS and Android celebration audio suspended.
export class GameSounds {
  constructor(createContext = () => new (window.AudioContext || window.webkitAudioContext)()) {
    this.createContext = createContext;
    this.enabled = true;
    this.nodes = new Set();
    this.context = null;
  }

  unlock() {
    if (!this.enabled) return;
    try {
      if (!this.context || this.context.state === 'closed') {
        this.context = this.createContext();
        this.output = this.context.createGain();
        this.output.gain.value = 0.45;
        this.output.connect(this.context.destination);
      }
      // Run resume synchronously from the click handler, before any speech awaits.
      this.context.resume()?.catch(() => {});
    } catch { this.context = null; }
  }

  stop() {
    for (const node of this.nodes) {
      try { node.stop(); } catch { /* Already ended. */ }
      try { node.disconnect(); } catch { /* Optional browser cleanup. */ }
    }
    this.nodes.clear();
  }

  track(node, gain) {
    this.nodes.add(node);
    node.onended = () => {
      this.nodes.delete(node);
      node.disconnect();
      gain.disconnect();
    };
  }

  tone(frequency, offset, duration, volume = 0.16, type = 'sine', endFrequency) {
    const context = this.context;
    const start = context.currentTime + offset;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain);
    gain.connect(this.output);
    this.track(oscillator, gain);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.01);
  }

  clap(offset, volume = 0.17) {
    const context = this.context;
    const duration = 0.12;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (context.sampleRate * 0.025));
    const source = context.createBufferSource();
    source.buffer = buffer;
    const gain = context.createGain();
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(this.output);
    this.track(source, gain);
    source.start(context.currentTime + offset);
    source.stop(context.currentTime + offset + duration);
  }

  ready() {
    return this.enabled && this.context && this.context.state === 'running';
  }

  correct() {
    this.stop();
    if (!this.ready()) return 0;
    try {
      // A quick, bright three-note sparkle. Speech starts after it has finished.
      [659.25, 830.61, 1046.5].forEach((note, i) => this.tone(note, i * 0.085, 0.22, 0.2));
      return 420;
    } catch { this.stop(); return 0; }
  }

  dance(seconds = 9) {
    this.stop();
    if (!this.ready()) return;
    try {
      const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 783.99];
      const beat = 0.3;
      for (let i = 0; i * beat + 0.24 < seconds; i++) {
        const offset = i * beat;
        this.tone(melody[i % melody.length], offset, 0.23, 0.15, 'triangle');
        if (i % 2 === 0) this.tone(125, offset, 0.12, 0.19, 'sine', 55);
        else {
          this.clap(offset, 0.2);
          this.clap(offset + 0.035, 0.09);
        }
      }
      // Friendly slide whistles and a tiny end-of-dance applause burst.
      this.tone(440, 0, 0.3, 0.12, 'sine', 880);
      if (seconds > 3) {
        this.tone(660, 3, 0.3, 0.1, 'sine', 990);
        this.tone(880, 6, 0.3, 0.1, 'sine', 440);
        for (let i = 0; i < 6; i++) this.clap(seconds - 0.8 + i * 0.1, 0.13);
      }
    } catch { this.stop(); }
  }
}
