let auroraSketch = function(p) {
  let yPosNoiseOffset = 0;
  let colorOffset = 0; // Offset for color cycling

  // Enhance green presence and introduce smooth cyclic color transitions
  let auroraColors = [
      p.color(125, 253, 128, 150), // Green dominant
      p.color(125, 253, 128, 150), // Repeat Green for longer presence
      p.color(24, 149, 155, 150),  // Cyan
      p.color(205, 57, 53, 150),   // Red
      p.color(230, 201, 77, 150),  // Yellow
      p.color(220, 112, 40, 150),  // Orange
      p.color(125, 253, 128, 150)  // Green to ease back into start
  ];

  function drawAurora() {
    let noiseScale = 0.005;
    let maxHeight = p.height / 2;

    p.background(0, 0, 0, 25); // Slight fade effect for motion blur
    let indexStep = p.width / (auroraColors.length - 1); // Step index by width divided by colors length minus one to loop

    for (let i = 0; i < p.width; i += 10) {
      let noiseVal = p.noise(i * noiseScale, yPosNoiseOffset);
      let lineHeight = p.map(noiseVal, 0, 1, 0, maxHeight);

      // Calculate color based on position and colorOffset for dynamic cycling
      let index = (i / indexStep + colorOffset) % (auroraColors.length - 1);
      let colorIndex = Math.floor(index);
      let nextIndex = (colorIndex + 1) % auroraColors.length;
      let colorLerp = p.lerpColor(auroraColors[colorIndex], auroraColors[nextIndex], index % 1);

      p.stroke(colorLerp);
      p.strokeWeight(2);
      p.line(i, 0, i, lineHeight);
    }

    yPosNoiseOffset += 0.005;  // Slow vertical movement
    colorOffset += 0.02;  // Increment to shift colors over time
  }

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
  };

  p.draw = function() {
    drawAurora();
  };
};

new p5(auroraSketch, 'aurora-canvas');
