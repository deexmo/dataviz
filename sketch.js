let flowerData;
let flowers = [];
let particles = [];
let startTime;
let endTime = 0;

function preload() {
  flowerData = loadJSON("flowers.json");
}

function setup() {

  let cnv = createCanvas(800, 650);
  cnv.parent('canvas-container');

  noStroke();
  textAlign(CENTER);
  startTime = millis();

  let prices = flowerData.flowerlist.map(f => f.price);
  let minPrice = Math.min(...prices);
  let maxPrice = Math.max(...prices);

  for (let f of flowerData.flowerlist) {
    let bloomSize = map(f.price, minPrice, maxPrice, 15, 50);
    flowers.push({
      x: random(60, width - 60),
      y: random(100, height - 150),
      size: random(8, 15),
      name: f.name,
      category: f.category,
      bloomed: false,
      growAmount: 0,
      maxGrow: bloomSize
    });
  }
}

function draw() {
  background(225, 245, 225);

  // timer
  fill(50);
  textAlign(LEFT);
  textSize(18);
  let elapsed = endTime ? endTime - startTime : millis() - startTime;
  text((elapsed / 1000).toFixed(1) + "s", 20, 30);

  // stop timer when all flowers bloomed
  if (!endTime && flowers.every(f => f.bloomed)) {
    endTime = millis();
  }

  textAlign(CENTER);
  fill(60);
  textSize(14);
  text("(The bigger the flower, the higher the cost)", width / 2, 55);
  textSize(18);
  text("Click a seed to water it and make it bloom!", width / 2, 30);

  textSize(16);
  textAlign(LEFT);
  text("Shrubs", 60, 610);
  text("Container Plants", 200, 610);
  text("Herbaceous Perennials", 400, 610);
  text("Cacti & Succulents", 640, 610);

  fill(255, 120, 160); ellipse(40, 605, 25);
  fill(255, 210, 120); ellipse(180, 605, 25);
  fill(160, 210, 255); ellipse(380, 605, 25);
  fill(120, 230, 170); ellipse(620, 605, 25);

  drawParticles();

  // flowers
  textAlign(CENTER);
  for (let f of flowers) {
    if (f.bloomed) {
      stroke(60, 150, 60);
      strokeWeight(2);
      line(f.x, f.y, f.x, f.y + (f.size + f.growAmount) / 2 + 15);
      noStroke();
    }

    if (f.bloomed) {
      if (f.category === "Shrubs") fill(255, 120, 160);
      else if (f.category === "Container Plants") fill(255, 210, 120);
      else if (f.category === "Herbaceous Perennials") fill(160, 210, 255);
      else if (f.category === "Cacti & Succulents") fill(120, 230, 170);
    } else fill(160);

    if (f.bloomed && f.growAmount < f.maxGrow) f.growAmount += 0.5;

    ellipse(f.x, f.y, f.size + f.growAmount);

    if (f.bloomed) {
      fill(50);
      textSize(11);
      text(f.name, f.x, (f.y + 10) + (f.size + f.growAmount) / 1.2);
    }
  }

  if (endTime) {
    fill(0, 150, 100, 150);
    rect(0, 0, width, height);
    fill(255);
    textSize(32);
    text("Garden Complete!", width / 2, height / 2 - 20);
    textSize(20);
    text("Time: " + ((endTime - startTime) / 1000).toFixed(1) + "s", width / 2, height / 2 + 20);
  }
}

function mousePressed() {
  for (let f of flowers) {
    if (dist(mouseX, mouseY, f.x, f.y) < 12 && !f.bloomed) {
      f.bloomed = true;

      // water sprinkle
      for (let i = 0; i < 12; i++) {
        particles.push({
          x: f.x + random(-8, 8),
          y: f.y - 15,
          size: random(2, 6),
          alpha: 255,
          speedX: random(-0.3, 0.3),
          speedY: random(0.5, 1.2)
        });
      }
    }
  }
}

function drawParticles() {
  fill(120, 180, 255, 160);
  noStroke();

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    ellipse(p.x, p.y, p.size);

    p.x += p.speedX;
    p.y += p.speedY;
    p.alpha -= 6;

    if (p.alpha <= 0) particles.splice(i, 1);
  }
}
