import p5 from 'p5'
// @ts-ignore
import vertexShader from '~/shader/vertexShader.vert'
// @ts-ignore
import fragmentShader from '~/shader/fragmentShader.frag'

let box1;
let box2;
let graphics1;
let theShader1;
let _pixelDensity1;
let time1;
let graphics2;
let theShader2;
let _pixelDensity2;
let time2;

const bgColor = `#dddddd`;
const fillColor = `#000000`;
const fontSize = 24;
let artType = 4;

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    box1 = new Box(p.createVector(0, 0), p.createVector(p.width, p.height / 2));
    box2 = new Box(p.createVector(0, p.height / 2), p.createVector(p.width, p.height / 2));

    graphics1 = p.createGraphics(box1.getArtWidth(), box1.getArtHeight(), p.WEBGL)
    theShader1 = graphics1.createShader(vertexShader, fragmentShader)
    graphics2 = p.createGraphics(box2.getArtWidth(), box2.getArtHeight(), p.WEBGL)
    theShader2 = graphics2.createShader(vertexShader, fragmentShader)

    _pixelDensity1 = graphics1.pixelDensity()
    _pixelDensity2 = graphics2.pixelDensity()

    p.background(bgColor);

    p.noStroke();
    p.fill(fillColor);
    p.textSize(fontSize);
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.TOP);
    p.text("function setup() {", box1.getBoxX(), box1.getBoxY());
    p.text("}", box1.getBoxX(), box1.getBoxBottom() - fontSize);

    time1 = 0;

    // theShader1.setUniform("resolution", [graphics1.width * _pixelDensity1, graphics1.height * _pixelDensity1])
    // theShader1.setUniform("time", p.millis() / 1000)
    // graphics1.shader(theShader1)
    // const offsetX = 1;
    // const offsetY = 1;
    // graphics1.quad(-offsetX, -offsetY, offsetX, -offsetY, offsetX, offsetY, -offsetX, offsetY)
    // p.image(graphics1, box1.getArtX(), box1.getArtY())
  }
  p.draw = () => {
    p.noStroke();
    p.fill(bgColor);
    p.rect(box2.getBoxX(), box2.getBoxY(), box2.getBoxWidth(), box2.getBoxHeight());
    p.fill(fillColor);

    p.textSize(fontSize);
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.TOP);
    p.text("function draw() {", box2.getBoxX(), box2.getBoxY());
    p.text("}", box2.getBoxX(), box2.getBoxBottom() - fontSize);

    drawShader(theShader1, graphics1, _pixelDensity1, time1, box1);

    time2 = p.millis() / 1000;

    drawShader(theShader2, graphics2, _pixelDensity2, time2, box2);
  }
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
  const drawShader = (_shader, _graphics, _pixelDensity, _time, _box) => {
    const offsetX = 1;
    const offsetY = 1;
    _shader.setUniform("resolution", [_graphics.width * _pixelDensity, _graphics.height * _pixelDensity]);
    _shader.setUniform("time", _time);
    _shader.setUniform("artType", artType);
    _graphics.shader(_shader);
    _graphics.quad(-offsetX, -offsetY, offsetX, -offsetY, offsetX, offsetY, -offsetX, offsetY);
    p.image(_graphics, _box.getArtX(), _box.getArtY());
  }
})

class Box {
  private position: p5.Vector;
  private size: p5.Vector;
  private padding: any;
  private artPadding: any;

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