class Lobby extends GameState {
  constructor() {
    super("lobby");
  }

  setup() {
    this.readyButton = new Button("Ready", width / 2, height / 2, 24);
  }

  draw() {
    if (Network.isOwner) this.drawOwner();
    else this.drawPlayer();
  }

  drawOwner() {
    textSize(30);
    let label = "Lobby: open";
    let tw = textWidth(label);
    text(label, width / 2 - tw / 2, 60);

    label = `Players: ${Network.connections.length}`;
    tw = textWidth(label);
    text(label, width / 2 - tw / 2, 120);

    label = "Press 'Ready' to start:";
    tw = textWidth(label);
    text(label, width / 2 - tw / 2, 180);

    this.readyButton.draw();
  }

  drawPlayer() {}
}

const lobby = new Lobby();
