import { Sequence } from "./sequence";
import { DrumSynth } from "./drumSynth";

export class MusicPlayer {
  private ac: AudioContext;
  private output: GainNode;
  private compressor: DynamicsCompressorNode;
  private tempo = 174;
  private volume = 0.1;

  private currentStep = 0;
  private schedulerId: number | null = null;
  private scheduleAheadTime = 0.1; // 100ms lookahead
  private stepLength: number;

  private atmosOscs: OscillatorNode[] = [];
  private atmosGains: GainNode[] = [];

  lead: Sequence;
  bass: Sequence;
  drumSynth: DrumSynth;
  isPlaying = false;

  constructor() {
    this.ac = new AudioContext();
    this.output = this.ac.createGain();
    this.compressor = this.ac.createDynamicsCompressor();
    this.drumSynth = new DrumSynth(this.ac, this.compressor);

    this.output.connect(this.ac.destination);
    this.output.gain.value = this.volume;

    this.compressor.ratio.value = 4;
    this.compressor.threshold.value = -12;
    this.compressor.connect(this.output);

    // --- Lead ---
    const coreLead = [
      "D4 q",
      "A4 q",
      "B3 q",
      "- q",
      "- q",
      "- q",
      "- q",
      "- q",
    ];
    const offLead = ["D4 q", "E4 q", "B3 q", "- q", "- q", "- q", "- q", "- q"];
    this.lead = new Sequence(this.ac, this.tempo, [
      ...coreLead,
      "- f",
      ...offLead,
      "- f",
    ]);
    this.lead.staccato = 0.2;
    this.lead.smoothing = 0.2;
    this.lead.waveType = "sine";
    this.lead.connect(this.compressor);

    // --- Bass ---
    this.bass = new Sequence(this.ac, this.tempo, [
      "B1 h",
      "- h",
      "B1 h",
      "- h",
      "D2 h",
      "- h",
      "D2 h",
      "- h",
    ]);
    this.bass.staccato = 0;
    this.bass.smoothing = 0;
    this.bass.waveType = "triangle";
    const bassGain = this.ac.createGain();
    bassGain.gain.value = 1.5;

    this.bass.connect(bassGain);
    bassGain.connect(this.compressor);

    this.stepLength = 60 / this.tempo / 4;
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    const now = this.ac.currentTime;
    const barLength = (60 / this.tempo) * 4;

    this.lead.play(now + barLength * 8);
    this.bass.play(now);

    // --- Atmos Pad 1 (B) ---
    const bOsc = this.ac.createOscillator();
    bOsc.type = "sine";
    bOsc.frequency.value = 246.94; // B3
    const bGain = this.ac.createGain();
    bGain.gain.value = 0;
    bOsc.connect(bGain).connect(this.compressor);
    bOsc.start();

    // Fade-in B pad
    bGain.gain.setValueAtTime(0, now + barLength * 64); // 16 bars
    bGain.gain.linearRampToValueAtTime(0.3, now + barLength * 64); // fade in over 4 bars

    this.atmosOscs.push(bOsc);
    this.atmosGains.push(bGain);

    // --- Atmos Pad 2 (D) ---
    const dOsc = this.ac.createOscillator();
    dOsc.type = "sine";
    dOsc.frequency.value = 293.66; // D4
    const dGain = this.ac.createGain();
    dGain.gain.value = 0;
    dOsc.connect(dGain).connect(this.compressor);
    dOsc.start();

    // Fade-in D pad after the first B pad
    dGain.gain.setValueAtTime(0, now + barLength * 80); // 2 bars after B pad starts
    dGain.gain.linearRampToValueAtTime(0.3, now + barLength * 64); // fade in over 4 bars

    this.atmosOscs.push(dOsc);
    this.atmosGains.push(dGain);

    const schedule = () => {
      const now = this.ac.currentTime;

      while (
        this.currentStep * this.stepLength <
        now + this.scheduleAheadTime
      ) {
        const stepTime = this.currentStep * this.stepLength;

        // Only start drums after 16 bars
        if (this.currentStep >= 256) {
          // Reduced hi-hat: play only on selected steps for swing
          if ([0, 3, 6, 10, 12, 15].includes(this.currentStep % 16)) {
            this.drumSynth.playHiHat(stepTime);
          }

          // Kick pattern with slight swing
          if ([0, 7, 11].includes(this.currentStep % 16)) {
            this.drumSynth.playKick(stepTime);
          }

          // Snare on 4 and 12 (classic DnB break)
          if ([4, 12].includes(this.currentStep % 16)) {
            this.drumSynth.playSnare(stepTime);
          }
        }

        this.currentStep++;
      }

      this.schedulerId = window.setTimeout(schedule, 25);
    };

    schedule();
  }

  stop() {
    this.lead.stop();
    this.bass.stop();
    // Stop all atmospheric pads
    this.atmosOscs.forEach((osc, i) => {
      const gain = this.atmosGains[i];
      const now = this.ac.currentTime;

      // Fade out the pad quickly to avoid clicks
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);

      // Stop the oscillator shortly after fade
      osc.stop(now + 0.06);
    });

    this.atmosOscs = [];
    this.atmosGains = [];

    this.isPlaying = false;
    if (this.schedulerId) clearTimeout(this.schedulerId);
    this.currentStep = 0;
  }

  playExplosionSound() {
    const ac = this.ac;
    const now = ac.currentTime;

    // --- White noise burst ---
    const bufferSize = ac.sampleRate * 0.5; // longer: 500ms
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ac.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 400; // cut mud, keep it crisp

    const noiseGain = ac.createGain();
    noiseGain.gain.setValueAtTime(2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(noiseFilter).connect(noiseGain).connect(this.compressor);

    // --- Low-end thump (oscillator) ---
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.5); // pitch dive

    const oscGain = ac.createGain();
    oscGain.gain.setValueAtTime(2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(oscGain).connect(this.compressor);

    // --- Start everything ---
    noise.start(now);
    noise.stop(now + 0.5);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  playMenuSuccess() {
    const ac = this.ac;
    const now = ac.currentTime;

    const notes = [880, 1174, 1568]; // A5 -> D6 -> G6 (ascending triad)

    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      osc.type = "sine"; // sweet & clean
      osc.frequency.value = freq;

      const gain = ac.createGain();
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.5, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);

      osc.connect(gain).connect(this.compressor);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.6);
    });
  }

  playTakeDamage() {
    const ac = this.ac;
    const now = ac.currentTime;

    const osc = ac.createOscillator();
    osc.type = "square"; // harsh
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.15); // quick drop

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain).connect(this.compressor);

    osc.start(now);
    osc.stop(now + 0.15);
  }
}
