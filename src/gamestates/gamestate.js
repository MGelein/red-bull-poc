class GameState {
  static allStates = {};
  static active;

  static setActive(name) {
    const next = this.allStates[name];
    if (!next) return console.log("No gamestate was found with name", name);

    next.setup();
    this.active = next;
  }

  static draw() {
    this.active?.draw();
  }

  static onPressed() {
    this.active?.onPressed();
  }

  static onCommand(command, payload) {
    this.active?.onCommand(command, payload);
  }

  constructor(name) {
    GameState.allStates[name] = this;
  }

  setup() {}

  draw() {}

  onPressed() {}

  onCommand(command, payload) {}
}
