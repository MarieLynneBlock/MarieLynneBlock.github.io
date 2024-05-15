const winterSketch = (p) => {
  let snowflakes = [];
  let trees = [];

  const trunkColors = ["#c2653c", "#9d5d5d", "#5a3e36"];
  const foliageColors = ["#4da2bb", "#3b6978", "#7aa892", "#508b8c"];
  const foliageTypes = ["round", "pine", "triangle", "fir"];

  const trunkRules = {
    "A": [{ symbol: "#c2653c", weight: () => p.random(0.8, 1.5) }],
    "B": [{ symbol: "#9d5d5d", weight: () => p.random(1.2, 2.0) }],
    "C": [{ symbol: "#5a3e36", weight: () => p.random(0.7, 1.3) }]
  };

  const foliageRules = {
    "A": [{ symbol: "round", color: () => foliageColors[0], weight: () => p.random(1, 2) }],
    "B": [{ symbol: "pine", color: () => foliageColors[1], weight: () => p.random(1.5, 3) }],
    "C": [{ symbol: "triangle", color: () => foliageColors[2], weight: () => p.random(2, 3.5) }],
    "D": [{ symbol: "fir", color: () => foliageColors[3], weight: () => p.random(1.5, 2.5) }]
  };

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent("winter-canvas");
    p.frameRate(30);
    generateWinterScene();
  };

  p.draw = () => {
    drawGradientBackground(); // Gradient background color
    drawAll(trees, drawTreeTrunk);
    drawAll(trees, drawTreeFoliage);
    drawAll(snowflakes, drawSnowflake);
    drawSnowLayer();
  };

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

  function generateWinterScene() {
    // Generate snowflakes
    for (let i = 0; i < 100; i++) {
      snowflakes.push({ x: p.random(p.width), y: p.random(-p.height, p.height), size: p.random(3, 8) });
    }

    // Generate L-System Trees using trunk and foliage rules
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

  function drawAll(collection, drawFunction) {
    collection.forEach(drawFunction);
  }

  function drawTreeTrunk(tree) {
    const trunkHeight = 70 * tree.trunkSize;
    p.fill(tree.trunkColor);
    p.rect(tree.x, tree.y - trunkHeight, 15 * tree.trunkSize, trunkHeight, 5, 5, 0, 0);
  }

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

  function drawSnowflake(snowflake) {
    p.fill(255);
    p.noStroke();
    p.ellipse(snowflake.x, snowflake.y, snowflake.size);
    snowflake.y += snowflake.size / 2;
    if (snowflake.y > p.height) {
      snowflake.y = -p.random(100);
    }
  }

  function drawRoundTree(x, y, size = 1, color = "#4da2bb") {
    p.fill(color);
    p.ellipse(x, y - 30 * size, 60 * size, 60 * size);
    p.ellipse(x - 20 * size, y - 15 * size, 45 * size, 45 * size);
    p.ellipse(x + 20 * size, y - 15 * size, 45 * size, 45 * size);
  }

  function drawPineTree(x, y, size = 1, color = "#3b6978") {
    p.fill(color);
    p.triangle(x - 45 * size, y, x + 45 * size, y, x, y - 90 * size);
    p.triangle(x - 35 * size, y - 30 * size, x + 35 * size, y - 30 * size, x, y - 90 * size);
    p.triangle(x - 25 * size, y - 60 * size, x + 25 * size, y - 60 * size, x, y - 90 * size);
  }

  function drawTriangleTree(x, y, size = 1, color = "#7aa892") {
    p.fill(color);
    p.triangle(x - 45 * size, y, x + 45 * size, y, x, y - 90 * size);
  }

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

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(winterSketch, "winter-canvas");
