class AudioEngine {
  private ctx: AudioContext | null = null;
  private static instance: AudioEngine | null = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new AudioEngine();
    }
    return this.instance;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTick() {
    if (!this.ctx) return;
    
    // Wooden tapping percussive sound
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playCountdownTick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playCheer() {
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    // Celebratory magical arpeggio (C Major Synth)
    const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    
    frequencies.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = now + (i * 0.06); // Quick sweep
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.5);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 2.5);
    });

    // Subtly synthesize fireworks/sparkles using noise
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 4000;
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.05, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    noise.start(now);
  }
}

const audio = AudioEngine.getInstance();
export default audio;
