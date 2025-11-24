//knitting a scarf together
//pixel art 
//State: DEFAULT, DRAW, SAVE, 

let boardState = "DEFAULT";
let input;
let artMaker;

function setup() {
  createCanvas(720, 480);

  input = createInput('');
  input.show();
  input.size(200, 30);
  input.position(width/2-input.width/2, height/2+30);

  // input.input(() => {});
}

function draw() {
  
  
  //login
  if (boardState === "DEFAULT") {
    background("#FF46A2");
    fill("black");
    textSize(20);
    textAlign(CENTER, CENTER);
    text('TYPE YOUR NAME \nAND PRESS ENTER TO START', width/2, height/2);
    input.show();
  }

  //drawing board
  if (boardState === "DRAW") {
    input.hide();
    background(240);
    textSize(24);
    textAlign(CENTER);
    text(`Welcome, ${input.value()}!`, width / 2, 40);
    if (!artMaker) {
      artMaker = new PixelArtMaker();
      artMaker.setupTools();
    }
    artMaker.draw();
  }
}

function keyPressed() {
  if (boardState === "DEFAULT" && keyCode === ENTER && input.value() !== '') {
    boardState = "DRAW";
  }
}

//https://editor.p5js.org/m4ttbit/sketches/ywqtUdQC1

class PixelArtMaker{
  constructor() {
    this.grid = 32;
    this.show = false;
    this.colorPicker = createColorPicker("#49DFFD");
    this.colorPicker.position(10, height + 10);
    this.colorPicker.size(80, 28);

    this.saveButton = createButton("DOWNLOAD PNG");
    this.saveButton.position(100, height + 10);
    this.saveButton.size(150, 32);
    this.saveButton.mousePressed(() => this.download());

    this.clearButton = createButton("CLEAR");
    this.clearButton.position(260, height + 10);
    this.clearButton.size(80, 32);
    this.clearButton.mousePressed(() => this.clean());

    this.gridButton = createButton("SHOW GRID");
    this.gridButton.position(350, height + 10);
    this.gridButton.size(100, 32);
    this.gridButton.mousePressed(() => this.toggleGrid());
  }

  setupTools() {
    background(240);
  }

  draw() {
    if (mouseIsPressed && mouseY < height) {
      let x = this.snap(mouseX);
      let y = this.snap(mouseY);
      if (!this.show) noStroke();
      else stroke(150);
      fill(this.colorPicker.color());
      square(x, y, this.grid);
    }
  }

  toggleGrid() {
    if (this.show) {
      this.removeGrid();
      this.gridButton.html("SHOW GRID");
    } else {
      this.createGrid();
      this.gridButton.html("HIDE GRID");
    }
    this.show = !this.show;
  }

  createGrid() {
    stroke(150);
    for (let l = 0; l < width; l += this.grid) {
      line(l, 0, l, height);
      line(0, l, width, l);
    }
  }

  removeGrid() {
    background(240);
  }

  snap(p) {
    let cell = Math.round((p - this.grid / 2) / this.grid);
    return cell * this.grid;
  }

  clean() {
    background(240);
    this.show = false;
    this.gridButton.html("SHOW GRID");
  }

  download() {
    saveCanvas("myPixelArt", "png");
  }
}