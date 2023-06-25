const _color = `#ffcc00`;
const fillColor = `#0000ff`;
const fontSize = 24;

class Box {
  constructor(position, size) {
    this.position = position;
    this.size = size;
    this.padding = {
      left: 16,
      top: 16,
      right: 16,
      bottom: 16
    };
    this.artPadding = {
      left: 16,
      top: 16,
      right: 16,
      bottom: 16
    };
  }
  getBoxX() {
    return this.position.x + this.padding.left;
  }
  getBoxY() {
    return this.position.y + this.padding.top;
  }
  getBoxBottom() {
    return this.position.y + this.size.y - this.padding.bottom;
  }
  getBoxWidth() {
    return this.size.x - (this.padding.left + this.padding.right);
  }
  getBoxHeight() {
    return this.size.y - (this.padding.top + this.padding.bottom);
  }
  getArtX() {
    return this.getBoxX() + this.artPadding.left;
  }
  getArtY() {
    return this.getBoxY() + this.artPadding.top + fontSize;
  }
  getArtWidth() {
    return this.getBoxWidth() - (this.artPadding.left + this.artPadding.right);
  }
  getArtHeight() {
    return this.getBoxHeight() - (this.artPadding.top + this.artPadding.bottom) - fontSize * 2;
  }
}

let box1;
let box2;

const render = (x, y, w, h) => {
  // point(noise(frameCount) * 200, y + noise(frameCount * 2) * 200);
  rect(x, y, w, h);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  box1 = new Box(createVector(0, 0), createVector(width, height / 2));
  box2 = new Box(createVector(0, height / 2), createVector(width, height / 2));

  background(_color);

  noStroke();
  fill(fillColor);
  textSize(fontSize);
  textAlign(LEFT, TOP);
  text("function setup() {", box1.getBoxX(), box1.getBoxY());
  text("}", box1.getBoxX(), box1.getBoxBottom() - fontSize);

  render(box1.getArtX(), box1.getArtY(), box1.getArtWidth(), box1.getArtHeight());
}

function draw() {
  noStroke();
  fill(_color);
  rect(box2.getBoxX(), box2.getBoxY(), box2.getBoxWidth(), box2.getBoxHeight());
  fill(fillColor);

  textSize(fontSize);
  textAlign(LEFT, TOP);
  text("function draw() {", box2.getBoxX(), box2.getBoxY());
  text("}", box2.getBoxX(), box2.getBoxBottom() - fontSize);

  render(box2.getArtX(), box2.getArtY(), box2.getArtWidth() * (sin(frameCount * 0.01) * 0.5 + 0.5), box2.getArtHeight());

  stroke('#ff0000');
  line(0, height / 2, width, height / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}