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

function constrainCanvas({ canvas }) {
  canvas.style = "";
}
