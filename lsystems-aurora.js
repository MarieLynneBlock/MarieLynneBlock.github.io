let auroraSketch = function(p) {
  let yPosNoiseOffset = 0;
  let sentence = "F";
  let rules = { "F": "FF+[+F-F-F]-[-F+F+F]" };  // Subtle variations in movement
  let colorIndex = 0;

  // Aurora colors for dynamic transitions
  let auroraColors = [
      p.color(125, 253, 128, 150),
      p.color(24, 149, 155, 150),
      p.color(205, 57, 53, 150),
      p.color(230, 201, 77, 150),
      p.color(220, 112, 40, 150)
  ];

  function applyRules() {
    let nextSentence = "";
    for (let char of sentence) {
      nextSentence += rules[char] || char;
    }
    sentence = nextSentence;
  }

  function drawAurora() {
    let noiseScale = 0.01;
    let maxHeight = p.height / 2;

    p.background(0, 0, 0, 25);  // Slight fade effect for motion blur
    for (let i = 0; i < p.width; i += 10) {
      let noiseVal = p.noise(i * noiseScale, yPosNoiseOffset);
      let lineHeight = p.map(noiseVal, 0, 1, 0, maxHeight);

      let lerpFactor = (i / p.width) * (auroraColors.length - 1);
      let col1 = auroraColors[Math.floor(lerpFactor)];
      let col2 = auroraColors[Math.ceil(lerpFactor)];
      let colorLerp = p.lerpColor(col1, col2, lerpFactor % 1);

      p.stroke(colorLerp);
      p.strokeWeight(2);
      p.line(i, p.height, i, p.height - lineHeight);
    }

    yPosNoiseOffset += 0.005;  // Slow vertical movement
  }

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
    applyRules();  // Start with initial application of rules
  };

  p.draw = function() {
    drawAurora();
  };

  setInterval(() => {
    applyRules();  // Evolve the pattern periodically
  }, 3000);  // Update every 3000 milliseconds
};

new p5(auroraSketch, 'aurora-canvas');
