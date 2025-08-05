import { Sequence } from "./sequence";

export class Music {
  private ac: AudioContext;
  private output: GainNode;
  private compressor: DynamicsCompressorNode;
  private tempo = 115;
  private volume = 0.15;

  lead: Sequence;
  bass: Sequence;
  isPlaying = false;

  constructor() {
    this.ac = new AudioContext();
    this.output = this.ac.createGain();
    this.compressor = this.ac.createDynamicsCompressor();

    this.output.connect(this.ac.destination);
    this.output.gain.value = this.volume;

    this.compressor.ratio.value = 4;
    this.compressor.threshold.value = -12;
    this.compressor.connect(this.output);

    this.lead = new Sequence(this.ac, this.tempo, [
      "F#4 e",
      "C#5 q",
      "F#4 q",
      "E5 q",
      "F#4 e",
      "E5 q",
      "C#5 e",
      "F#5 h",
      // Repeat
      "F#4 q",
      "C#5 q",
      "F#4 q",
      "E5 q",
      "- q",
      "G#4 q",
      "A4 q",
      "B4 q",
      // Repeat
      "F#4 q",
      "C#5 q",
      "F#4 q",
      "E5 q",
      "- q",
      "E5 q",
      "C#5 q",
      "F#5 q",
      // Repeat
      "F#4 q",
      "C#5 q",
      "F#4 q",
      "E5 q",
      "- q",
      "G#4 q",
      "A4 q",
      "F#4 q",
      // Next
      "A4 q",
      "E5 q",
      "A4 q",
      "G5 q",
      "- q",
      "E5 q",
      "G5 q",
      "A5 q",
      // Next
      "A4 q",
      "E5 q",
      "A4 q",
      "G5 q",
      "- q",
      "C5 q",
      "E5 q",
      "C5 q",
      // Next
      "A4 q",
      "E5 q",
      "A4 q",
      "G5 q",
      "- q",
      "E5 q",
      "G5 q",
      "A5 q",
      // Next
      "A4 q",
      "E5 q",
      "A4 q",
      "G5 q",
      "A5 q",
      "G5 q",
      "F5 q",
      "D5 q",
    ]);

    this.bass = new Sequence(this.ac, this.tempo, [
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "B1 q",
      "B1 q",
      "B1 q",
      "B1 q",
      "C#2 q",
      "C#2 q",
      "C#2 q",
      "C#2 q",
      // Repeat
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "B1 q",
      "B1 q",
      "B1 q",
      "B1 q",
      "C#2 q",
      "C#2 q",
      "C#2 q",
      "C#2 q",
      // Next
      "A2 q",
      "A2 q",
      "A2 q",
      "A2 q",
      "A2 q",
      "A2 q",
      "A2 q",
      "A2 q",
      "E2 q",
      "E2 q",
      "E2 q",
      "E2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "A2 q",
      "A2 q",
      "A2 q",
      "A2 q",
      "A2 q",
      "A2 q",
      "A2 q",
      "A2 q",
      "E2 q",
      "E2 q",
      "E2 q",
      "E2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
      "F#2 q",
    ]);

    this.lead.staccato = 0.1;
    this.lead.smoothing = 0;
    this.lead.waveType = "sine";

    this.bass.staccato = 0.1;
    this.bass.smoothing = 0.2;
    this.bass.waveType = "square";

    this.lead.connect(this.compressor);
    this.bass.connect(this.compressor);
  }

  play() {
    if (this.isPlaying) return;
    const now = this.ac.currentTime;
    this.lead.play(now);
    this.bass.play(now);
    this.isPlaying = true;
  }

  stop() {
    this.lead.stop();
    this.bass.stop();
    this.isPlaying = false;
  }
}
