const winterSketch = (p) => {
  let snowflakes = []; // Array to hold snowflake objects
  let trees = []; // Array to hold tree objects

  const trunkColors = ["#c2653c", "#9d5d5d", "#5a3e36"]; // Colours for tree trunks
  const foliageColors = ["#4da2bb", "#3b6978", "#7aa892", "#508b8c"]; // Colours for tree foliage
  const foliageTypes = ["round", "pine", "triangle", "fir"]; // Types of foliage shapes

  // Rules for trunk generation with random weights
  const trunkRules = {
    "A": [{ symbol: "#c2653c", weight: () => p.random(0.8, 1.5) }],
    "B": [{ symbol: "#9d5d5d", weight: () => p.random(1.2, 2.0) }],
    "C": [{ symbol: "#5a3e36", weight: () => p.random(0.7, 1.3) }]
  };

  // Rules for foliage generation with random weights and colours
  const foliageRules = {
    "A": [{ symbol: "round", color: () => foliageColors[0], weight: () => p.random(1, 2) }],
    "B": [{ symbol: "pine", color: () => foliageColors[1], weight: () => p.random(1.5, 3) }],
    "C": [{ symbol: "triangle", color: () => foliageColors[2], weight: () => p.random(2, 3.5) }],
    "D": [{ symbol: "fir", color: () => foliageColors[3], weight: () => p.random(1.5, 2.5) }]
  };

  /**
   * p5.js setup function. Initialises canvas and generates the winter scene.
   */
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent("winter-canvas");
    p.frameRate(30);
    generateWinterScene(); // Generate initial snowflakes and trees
  };

  /**
   * p5.js draw function. Continuously draws the background, trees, snowflakes, and snow layer.
   */
  p.draw = () => {
    drawGradientBackground(); // Draw gradient background
    drawAll(trees, drawTreeTrunk); // Draw tree trunks
    drawAll(trees, drawTreeFoliage); // Draw tree foliage
    drawAll(snowflakes, drawSnowflake); // Draw snowflakes
    drawSnowLayer(); // Draw the snow layer
  };

  /**
   * Draws a gradient background from mid-sky to snow colour.
   */
  function drawGradientBackground() {
    const midSky = p.color(129, 161, 193);
    const snow = p.color(236, 239, 244);
    for (let y = 0; y < p.height; y++) {
      const inter = p.map(y, 0, p.height, 0, 1);
      const c = p.lerpColor(midSky, snow, inter);
      p.stroke(c);
      p.line(0, y, p.width, y);
    }
  }

  /**
   * Generates the initial winter scene with snowflakes and trees.
   */
  function generateWinterScene() {
    // Generate snowflakes
    for (let i = 0; i < 100; i++) {
      snowflakes.push({ x: p.random(p.width), y: p.random(-p.height, p.height), size: p.random(3, 8) });
    }

    // Generate trees using L-System rules for trunk and foliage
    const baseX = 100;
    let currentX = baseX;

    for (let i = 0; i < 15; i++) {
      const trunkKey = String.fromCharCode(65 + (i % 3)); // 'A', 'B', 'C'
      const trunkRule = trunkRules[trunkKey][0];
      const trunkColor = trunkRule.symbol;
      const trunkWeight = trunkRule.weight();

      const foliageKey = String.fromCharCode(65 + (i % 4)); // 'A', 'B', 'C', 'D'
      const foliageRule = foliageRules[foliageKey][0];
      const foliageType = foliageRule.symbol;
      const foliageColor = foliageRule.color();
      const foliageWeight = foliageRule.weight();

      trees.push({
        x: currentX + p.random(-10, 10),
        y: p.height,
        trunkColor,
        trunkSize: trunkWeight,
        foliageType,
        foliageColor,
        foliageWeight
      });
      currentX += p.random(50, 100);
    }
  }

  /**
   * Draws all elements in a collection using a provided draw function.
   * @param {Array} collection - Collection of elements to draw.
   * @param {Function} drawFunction - Function to draw an individual element.
   */
  function drawAll(collection, drawFunction) {
    collection.forEach(drawFunction);
  }

  /**
   * Draws the trunk of a tree.
   * @param {Object} tree - Tree object containing trunk properties.
   */
  function drawTreeTrunk(tree) {
    const trunkHeight = 70 * tree.trunkSize;
    p.fill(tree.trunkColor);
    p.rect(tree.x, tree.y - trunkHeight, 15 * tree.trunkSize, trunkHeight, 5, 5, 0, 0);
  }

  /**
   * Draws the foliage of a tree.
   * @param {Object} tree - Tree object containing foliage properties.
   */
  function drawTreeFoliage(tree) {
    const trunkHeight = 70 * tree.trunkSize;
    const foliageY = tree.y - trunkHeight;

    if (tree.foliageType === "round") {
      drawRoundTree(tree.x + 7.5 * tree.trunkSize, foliageY, tree.foliageWeight, tree.foliageColor);
    } else if (tree.foliageType === "pine") {
      drawPineTree(tree.x + 7.5 * tree.trunkSize, foliageY, tree.foliageWeight, tree.foliageColor);
    } else if (tree.foliageType === "triangle") {
      drawTriangleTree(tree.x + 7.5 * tree.trunkSize, foliageY, tree.foliageWeight, tree.foliageColor);
    } else if (tree.foliageType === "fir") {
      drawFirTree(tree.x + 7.5 * tree.trunkSize, foliageY, tree.foliageWeight, tree.foliageColor);
    }
  }

  /**
   * Draws a snowflake and updates its position.
   * @param {Object} snowflake - Snowflake object containing position and size properties.
   */
  function drawSnowflake(snowflake) {
    p.fill(255);
    p.noStroke();
    p.ellipse(snowflake.x, snowflake.y, snowflake.size);
    snowflake.y += snowflake.size / 2;
    if (snowflake.y > p.height) {
      snowflake.y = -p.random(100);
    }
  }

  /**
   * Draws a round tree foliage.
   * @param {number} x - The x-coordinate of the tree foliage.
   * @param {number} y - The y-coordinate of the tree foliage.
   * @param {number} [size=1] - The size of the tree foliage.
   * @param {string} [color="#4da2bb"] - The colour of the tree foliage.
   */
  function drawRoundTree(x, y, size = 1, color = "#4da2bb") {
    p.fill(color);
    p.ellipse(x, y - 30 * size, 60 * size, 60 * size);
    p.ellipse(x - 20 * size, y - 15 * size, 45 * size, 45 * size);
    p.ellipse(x + 20 * size, y - 15 * size, 45 * size, 45 * size);
  }

  /**
   * Draws a pine tree foliage.
   * @param {number} x - The x-coordinate of the tree foliage.
   * @param {number} y - The y-coordinate of the tree foliage.
   * @param {number} [size=1] - The size of the tree foliage.
   * @param {string} [color="#3b6978"] - The colour of the tree foliage.
   */
  function drawPineTree(x, y, size = 1, color = "#3b6978") {
    p.fill(color);
    p.triangle(x - 45 * size, y, x + 45 * size, y, x, y - 90 * size);
    p.triangle(x - 35 * size, y - 30 * size, x + 35 * size, y - 30 * size, x, y - 90 * size);
    p.triangle(x - 25 * size, y - 60 * size, x + 25 * size, y - 60 * size, x, y - 90 * size);
  }

  /**
   * Draws a triangle tree foliage.
   * @param {number} x - The x-coordinate of the tree foliage.
   * @param {number} y - The y-coordinate of the tree foliage.
   * @param {number} [size=1] - The size of the tree foliage.
   * @param {string} [color="#7aa892"] - The colour of the tree foliage.
   */
  function drawTriangleTree(x, y, size = 1, color = "#7aa892") {
    p.fill(color);
    p.triangle(x - 45 * size, y, x + 45 * size, y, x, y - 90 * size);
  }

  /**
   * Draws a fir tree foliage.
   * @param {number} x - The x-coordinate of the tree foliage.
   * @param {number} y - The y-coordinate of the tree foliage.
   * @param {number} [size=1] - The size of the tree foliage.
   * @param {string} [color="#508b8c"] - The colour of the tree foliage.
   */
  function drawFirTree(x, y, size = 1, color = "#508b8c") {
    p.fill(color);
    const trunkWidth = 15 * size;
    const trunkHeight = 70 * size;
    const trunkX = x - trunkWidth / 2;
    const trunkY = y;

    // Draw the trunk
    p.rect(trunkX, trunkY - trunkHeight, trunkWidth, trunkHeight);

    // Draw the foliage
    p.beginShape();
    p.vertex(x, y - 90 * size);
    p.vertex(x - 30 * size, y - 70 * size);
    p.vertex(x - 25 * size, y - 60 * size);
    p.vertex(x - 40 * size, y - 40 * size);
    p.vertex(x - 30 * size, y - 30 * size);
    p.vertex(x - 50 * size, y - 10 * size);
    p.vertex(x + 50 * size, y - 10 * size);
    p.vertex(x + 30 * size, y - 30 * size);
    p.vertex(x + 40 * size, y - 40 * size);
    p.vertex(x + 25 * size, y - 60 * size);
    p.vertex(x + 30 * size, y - 70 * size);
    p.endShape(p.CLOSE);
  }

  /**
   * Draws a snow layer at the bottom of the canvas.
   */
  function drawSnowLayer() {
    const snowColor = p.color(255, 255, 255);
    p.fill(snowColor);
    p.noStroke();

    const bottomPadding = 15;
    const puffyHeight = 30;

    p.beginShape();
    p.vertex(0, p.height - bottomPadding);

    for (let x = 0; x <= p.width; x += 50) {
      const y = p.height - bottomPadding - p.noise(x * 0.05) * puffyHeight;
      p.vertex(x, y);
    }

    p.vertex(p.width, p.height - bottomPadding);
    p.vertex(p.width, p.height);
    p.vertex(0, p.height);

    p.endShape(p.CLOSE);
  }

  /**
   * Adjusts canvas size when window is resized.
   */
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(winterSketch, "winter-canvas");
