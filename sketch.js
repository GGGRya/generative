let dots = [];
let mult;
let tz;
let w;
function setup() {
  createCanvas(800, 800);
  background(0);
  angleMode(DEGREES);
  frameRate(30);
  rectMode(CENTER);
  let density = 36;
  let inter = width / density;
  for (let x = 0; x < width; x += inter) {
    for (let y = 0; y < height; y += inter) {
      let d = new Dot(x + width * cos(x, y), y + height * sin(x, y), 36);
      dots.push(d);
    }
  }
  mult = 0.02;
  tz = 0;
  w = 0;
}

function draw() {
  for (let i = 0; i < dots.length; i++) {
    dots[i].draw();
    dots[i].update(tz, mult);
  }
  tz += 0.02;
}

class Dot {
  constructor(x, y, length) {
    this.ox = x;
    this.oy = y;
    this.length = length;
    this.w = 0;
    this.vector = createVector(this.ox, this.oy);
    this.center = createVector(width / 2, height / 2);
  }
  update(tz, mult) {
    this.r = map(this.vector.x, 0, width, 100, 255 * noise(tz));
    this.g = map(this.vector.y, 0, height, 100, 255 * noise(tz - 100));
    this.b = map(
      this.vector.x * this.vector.y,
      0,
      width * height,
      100,
      255 * noise(tz + 100)
    );
    let a = map(
      dist(width / 2, height / 2, this.vector.x, this.vector.y),
      400,
      0,
      0,
      255
    );
    let targetW = map(a, 0, 255, 0, 2 * noise(tz * 2));
    this.w = lerp(this.w, targetW, mult * 10);
    this.alpha = lerp(255, a, mult * 5);
    this.ang = map(
      noise(this.vector.x * mult, this.vector.y * mult),
      0,
      1,
      0,
      1440 * noise(tz)
    );
    if (offScreen(this.vector)) {
      this.vector = p5.Vector.lerp(this.vector, this.center, noise(tz));
    }
    this.vector.add(createVector(cos(this.ang), sin(this.ang)));
  }
  draw() {
    stroke(this.r, this.g, this.b, this.alpha);
    strokeWeight(this.w);
    point(this.vector.x, this.vector.y);
    noStroke();
    if (this.alpha > 242 && floor(this.ang % 150) == 0) {
      fill(this.r, this.g, this.b, this.alpha / 2);
      circle(this.vector.x, this.vector.y, this.w * 18);
    }
    if (this.w < 0.25 && floor(this.ang) == 360) {
      fill(0, this.alpha / 18);
      rect(this.vector.x, height / 2, this.w * 36, height);
    }
  }
}
function offScreen(vector) {
  return dist(width / 2, height / 2, vector.x, vector.y) >= 399;
}
