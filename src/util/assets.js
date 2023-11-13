class Assets {
  static preload() {
    this.font = loadFont("assets/fonts/Roboto-Light.ttf");
  }

  static load() {
    textFont(this.font);
  }
}
