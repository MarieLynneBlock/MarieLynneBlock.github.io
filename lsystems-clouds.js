const cloudsSketch = (p) => {
  let clouds = []; // Array to hold cloud objects
  let snowflakes = []; // Array to hold snowflake objects
  let lSystemSentence = [
    { symbol: "C", weight: 1 },
    { symbol: "C", weight: 1.5 },
    { symbol: "C", weight: 2 },
    { symbol: "C", weight: 2.5 },
    { symbol: "D", weight: 1.5 },
    { symbol: "D", weight: 2 }
  ]; // Initial L-system sentence
  const maxClouds = 12; // Reduced maximum number of clouds for performance

  // Transformation rules for clouds
  const rules = {
    "C": [
      { symbol: "C", weight: () => p.random(1, 3) },
      { symbol: "D", weight: () => p.random(1.5, 4) }
    ],
    "D": [
      { symbol: "C", weight: () => p.random(1, 2.5) }
    ]
  };

  /**
   * p5.js setup function. Initializes canvas and generates initial clouds.
   */
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent("clouds-canvas");
    p.noStroke();
    generateCloudsFromLSystem(true); // Generate the first clouds fully visible
    setInterval(generateLSystem, 8000); // Longer interval for cloud generation
  };

  /**
   * p5.js draw function. Continuously updates and draws clouds and snowflakes.
   */
  p.draw = () => {
    backgroundGradient();
    updateAndFadeClouds();
    generateSnowflakes();
    updateSnowflakes();
    drawClouds();
    drawSnowflakes();
  };

  /**
   * Generates clouds from the L-system sentence.
   * @param {boolean} initial - If true, clouds start fully visible.
   */
  function generateCloudsFromLSystem(initial = false) {
    if (clouds.length < maxClouds) {
      const group = p.random(10000); // Unique group identifier for synchronizing clouds
      lSystemSentence.forEach(({ symbol, weight }) => {
        if (symbol === "C" || symbol === "D") {
          const x = p.random(p.width);
          const y = p.random(p.height / 2);
          const w = weight * p.random(100, 180); // Width size variation
          const h = weight * p.random(50, 100); // Height size variation
          const alpha = initial ? 255 : 0; // Start fully visible if initial is true
          const fadeSpeed = p.random(2, 5); // Faster fade speed for quicker removal
          const moveSpeed = p.random(0.2, 1); // Different cloud movement speeds
          clouds.push(new Cloud(x, y, w, h, alpha, fadeSpeed, moveSpeed, symbol, group));
        }
      });
    }
  }

  /**
   * Generates the next L-system sentence and new clouds.
   */
  function generateLSystem() {
    let nextSentence = [];
    lSystemSentence.forEach(({ symbol }) => {
      if (rules[symbol]) {
        rules[symbol].forEach(({ symbol: newSymbol, weight }) => {
          if (p.random() > 0.4) nextSentence.push({ symbol: newSymbol, weight: weight() });
        });
      } else {
        nextSentence.push({ symbol, weight: 1 });
      }
    });
    lSystemSentence = nextSentence;
    generateCloudsFromLSystem();
  }

  /**
   * Draws a gradient background from dark sky to mid sky colour.
   */
  function backgroundGradient() {
    const darkSky = p.color(0, 87, 146);
    const midSky = p.color(129, 161, 193);
    for (let i = 0; i <= p.height; i++) {
      const inter = p.map(i, 0, p.height, 0, 1);
      const c = p.lerpColor(darkSky, midSky, inter);
      p.stroke(c);
      p.line(0, i, p.width, i);
    }
  }

  /**
   * Updates the position and opacity of clouds, and removes fully faded clouds.
   */
  function updateAndFadeClouds() {
    let groupsToFade = new Map();

    // Determine which groups should fade in or out
    clouds.forEach(cloud => {
      if (!groupsToFade.has(cloud.group)) {
        groupsToFade.set(cloud.group, cloud.fadeIn);
      }
    });

    clouds = clouds.map(cloud => {
      let groupFadeIn = groupsToFade.get(cloud.group);
      if (cloud.alpha < 255 && groupFadeIn) cloud.alpha += cloud.fadeSpeed;
      else if (!groupFadeIn) cloud.alpha -= cloud.fadeSpeed;
      cloud.x += cloud.moveSpeed * (1 + p.noise(cloud.x * 0.01, cloud.y * 0.01)); // Organic movement
      if (cloud.x > p.width) cloud.x = -500;
      return cloud;
    });

    // Check if all clouds in any group have fully faded in and update the group's fade direction
    groupsToFade.forEach((fadeIn, group) => {
      if (fadeIn && clouds.filter(cloud => cloud.group === group).every(cloud => cloud.alpha >= 255)) {
        clouds.forEach(cloud => {
          if (cloud.group === group) cloud.fadeIn = false;
        });
      }
    });

    // Remove completely faded-out clouds
    clouds = clouds.filter(cloud => cloud.alpha > 0);
  }

  /**
   * Generates snowflakes beneath clouds.
   */
  function generateSnowflakes() {
    clouds.forEach(cloud => {
      if (cloud.alpha > 100 && p.random() < 0.1) { // Fewer snowflakes
        const x = p.random(cloud.x, cloud.x + cloud.w);
        const size = p.random(3, 8);
        snowflakes.push(new Snowflake(x, cloud.y + cloud.h, size));
      }
    });
  }

  /**
   * Updates the position of snowflakes.
   */
  function updateSnowflakes() {
    snowflakes = snowflakes.filter(snowflake => snowflake.y < p.height);
    snowflakes.forEach(snowflake => {
      snowflake.y += snowflake.size / 2;
      snowflake.x += p.random(-0.5, 0.5); // Simulate a slight breeze
    });
  }

  /**
   * Draws all clouds.
   */
  function drawClouds() {
    clouds.forEach(cloud => cloud.show());
  }

  /**
   * Draws all snowflakes.
   */
  function drawSnowflakes() {
    snowflakes.forEach(snowflake => snowflake.show());
  }

  /**
   * Class representing a Cloud.
   */
  class Cloud {
    /**
     * Creates a cloud.
     * @param {number} x - The x-coordinate of the cloud.
     * @param {number} y - The y-coordinate of the cloud.
     * @param {number} w - The width of the cloud.
     * @param {number} h - The height of the cloud.
     * @param {number} alpha - The initial opacity of the cloud.
     * @param {number} fadeSpeed - The speed at which the cloud fades.
     * @param {number} moveSpeed - The speed at which the cloud moves.
     * @param {string} symbol - The symbol representing the cloud type.
     * @param {number} group - The group identifier for synchronizing clouds.
     */
    constructor(x, y, w, h, alpha, fadeSpeed, moveSpeed, symbol, group) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.alpha = alpha;
      this.fadeSpeed = fadeSpeed;
      this.moveSpeed = moveSpeed;
      this.symbol = symbol;
      this.group = group;
      this.fadeIn = true; // Controls the initial fade direction
    }

    /**
     * Displays the cloud.
     */
    show() {
      p.fill(229, 233, 240, this.alpha);
      p.noStroke();
      p.rect(this.x, this.y, this.w, this.h, this.h / 2);
      p.rect(this.x - this.w / 4, this.y + this.h / 4, this.w / 1.5, this.h, this.h / 2);
      p.rect(this.x + this.w / 4, this.y + this.h / 3, this.w / 1.2, this.h, this.h / 2);
    }
  }

  /**
   * Class representing a Snowflake.
   */
  class Snowflake {
    /**
     * Creates a snowflake.
     * @param {number} x - The x-coordinate of the snowflake.
     * @param {number} y - The y-coordinate of the snowflake.
     * @param {number} size - The size of the snowflake.
     */
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
    }

    /**
     * Displays the snowflake.
     */
    show() {
      p.fill(255);
      p.noStroke();
      p.ellipse(this.x, this.y, this.size);
    }
  }

  /**
   * Adjusts canvas size when window is resized.
   */
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(cloudsSketch, "clouds-canvas");
