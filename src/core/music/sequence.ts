import { Note } from "./note";

export class Sequence {
  private ac: AudioContext;
  tempo: number;
  notes: Note[] = [];
  loop = true;
  smoothing = 0; // seconds of portamento (max)
  staccato = 0; // 0..1 fraction of note length to be silent
  waveType: OscillatorType = "square";

  private osc: OscillatorNode | null = null;
  private gain: GainNode;
  private dry: GainNode;
  private wet: GainNode;
  private filters: BiquadFilterNode[] = [];

  constructor(ac: AudioContext, tempo = 120, notes?: (Note | string)[]) {
    this.ac = ac;
    this.tempo = tempo;
    this.gain = this.ac.createGain();
    this.dry = this.ac.createGain();
    this.wet = this.ac.createGain();
    this.createFxNodes();

    if (notes) this.push(...notes);
  }

  private createFxNodes() {
    const eqConfig: [string, number][] = [
      ["bass", 100],
      ["mid", 1000],
      ["treble", 2500],
    ];

    let prev: AudioNode = this.gain;
    eqConfig.forEach(([_, freq]) => {
      const filter = this.ac.createBiquadFilter();
      filter.type = "peaking";
      filter.frequency.value = freq;
      prev.connect(filter);
      prev = filter;
      this.filters.push(filter);
    });

    prev.connect(this.wet);
    prev.connect(this.dry);
  }

  push(...notes: (Note | string)[]) {
    notes.forEach((n) => this.notes.push(n instanceof Note ? n : new Note(n)));
  }

  connect(destination: AudioNode) {
    this.dry.connect(destination);
    this.wet.connect(destination);
  }

  private createOscillator() {
    this.stop(); // clean previous
    this.osc = this.ac.createOscillator();
    this.osc.type = this.waveType;
    this.osc.connect(this.gain);
  }

  private secsPerBeat() {
    return 60 / this.tempo;
  }

  private getNextPlayableNote(index: number): Note | null {
    for (let i = 1; i <= this.notes.length; i++) {
      const n = this.notes[(index + i) % this.notes.length];
      if (n.frequency > 0) return n;
    }
    return null;
  }

  private scheduleNote(index: number, when: number): number {
    const n = this.notes[index];
    const spb = this.secsPerBeat();
    const duration = spb * n.duration;

    // gate portion (note length portion that is "on")
    const gate = duration * (1 - (this.staccato || 1e-10));

    // small envelope constants to avoid clicks
    const attack = 0.003;
    const release = 0.012;

    // cancel stale automation from this time onward
    this.gain.gain.cancelScheduledValues(when);
    this.osc!.frequency.cancelScheduledValues(when);

    if (n.frequency > 0) {
      // NOTE ON
      this.osc!.frequency.setValueAtTime(n.frequency, when);

      // Gain envelope
      this.gain.gain.setValueAtTime(0, when);
      this.gain.gain.linearRampToValueAtTime(1, when + attack);
      // hold
      this.gain.gain.setValueAtTime(1, when + Math.max(attack, gate - release));
      // release to silence
      this.gain.gain.linearRampToValueAtTime(0, when + gate);

      // Portamento into next playable note (not into rests)
      if (this.smoothing > 0) {
        const next = this.getNextPlayableNote(index);
        if (next) {
          const slideWindow = Math.min(gate, this.smoothing);
          const slideStart = gate - slideWindow;
          this.osc!.frequency.setValueAtTime(n.frequency, when + slideStart);
          this.osc!.frequency.linearRampToValueAtTime(
            next.frequency,
            when + gate
          );
        }
      }
    } else {
      // REST: ensure gate is closed cleanly
      const current = this.gain.gain.value;
      this.gain.gain.setValueAtTime(current, when);
      this.gain.gain.linearRampToValueAtTime(0, when + 0.005);
      // No frequency scheduling on rests (prevents 0 Hz pops)
    }

    return when + duration;
  }

  play(when: number = this.ac.currentTime) {
    if (this.notes.length === 0) return;

    this.createOscillator();

    // start silent to avoid initial click
    this.gain.gain.setValueAtTime(0, when);
    this.osc!.start(when);

    let t = when;
    for (let i = 0; i < this.notes.length; i++) {
      t = this.scheduleNote(i, t);
    }

    // ensure tail is silent before stopping
    const stopAt = t + 0.02;
    this.gain.gain.setValueAtTime(0, t);
    this.osc!.stop(stopAt);

    this.osc!.onended = this.loop ? () => this.play(t) : null;
  }

  stop() {
    if (this.osc) {
      try {
        this.osc.onended = null;
        const now = this.ac.currentTime;
        this.gain.gain.cancelScheduledValues(now);
        this.gain.gain.setValueAtTime(this.gain.gain.value, now);
        this.gain.gain.linearRampToValueAtTime(0, now + 0.01);
        this.osc.frequency.cancelScheduledValues(now);
        this.osc.stop(now + 0.02);
      } catch {}
      this.osc = null;
    }
  }
}
