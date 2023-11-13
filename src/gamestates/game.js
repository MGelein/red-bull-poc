const STAGE_COUNTDOWN = "countdown";
const STAGE_WAITING = "waiting";
const STAGE_PRESSES = "presses";
const STAGE_CORRECT = "correct";
const CORRECT_THRESHOLD = 30;

class Game extends GameState {
  static activeRound = 0;

  constructor() {
    super("game");
  }

  setup() {
    this.correctFrames = 0;
    this.countDown = 2;
    this.stage = STAGE_COUNTDOWN;
    this.hue = random(255);
    this.targetHue = random(255);

    const interval = setInterval(() => {
      this.countDown--;
      if (this.countDown < 0) {
        clearInterval(interval);
        this.stage = STAGE_WAITING;
      }
    }, 1000);
  }

  draw() {
    if (this.stage === STAGE_COUNTDOWN) this.drawCountdown();
    if (this.stage === STAGE_WAITING) this.drawWaiting();
    if (this.stage === STAGE_PRESSES) this.drawPresses();
    if (this.stage === STAGE_CORRECT) this.drawCorrect();
  }

  drawCorrect() {
    background(this.pickedColor);
    textSize(80);
    fill(255);
    let label = "Correct";
    let tw = textWidth(label);
    text(label, width / 2 - tw / 2, height / 2 - 40);
  }

  drawPresses() {
    background(this.pickedColor);
    textSize(80);
    fill(255);
    let label = "Now!";
    let tw = textWidth(label);
    text(label, width / 2 - tw / 2, height / 2 - 40);

    textSize(40);
    label = "Touches: " + touches.length;
    tw = textWidth(label);
    text(label, width / 2 - tw / 2, height / 2 + 60);

    if (touches.length === this.correctAmount) {
      this.correctFrames++;
      if (this.correctFrames === 1) {
        //first frame we are correct, take timestamp
        this.endTime = millis();
      }
      if (this.correctFrames > CORRECT_THRESHOLD) {
        this.stage = STAGE_CORRECT;
        Network.sendReactionTime(this.endTime - this.startTime);
      }
    } else {
      this.correctFrames = 0;
      this.endTime = undefined;
    }
  }

  drawWaiting() {
    const deltaHue = this.targetHue - this.hue;
    if (abs(deltaHue) < 1) {
      this.targetHue = random(255);
    }
    this.hue += deltaHue * 0.03;
    background(color(this.hue, 150, 255));

    textSize(64);
    fill(255);
    let label = "Wait for it...";
    let tw = textWidth(label);
    text(label, width / 2 - tw / 2, height / 2 - 32);
    fill(0);
    label = "Wait for it...";
    tw = textWidth(label);
    text(label, width / 2 - tw / 2, height / 2 + 32);
  }

  drawCountdown() {
    textSize(64);
    const label = "Ready?";
    const tw = textWidth(label);
    text(label, width / 2 - tw / 2, height / 2 - 32);
  }

  onCommand(command, payload) {
    if (command === SHOW_COLOR) {
      this.stage = STAGE_PRESSES;
      this.pickedColor = payload;
      this.startTime = millis();
      this.correctFrames = 0;
    }
  }

  get correctAmount() {
    return this.pickedColor === colors.orange ? 2 : 1;
  }
}

const game = new Game();
