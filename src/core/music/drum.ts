export function playKick(ac: AudioContext, time: number) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);

  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

  osc.connect(gain).connect(ac.destination);
  osc.start(time);
  osc.stop(time + 0.3);
}

export function playSnare(ac: AudioContext, time: number) {
  const noiseBuffer = ac.createBuffer(1, ac.sampleRate * 0.2, ac.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const noise = ac.createBufferSource();
  noise.buffer = noiseBuffer;

  const noiseFilter = ac.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 1000;

  const gain = ac.createGain();
  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

  noise.connect(noiseFilter).connect(gain).connect(ac.destination);
  noise.start(time);
  noise.stop(time + 0.2);
}
