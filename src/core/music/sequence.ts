import { Note } from "./note";

export class Sequence {
  private ac: AudioContext;
  tempo: number;
  notes: Note[] = [];
  loop = true;
  smoothing = 0;
  staccato = 0;
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

    if (notes) {
      this.push(...notes);
    }
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
    notes.forEach((note) => {
      this.notes.push(note instanceof Note ? note : new Note(note));
    });
  }

  private createOscillator() {
    this.stop();
    this.osc = this.ac.createOscillator();
    this.osc.type = this.waveType;
    this.osc.connect(this.gain);
  }

  private scheduleNote(index: number, when: number): number {
    const duration = (60 / this.tempo) * this.notes[index].duration;
    const cutoff = duration * (1 - (this.staccato || 0.00000000001));

    this.setFrequency(this.notes[index].frequency, when);

    if (this.smoothing && this.notes[index].frequency) {
      this.slide(index, when, cutoff);
    }

    this.setFrequency(0, when + cutoff);
    return when + duration;
  }

  private getNextNote(index: number): Note {
    return this.notes[index < this.notes.length - 1 ? index + 1 : 0];
  }

  private getSlideStartDelay(duration: number): number {
    return duration - Math.min(duration, (60 / this.tempo) * this.smoothing);
  }

  private slide(index: number, when: number, cutoff: number) {
    const next = this.getNextNote(index);
    const start = this.getSlideStartDelay(cutoff);
    this.setFrequency(this.notes[index].frequency, when + start);
    this.rampFrequency(next.frequency, when + cutoff);
  }

  private setFrequency(freq: number, when: number) {
    this.osc?.frequency.setValueAtTime(freq, when);
  }

  private rampFrequency(freq: number, when: number) {
    this.osc?.frequency.linearRampToValueAtTime(freq, when);
  }

  connect(destination: AudioNode) {
    this.dry.connect(destination);
    this.wet.connect(destination);
  }

  play(when: number = this.ac.currentTime) {
    this.createOscillator();
    this.osc!.start(when);

    this.notes.forEach((_, i) => {
      when = this.scheduleNote(i, when);
    });

    this.osc!.stop(when);
    this.osc!.onended = this.loop ? () => this.play(when) : null;
  }

  stop() {
    if (this.osc) {
      this.osc.onended = null;
      this.osc.stop();
      this.osc.frequency.cancelScheduledValues(0);
      this.osc = null;
    }
  }
}
