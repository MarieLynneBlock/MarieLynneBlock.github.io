const starSketch = (p) => {
  let stars = []; // Array to hold stationary star objects
  let fallingStars = []; // Array to hold falling star objects
  const maxStars = 150; // Max number of stationary stars for performance
  const maxFallingStars = 5; // Max number of falling stars for performance
  const lowerBound = p.windowHeight * 0.9; // Lower 10th of the screen

  // Transformation rules for stars and falling stars
  const rules = {
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
        y: p.random(p.height * 0.9), // Prevent stars in the lower 10th
        size: p.random(1, 3),
        brightness: p.random(150, 255),
        lifespan: 300,
        dx: 0,
        dy: 0
      }) }
    ],
    "F": [
      // Create a falling star
      { transform: star => ({
        symbol: "F",
        x: p.random(p.width),
        y: 0,
        size: p.random(3, 6),
        brightness: 255,
        lifespan: 250,
        dx: p.random(-2, 2),
        dy: p.random(4, 6),
        tail: []
      }) }
    ]
  };

  /**
   * Generates new stars and updates existing stars.
   */
  function generateStars() {
    // Evolve and filter stationary stars
    let newStars = stars.map(rules["S"][0].transform).filter(star => star.lifespan > 0);

    // Add new stationary stars if below maxStars limit
    if (newStars.length < maxStars && p.random() > 0.3) {
      newStars.push(rules["S"][1].transform({}));
    }

    stars = newStars;

    // Add new falling stars if below maxFallingStars limit
    if (fallingStars.length < maxFallingStars && p.random() < 0.05) {
      fallingStars.push(rules["F"][0].transform({}));
    }

    // Filter out falling stars that have reached the end of their lifespan
    fallingStars = fallingStars.filter(star => star.lifespan > 0);
  }

  /**
   * p5.js setup function. Initialises canvas and pre-generates stars.
   */
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent("stars-canvas");
    p.noLoop(); // Ensure setup gradient is drawn only once
    drawGradientBackground();
    for (let i = 0; i < 100; i++) generateStars();
    setInterval(generateStars, 1000); // Generate stars at regular intervals
    p.loop();
  };

  /**
   * p5.js draw function. Continuously draws background and stars.
   */
  p.draw = () => {
    drawGradientBackground();
    drawAllStars(stars, drawStationaryStar);
    drawAllStars(fallingStars, drawFallingStar);
  };

  /**
   * Draws all stars using the provided draw function.
   * @param {Array} starArray - Array of star objects.
   * @param {Function} drawFunction - Function to draw individual stars.
   */
  function drawAllStars(starArray, drawFunction) {
    starArray.forEach(star => {
      const alpha = p.map(star.lifespan, 0, 300, 0, star.brightness);
      p.fill(255, 255, 224, alpha);
      p.noStroke();
      drawFunction(star);
    });
  }

  /**
   * Draws a stationary star and adds twinkle effect.
   * @param {Object} star - Star object.
   */
  function drawStationaryStar(star) {
    p.ellipse(star.x, star.y, star.size);
    drawTwinkle(star);
  }

  /**
   * Draws a falling star and adds a tail effect.
   * @param {Object} star - Falling star object.
   */
  function drawFallingStar(star) {
    p.ellipse(star.x, star.y, star.size);
    drawTail(star);
  }

  /**
   * Adds a twinkle effect to a star by drawing fading lines.
   * @param {Object} star - Star object.
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
   * Adds a tail effect to a falling star by drawing a fading trail.
   * @param {Object} star - Falling star object.
   */
  function drawTail(star) {
    const tailLength = 20; // Length of the tail
    const tailAlpha = p.map(star.lifespan, 0, 250, 0, 255); // Alpha transparency of the tail

    // Add current position to the tail array
    star.tail.push({ x: star.x, y: star.y, alpha: tailAlpha });
    if (star.tail.length > tailLength) {
      star.tail.shift(); // Remove oldest tail segment if exceeding tail length
    }

    // Draw tail segments
    p.stroke(255, 255, 224);
    for (let i = star.tail.length - 1; i > 0; i--) {
      const t1 = star.tail[i];
      const t2 = star.tail[i - 1];
      const alpha = p.map(i, 0, star.tail.length, 0, t1.alpha);
      p.stroke(255, 255, 224, alpha);
      p.line(t1.x, t1.y, t2.x, t2.y);
    }

    // Update star position and lifespan
    star.x += star.dx;
    star.y += star.dy;
    star.lifespan -= 5;
  }

  /**
   * Draws a gradient background from polar night to dark sky colour.
   */
  function drawGradientBackground() {
    const polarNight = p.color(36, 41, 51);
    const darkSky = p.color(0, 87, 146);
    for (let y = 0; y < p.height; y++) {
      const lerpRatio = p.map(y, 0, p.height, 0, 1);
      const gradientColor = p.lerpColor(polarNight, darkSky, lerpRatio);
      p.stroke(gradientColor);
      p.line(0, y, p.width, y);
    }
  }

  /**
   * Adjusts canvas size when window is resized.
   */
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(starSketch, "stars-canvas");
