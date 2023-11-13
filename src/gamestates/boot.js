class Boot extends GameState {
  constructor() {
    super("boot");
    this.animFrame = 0;
  }

  setup() {
    Network.init("table42", () => {
      GameState.setActive("lobby");
    });
  }

  draw() {
    this.animFrame += 0.1;

    fill(200 + 55 * sin(this.animFrame));
    textSize(60);
    const tw = textWidth(Network.status);
    text(Network.status, width / 2 - tw / 2, height / 2 - 30);
  }
}

const boot = new Boot();
