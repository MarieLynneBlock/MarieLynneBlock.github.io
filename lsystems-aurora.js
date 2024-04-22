let auroraSketch = function(p) {
  let yPosNoiseOffset = 0;
  let maxWaveHeight = 7; // Max vertical movement for the base wave

  let auroraGreen = p.color(0, 255, 150); // Vibrant Aurora Green
  let auroraPurple = p.color(128, 0, 128); // Purple/Pink for the top

  // Starting axiom with an initial weight
  let axiom = { symbol: "A", weight: 2 };
  let sentence = [axiom];

  // Updated rules with dynamic stroke weights
  let rules = {
    "A": [
      { symbol: "A", weight: () => p.random(0.5, 3) }, // Random weight between 0.5 and 3
      { symbol: "B", weight: () => p.random(1, 4) }  // Random weight between 1 and 4
    ],
    "B": [
      { symbol: "A", weight: () => p.random(1, 4) } // Random weight between 1 and 4
    ]
  };

  function generate() {
    let nextSentence = [];

    for (let i = 0; i < sentence.length; i++) {
      let char = sentence[i].symbol;

      if (rules[char]) {
        let productions = rules[char];
        productions.forEach(production => {

          // Introduce a probability of skipping a production for a more natural effect
          if (p.random() > 0.1) {
            nextSentence.push({ symbol: production.symbol, weight: production.weight() });
          }
        });
      } else {
        nextSentence.push(sentence[i]);
      }
    }
    sentence = nextSentence;
  }

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
    setInterval(generate, 2000); // Evolve the L-system every 2 seconds
  };

  p.draw = function() {
    drawAurora();
  };

  function drawAurora() {
    let noiseScale = 0.1;
    let baseHeight = p.height * 0.5 - maxWaveHeight;

    p.background(0, 0, 0, 25); // Slight fade effect for motion blur

    let baselineOffsets = [];   // For the base wave across the screen
    let secondWaveOffsets = []; // For the second wave in the top right corner

    for (let i = 0; i < p.width; i += 10) {

      // First wave configuration
      let frequency = 0.004; // Frequency for the wave length
      let diagonalShift = i * 0.2; // Linearly increasing offset for diagonal effect
      let waveOffset = p.noise(i * noiseScale, yPosNoiseOffset) * maxWaveHeight; // Amplitude
      waveOffset += Math.sin(i * frequency) * maxWaveHeight * 10; // Sine wave for wavy effect
      waveOffset += diagonalShift; // Adding diagonal shift component
      baselineOffsets.push(baseHeight + waveOffset); // Position in the viewport

      // Second wave configuration
      let secondWaveFrequency = 0.009; // Frequency for the wave lenght
      let secondWaveDiagonalShift = (p.width - i) * 0.1; // Diagonal effect from right to left
      let secondWaveOffset = p.noise(i * noiseScale, yPosNoiseOffset + 1000) * maxWaveHeight * 0.5; // Noise offset and scale
      secondWaveOffset += Math.sin(i * secondWaveFrequency) * maxWaveHeight * 5; // Amplitude
      secondWaveOffset += secondWaveDiagonalShift; // Adding diagonal shift component
      secondWaveOffsets.push(p.height * 0.35 + secondWaveOffset); // Positioned higher in the viewport
    }

    for (let i = 0; i < p.width; i += 10) {
      let baseY = baselineOffsets[i / 10];         // Base wave y-position
      let secondBaseY = secondWaveOffsets[i / 10]; // Second wave y-position
      let lineHeight = p.map(p.noise(i * noiseScale, yPosNoiseOffset), 0, 1.5, 0, p.height - 2);

      // Gradient colours for the Aurora effect
      for (let j = 0; j < lineHeight; j++) {
        let gradientRatio = j / lineHeight;
        let interColor = p.lerpColor(auroraGreen, auroraPurple, gradientRatio);
        let alpha = p.map(j, 0, lineHeight, 255, 0);

        let strokeIndex = Math.floor(i / 10) % sentence.length;
        let strokeWeight = sentence[strokeIndex].weight;

        // Drawing the waves
        p.stroke(p.red(interColor), p.green(interColor), p.blue(interColor), alpha);
        p.strokeWeight(strokeWeight);
        p.line(i, baseY - j, i, baseY - (j - 1)); // Drawing the first wave

        if (secondBaseY - j > 0 && secondBaseY - j < p.height) {
          p.line(i, secondBaseY - j, i, secondBaseY - (j - 1)); // Drawing the second wave
        }
      }
    }

    yPosNoiseOffset += 0.01; // Perlin Noise for dynamic effect
  }
};

new p5(auroraSketch, 'aurora-canvas');
