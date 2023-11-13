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

  constructor(name) {
    GameState.allStates[name] = this;
  }

  setup() {}

  draw() {}
}
