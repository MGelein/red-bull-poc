function setup() {
  Network.init("TestingRoom");
  constrainCanvas(createCanvas(375, 667));
}

function draw() {
  GameState.draw();
}

function constrainCanvas({ canvas }) {
  canvas.style = "";
}
