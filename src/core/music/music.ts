import { Sequence } from "./sequence";
import { DrumSynth } from "./drumSynth";

export class Music {
  private ac: AudioContext;
  private output: GainNode;
  private compressor: DynamicsCompressorNode;
  private tempo = 174;
  private volume = 0.1;

  private currentStep = 0;
  private schedulerId: number | null = null;
  private scheduleAheadTime = 0.1; // 100ms lookahead
  private stepLength: number;

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
      ...coreLead,
      ...coreLead,
      ...offLead,
    ]);
    this.lead.staccato = 0.2;
    this.lead.smoothing = 0.05;
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
    this.bass.smoothing = 0.8;
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
    this.lead.play(now);
    this.bass.play(now);

    const schedule = () => {
      const now = this.ac.currentTime;

      while (
        this.currentStep * this.stepLength <
        now + this.scheduleAheadTime
      ) {
        const stepTime = this.currentStep * this.stepLength;

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

        this.currentStep++;
      }

      this.schedulerId = window.setTimeout(schedule, 25);
    };

    schedule();
  }

  stop() {
    this.lead.stop();
    this.bass.stop();
    this.isPlaying = false;
    if (this.schedulerId) clearTimeout(this.schedulerId);
    this.currentStep = 0;
  }
}
