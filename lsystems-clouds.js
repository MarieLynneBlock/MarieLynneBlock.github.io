let rules = [{ a: "F", b: "F-F++F-F" }];
let maxGenerations = 5;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    cnv.style('position', 'absolute');
    cnv.style('top', '0');
    cnv.style('left', '0');
    cnv.style('z-index', '1');

    // Initialize multiple fractals
    fractals = [
        { x: width, y: height / 2, rotation: -PI/2, len: 60, currentGen: 0, color: color(255, 215, 0, 150), sentence: "F++F++F" },
        { x: 0, y: height / 1.5, rotation: PI/2, len: 60, currentGen: 0, color: color(0, 255, 255, 150), sentence: "F-+F-+F" },
        { x: 3 * width / 4, y: height / 2, rotation: PI / 2, len: 60, currentGen: 0, color: color(255, 0, 0, 150), sentence: "F++F++F" }
    ];

    strokeWeight(1);  // Thin line for high detail
    noFill();
    frameRate(1);  // Adjust this to slow down or speed up the generation process
}

function draw() {
    clear();  // Clear the entire canvas before redrawing
    fractals.forEach(fractal => {
        if (fractal.currentGen < maxGenerations) {
            generate(fractal);
            fractal.currentGen++;
        }
        turtle(fractal);
    });
}

function turtle(fractal) {
    stroke(fractal.color);
    resetMatrix();
    translate(fractal.x, fractal.y);
    rotate(fractal.rotation);

    for (let i = 0; i < fractal.sentence.length; i++) {
        let current = fractal.sentence.charAt(i);
        if (current === 'F') {
            line(0, 0, 0, -fractal.len);
            translate(0, -fractal.len);
        } else if (current === '+') {
            rotate(radians(30));
        } else if (current === '-') {
            rotate(-radians(30));
        }
    }
}

function generate(fractal) {
    fractal.len *= 0.5;  // Reduce the length of segments to manage space
    let nextSentence = "";
    for (let i = 0; i < fractal.sentence.length; i++) {
        let current = fractal.sentence.charAt(i);
        let found = false;
        for (let j = 0; j < rules.length; j++) {
            if (current === rules[j].a) {
                found = true;
                nextSentence += rules[j].b;
                break;
            }
        }
        if (!found) {
            nextSentence += current;
        }
    }
    fractal.sentence = nextSentence;
}
