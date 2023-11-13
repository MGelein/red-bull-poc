function preload() {
  Assets.preload();
}

function setup() {
  Assets.load();
  GameState.setActive("boot");
  constrainCanvas(createCanvas(375, 667));
}

function draw() {
  background(0);
  GameState.draw();
}

function mousePressed() {
  GameState.onPressed();
}

function constrainCanvas({ canvas }) {
  canvas.style = "";
}
