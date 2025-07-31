import { playKick, playSnare } from "./drum";
import { Sequence } from "./sequence";

export class Music {
  private ac: AudioContext;
  private output: GainNode;
  private compressor: DynamicsCompressorNode;
  private tempo = 220;
  private volume = 0.5;

  lead: Sequence;
  harmony: Sequence;
  bass: Sequence;

  constructor() {
    this.ac = new AudioContext();
    this.output = this.ac.createGain();
    this.compressor = this.ac.createDynamicsCompressor();

    this.output.connect(this.ac.destination);
    this.output.gain.value = this.volume;

    this.compressor.ratio.value = 4;
    this.compressor.threshold.value = -12;
    this.compressor.connect(this.output);

    // this.lead = new Sequence(this.ac, this.tempo, [
    //   "F#4 q",
    //   "C#5 q",
    //   "F#4 q",
    //   "E5 q",
    //   "- q",
    //   "E5 q",
    //   "C#5 q",
    //   "F#5 q",
    //   // Repeat
    //   "F#4 q",
    //   "C#5 q",
    //   "F#4 q",
    //   "E5 q",
    //   "- q",
    //   "G#4 q",
    //   "A4 q",
    //   "B4 q",
    //   // Repeat
    //   "F#4 q",
    //   "C#5 q",
    //   "F#4 q",
    //   "E5 q",
    //   "- q",
    //   "E5 q",
    //   "C#5 q",
    //   "F#5 q",
    //   // Repeat
    //   "F#4 q",
    //   "C#5 q",
    //   "F#4 q",
    //   "E5 q",
    //   "- q",
    //   "G#4 q",
    //   "A4 q",
    //   "F#4 q",
    //   // Next
    //   "A4 q",
    //   "E5 q",
    //   "A4 q",
    //   "G5 q",
    //   "- q",
    //   "E5 q",
    //   "G5 q",
    //   "A5 q",
    //   // Next
    //   "A4 q",
    //   "E5 q",
    //   "A4 q",
    //   "G5 q",
    //   "- q",
    //   "C5 q",
    //   "E5 q",
    //   "C5 q",
    //   // Next
    //   "A4 q",
    //   "E5 q",
    //   "A4 q",
    //   "G5 q",
    //   "- q",
    //   "E5 q",
    //   "G5 q",
    //   "A5 q",
    //   // Next
    //   "A4 q",
    //   "E5 q",
    //   "A4 q",
    //   "G5 q",
    //   "A5 q",
    //   "G5 q",
    //   "F5 q",
    //   "D5 q",
    // ]);

    // this.harmony = new Sequence(this.ac, this.tempo, [
    //   "F#3 w",
    //   "F#3 w",
    //   "B2 w",
    //   "C#3 w",
    //   // Repeat
    //   "F#3 w",
    //   "F#3 w",
    //   "B2 w",
    //   "C#3 w",
    //   // Next
    //   "A3 w",
    //   "A3 w",
    //   "E3 w",
    //   "F#3 w",
    //   // Next
    //   "A3 w",
    //   "A3 w",
    //   "E3 w",
    //   "F#3 w",
    // ]);

    // this.bass = new Sequence(this.ac, this.tempo, [
    //   "F#2 h",
    //   "F#2 h",
    //   "F#2 h",
    //   "F#2 h",
    //   "B1 h",
    //   "B1 h",
    //   "C#2 h",
    //   "C#2 h",
    //   // Repeat
    //   "F#2 h",
    //   "F#2 h",
    //   "F#2 h",
    //   "F#2 h",
    //   "B1 h",
    //   "B1 h",
    //   "C#2 h",
    //   "C#2 h",
    //   // Next
    //   "A2 h",
    //   "A2 h",
    //   "A2 h",
    //   "A2 h",
    //   "E2 h",
    //   "E2 h",
    //   "F#2 h",
    //   "F#2 h",
    //   "A2 h",
    //   "A2 h",
    //   "A2 h",
    //   "A2 h",
    //   "E2 h",
    //   "E2 h",
    //   "F#2 h",
    //   "F#2 h",
    // ]);

    // this.lead.staccato = 0.3;
    // this.lead.smoothing = 0.02;
    // this.bass.staccato = 0.1;
    // this.bass.smoothing = 0.2;
    // this.bass.waveType = "sawtooth";

    // this.lead.connect(this.compressor);
    // this.harmony.connect(this.compressor);
    // this.bass.connect(this.compressor);

    this.lead = new Sequence(this.ac, this.tempo, [
      "A4 h",
      "- q",
      "C5 q",
      "- h",
      "E5 h",
      "- q",
      "G5 q",
      "- h",
      "F#5 h",
      "- q",
      "E5 q",
      "- h",
      "D5 h",
      "- q",
      "A4 q",
      "- h",

      // second half variation
      "C5 h",
      "- q",
      "E5 q",
      "- h",
      "G5 h",
      "- q",
      "A5 q",
      "- h",
      "F#5 h",
      "- q",
      "E5 q",
      "- h",
      "D5 h",
      "- q",
      "A4 q",
      "- h",
    ]);
    this.lead.staccato = 0.2;
    this.lead.smoothing = 0.05;
    this.lead.waveType = "triangle";

    this.harmony = new Sequence(this.ac, this.tempo, [
      "F#3 w",
      "B2 w",
      "C#3 w",
      "A3 w",
      "F#3 w",
      "B2 w",
      "C#3 w",
      "A3 w",
    ]);
    this.harmony.waveType = "sine";
    this.harmony.smoothing = 0.3;

    this.bass = new Sequence(this.ac, this.tempo, [
      "F#2 h",
      "F#2 h",
      "B1 h",
      "C#2 h",
      "A1 h",
      "A1 h",
      "E2 h",
      "F#2 h",
    ]);
    this.bass.waveType = "sawtooth";
    this.bass.staccato = 0.05;
    this.bass.smoothing = 0.3;

    this.lead.connect(this.compressor);
    this.harmony.connect(this.compressor);
    this.bass.connect(this.compressor);
  }

  play() {
    const now = this.ac.currentTime;
    this.lead.play(now);
    this.bass.play(now);
    this.harmony.play(now);

    const start = this.ac.currentTime;
    for (let bar = 0; bar < 16; bar++) {
      const t = start + bar * (60 / this.tempo) * 4; // 4 beats per bar
      playKick(this.ac, t);
      playSnare(this.ac, t + 1);
      playKick(this.ac, t + 2);
      playSnare(this.ac, t + 3);
    }
  }

  stop() {
    this.lead.stop();
    this.bass.stop();
    this.harmony.stop();
  }
}
