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
  drumPattern: number[] = [0, 2, 4, 6, 8, 10, 12, 14]; // kick on 0, snare on 4, hihat on all
  isPlaying = false;

  atmosPad: OscillatorNode;
  atmosGain: GainNode;
  atmosLFO: OscillatorNode;
  atmosLFOGain: GainNode;

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

    // --- Atmospheric pad ---
    this.atmosPad = this.ac.createOscillator();
    this.atmosGain = this.ac.createGain();
    this.atmosPad.type = "sine";
    this.atmosGain.gain.value = 3; // soft volume

    // Use B minor notes for pad (subtle, slow glide)
    this.atmosPad.frequency.value = 246.94; // start on B3

    // LFO for slow modulation, scaled by tempo
    this.atmosLFO = this.ac.createOscillator();
    this.atmosLFOGain = this.ac.createGain();
    this.atmosLFO.type = "sine";
    this.atmosLFO.frequency.value = (this.tempo / 174) * 0.5; // mod speed scales with tempo
    this.atmosLFOGain.gain.value = 6; // ±4Hz frequency swing
    this.atmosLFO.connect(this.atmosLFOGain).connect(this.atmosPad.frequency);

    this.atmosPad.connect(this.atmosGain);
    this.atmosGain.connect(this.compressor);

    // this.atmosLFO.start();

    // Lead
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

    this.lead.staccato = 0.2; // nice short beep
    this.lead.smoothing = 0.05; // no glide, clean
    this.lead.waveType = "sine";

    this.bass = new Sequence(this.ac, this.tempo, [
      "B1 w",
      "B1 w",
      "D2 w",
      "D2 w",
    ]);
    this.bass.staccato = 0;
    this.bass.smoothing = 0.8;
    this.bass.waveType = "triangle";
    const bassGain = this.ac.createGain();
    bassGain.gain.value = 2.0;

    this.bass.connect(bassGain);
    bassGain.connect(this.compressor);

    this.lead.connect(this.compressor);

    // Connect to compressor/output
    this.atmosPad.connect(this.atmosGain);
    this.atmosGain.connect(this.compressor);

    this.stepLength = 60 / this.tempo / 4;
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    const now = this.ac.currentTime;
    this.lead.play(now);
    this.bass.play(now);
    // this.atmosPad.start();

    const schedule = () => {
      const now = this.ac.currentTime;

      while (
        this.currentStep * this.stepLength <
        now + this.scheduleAheadTime
      ) {
        const stepTime =
          this.currentStep * this.stepLength +
          (this.currentStep % 2 ? 0.02 : 0);

        // HiHat every 16th
        this.drumSynth.playHiHat(stepTime);

        // Kick
        if (this.currentStep % 16 === 0 || this.currentStep % 16 === 8)
          this.drumSynth.playKick(stepTime);

        // Snare
        if (this.currentStep % 16 === 4 || this.currentStep % 16 === 12)
          this.drumSynth.playSnare(stepTime);

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
