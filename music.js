// create the audio context
var ac =
    typeof AudioContext !== "undefined"
      ? new AudioContext()
      : new webkitAudioContext(),
  // get the current Web Audio timestamp (this is when playback should begin)
  when = ac.currentTime,
  // set the tempo
  tempo = 166,
  // initialize some vars
  sequence1,
  sequence2,
  sequence3,
  // create an array of "note strings" that can be passed to a sequence
  lead = [
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
  ],
  harmony = [
    "F#3 w",
    "F#3 w",
    "B2 w",
    "C#3 w",
    // Repeat
    "F#3 w",
    "F#3 w",
    "B2 w",
    "C#3 w",
    // Next
    "A3 w",
    "A3 w",
    "E3 w",
    "F#3 w",
    // Next
    "A3 w",
    "A3 w",
    "E3 w",
    "F#3 w",
  ],
  bass = [
    "F#2 h",
    "F#2 h",
    "F#2 h",
    "F#2 h",
    "B1 h",
    "B1 h",
    "C#2 h",
    "C#2 h",
    // Repeat
    "F#2 h",
    "F#2 h",
    "F#2 h",
    "F#2 h",
    "B1 h",
    "B1 h",
    "C#2 h",
    "C#2 h",
    // Next
    "A2 h",
    "A2 h",
    "A2 h",
    "A2 h",
    "E2 h",
    "E2 h",
    "F#2 h",
    "F#2 h",
    "A2 h",
    "A2 h",
    "A2 h",
    "A2 h",
    "E2 h",
    "E2 h",
    "F#2 h",
    "F#2 h",
  ];

// create 3 new sequences (one for lead, one for harmony, one for bass)
sequence1 = new TinyMusic.Sequence(ac, tempo, lead);
sequence2 = new TinyMusic.Sequence(ac, tempo, harmony);
sequence3 = new TinyMusic.Sequence(ac, tempo, bass);

// set staccato and smoothing values for maximum coolness
sequence1.staccato = 0.3;
sequence1.smoothing = 0.02;
// sequence2.staccato = 0.55;
sequence3.staccato = 0.1;
sequence3.smoothing = 0.2;

// adjust the levels so the bass and harmony aren't too loud
sequence1.gain.gain.value = 1.0 / 2;
sequence2.gain.gain.value = 0.9 / 2;
sequence3.gain.gain.value = 0.75 / 2;

var beatLength = 60 / tempo;
var noteDuration = beatLength * 4; // for 'w'

// Wave
sequence1.createCustomWave([-0.8, 1, 0.8, 0.8, -0.8, -0.8, -1]);
sequence2.waveType = "sawtooth";

// apply EQ settings
// sequence1.mid.frequency.value = 800;
// sequence1.mid.gain.value = 3;
// sequence2.mid.frequency.value = 1200;
// sequence3.mid.gain.value = 3;
// sequence3.bass.gain.value = 6;
// sequence3.bass.frequency.value = 80;
// sequence3.mid.gain.value = -6;
// sequence3.mid.frequency.value = 500;
// sequence3.treble.gain.value = -2;
// sequence3.treble.frequency.value = 1400;

// play
document.querySelector("#play").addEventListener(
  "click",
  function () {
    when = ac.currentTime;
    //   //start the lead part immediately
    sequence1.play(when);
    //   // delay the harmony by 16 beats
    sequence2.play(when + (60 / tempo) * 64);
    //     sequence2.play( when );
    // start the bass part immediately
    sequence3.play(when);
  },
  false
);

// pause
document.querySelector("#stop").addEventListener(
  "click",
  function () {
    sequence1.stop();
    sequence2.stop();
    sequence3.stop();
  },
  false
);
