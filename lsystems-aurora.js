const auroraSketch = (p) => {
  let yPosNoiseOffset = 0; // Offset for noise function to animate vertical movement
  let maxWaveHeight = 7; // Maximum height for aurora wave
  let auroraGreen, auroraPurple; // Colours for aurora
  let sentence = [{ symbol: "A", weight: 2 }]; // Initial axiom with weight
  let stars = []; // Array to hold star objects
  const maxStars = 100; // Max number of stars for performance
  const noiseScale = 0.1; // Scale for noise function
  const intervalID = setInterval(generate, 2000); // Interval to generate new sentence

  const rules = {
    "A": [
      { symbol: "A", weight: () => p.random(0.5, 3) },
      { symbol: "B", weight: () => p.random(1, 4) }
    ],
    "B": [
      { symbol: "A", weight: () => p.random(1, 4) }
    ]
  };

  const starRules = {
    "S": [
      { transform: star => ({ symbol: "S", ...star, brightness: Math.max(star.brightness - 2, 50), lifespan: star.lifespan - 5 }) },
      { transform: star => ({ symbol: "S", x: p.random(p.width), y: p.random(p.height * 0.6, p.height), size: p.random(1, 3), brightness: p.random(150, 255), lifespan: 300 }) }
    ]
  };

  /**
   * p5.js setup function. Initialises canvas and pre-generates stars.
   */
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent("aurora-canvas");
    auroraGreen = p.color(0, 255, 150);
    auroraPurple = p.color(128, 0, 128);
    p.noLoop();
    drawGradientBackground();
    setInterval(generateStars, 1000);
    for (let i = 0; i < 50; i++) generateStars();
    p.loop();
  };

  /**
   * p5.js draw function. Continuously draws background, aurora, and stars.
   */
  p.draw = () => {
    drawGradientBackground();
    drawAurora();
    drawStars();
  };

  /**
   * Draws a gradient background from black to polar night colour.
   */
  function drawGradientBackground() {
    const polarNight = p.color(36, 41, 51);
    const black = p.color(0, 0, 0);
    for (let y = 0; y < p.height; y++) {
      const lerpRatio = p.map(y, 0, p.height, 0, 1);
      const gradientColor = p.lerpColor(black, polarNight, lerpRatio);
      p.stroke(gradientColor);
      p.line(0, y, p.width, y);
    }
  }

  /**
   * Draws the aurora using noise and sine functions for vertical offsets.
   */
  function drawAurora() {
    const baseHeight = p.height * 0.5 - maxWaveHeight;
    const baselineOffsets = [];
    const secondWaveOffsets = [];

    for (let i = 0; i < p.width; i += 10) {
      const waveOffset = p.noise(i * noiseScale, yPosNoiseOffset) * maxWaveHeight + Math.sin(i * 0.004) * maxWaveHeight * 10 + i * 0.2;
      baselineOffsets.push(baseHeight + waveOffset);
      const secondWaveOffset = p.noise(i * noiseScale, yPosNoiseOffset + 1000) * maxWaveHeight * 0.5 + Math.sin(i * 0.009) * maxWaveHeight * 5 + (p.width - i) * 0.1;
      secondWaveOffsets.push(p.height * 0.35 + secondWaveOffset);
    }

    for (let i = 0; i < p.width; i += 10) {
      const baseY = baselineOffsets[i / 10];
      const secondBaseY = secondWaveOffsets[i / 10];
      const lineHeight = p.map(p.noise(i * noiseScale, yPosNoiseOffset), 0, 1.5, 0, p.height - 2);

      for (let j = 0; j < lineHeight; j++) {
        const gradientRatio = j / lineHeight;
        const interColor = p.lerpColor(auroraGreen, auroraPurple, gradientRatio);
        const alpha = p.map(j, 0, lineHeight, 255, 0);
        const strokeIndex = Math.floor(i / 10) % sentence.length;
        const strokeWeight = sentence[strokeIndex].weight;

        p.stroke(p.red(interColor), p.green(interColor), p.blue(interColor), alpha);
        p.strokeWeight(strokeWeight);
        p.line(i, baseY - j, i, baseY - (j - 1));
        if (secondBaseY - j > 0 && secondBaseY - j < p.height) {
          p.line(i, secondBaseY - j, i, secondBaseY - (j - 1));
        }
      }
    }

    yPosNoiseOffset += 0.01;
  }

  /**
   * Generates the next "sentence" based on defined rules.
   */
  function generate() {
    let nextSentence = [];
    for (let i = 0; i < sentence.length; i++) {
      const char = sentence[i].symbol;
      if (rules[char]) {
        rules[char].forEach(production => {
          if (p.random() > 0.1) nextSentence.push({ symbol: production.symbol, weight: production.weight() });
        });
      } else {
        nextSentence.push(sentence[i]);
      }
    }
    sentence = nextSentence;
  }

  /**
   * Updates stars according to star rules.
   */
  function generateStars() {
    let newStars = stars.map(starRules["S"][0].transform).filter(star => star.lifespan > 0);
    if (newStars.length < maxStars && p.random() > 0.3) newStars.push(starRules["S"][1].transform({}));
    stars = newStars;
  }

  /**
   * Draws each star with fading brightness.
   */
  function drawStars() {
    stars.forEach(star => {
      const alpha = p.map(star.lifespan, 0, 300, 0, star.brightness);
      p.fill(255, 255, 224, alpha);
      p.noStroke();
      p.ellipse(star.x, star.y, star.size);
      drawTwinkle(star);
    });
  }

  /**
   * Adds a twinkle effect to stars by drawing lines with fading brightness.
   */
  function drawTwinkle(star) {
    const lineLength = star.size * 3;
    const fadeExtent = lineLength / 2;
    for (let i = 0; i < fadeExtent; i++) {
      const fadeAlpha = p.map(i, 0, fadeExtent, 0, star.brightness);
      p.stroke(255, 255, 224, fadeAlpha);
      p.line(star.x - fadeExtent + i, star.y, star.x + fadeExtent - i, star.y);
      p.line(star.x, star.y - fadeExtent + i, star.x, star.y + fadeExtent - i);
    }
  }

  /**
   * Adjusts canvas size when window is resized.
   */
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  /**
   * Clears the interval when the sketch is removed.
   */
  p.remove = () => {
    clearInterval(intervalID);
  };
};

new p5(auroraSketch, "aurora-canvas");
