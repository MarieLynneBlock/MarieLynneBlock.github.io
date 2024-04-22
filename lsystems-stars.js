let starSketch = function(p) {
  let stars = [];
  let maxStars = 200; // Limit the number of stars for performance

  // Rules for star generation, including stationary and falling stars
  let rules = {
    "S": [
      // Evolve the current star (stationary or falling)
      { transform: star => ({
        symbol: "S",
        x: star.x + star.dx,
        y: star.y + star.dy,
        size: star.size,
        brightness: Math.max(star.brightness - 2, 50),
        lifespan: star.lifespan - 5,
        dx: star.dx,
        dy: star.dy
      }) },
      // Spawn a new stationary star
      { transform: star => ({
        symbol: "S",
        x: p.random(p.width),
        y: p.random(p.height),
        size: p.random(1, 3),
        brightness: p.random(150, 255),
        lifespan: 300,
        dx: 0,
        dy: 0
      }) }
    ],
    // Special rule for explicitly creating falling stars
    "F": [
      { transform: star => ({
        symbol: "S",
        x: p.random(p.width),
        y: 0, // Start at the top of the canvas
        size: p.random(1, 3),
        brightness: p.random(200, 255),
        lifespan: 100, // Shorter lifespan for a dramatic effect
        dx: p.random(-2, 2), // Horizontal movement
        dy: p.random(1, 3) // Initial vertical movement
      }) }
    ]
  };

  function generateStars() {
    let newStars = [];

    stars.forEach(star => {
      if (star.lifespan > 0) {
        let productionChoice = p.random() > 0.95 ? 1 : 0; // Lower chance for falling stars
        let production = rules[star.symbol][productionChoice];
        let result = production.transform(star);
        newStars.push(result);
      }
    });

    stars = newStars.filter(star => star.lifespan > 0); // Remove dead stars
    if (stars.length < maxStars && p.random() > 0.3) {
      if (p.random() < 0.1) {
        // Occasionally add a falling star
        stars.push(rules["F"][0].transform({}));
      } else {
        // Mainly add normal stars
        stars.push({
          symbol: "S",
          x: p.random(p.width),
          y: p.random(p.height),
          size: p.random(1, 3),
          brightness: p.random(150, 255),
          lifespan: 300,
          dx: 0,
          dy: 0
        });
      }
    }
  }

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    for (let i = 0; i < 100; i++) { // Create a large initial set of stars
      generateStars();
    }
    setInterval(generateStars, 1000); // Faster update for dynamic star patterns
  };

  p.draw = function() {
    p.background(0, 0, 0, 25); // Slight transparency for fade effect
    stars.forEach(star => {
      let alpha = p.map(star.lifespan, 0, 300, 0, star.brightness); // Adjust alpha for fading effect
      p.fill(255, 255, 224, alpha); // Bleak yellow
      p.noStroke();
      if (star.dx === 0 && star.dy === 0) {
        // Twinkling effect for stationary stars
        p.ellipse(star.x, star.y, star.size);
        drawTwinkle(star);
      } else {
        // Falling stars without twinkle
        p.ellipse(star.x, star.y, star.size);
      }
    });
  };

  function drawTwinkle(star) {
    let lineLength = star.size * 3;
    let fadeExtent = lineLength / 2;
    for (let i = 0; i < fadeExtent; i++) {
        let fadeAlpha = p.map(i, 0, fadeExtent, 0, star.brightness);
        p.stroke(255, 255, 224, fadeAlpha);
        p.line(star.x - fadeExtent + i, star.y, star.x + fadeExtent - i, star.y); // Horizontal line
        p.line(star.x, star.y - fadeExtent + i, star.x, star.y + fadeExtent - i); // Vertical line
    }
  }
};

new p5(starSketch, 'stars-canvas');
