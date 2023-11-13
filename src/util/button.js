class Button {
  constructor(label, x, y, fs) {
    this.x = x;
    this.y = y;
    this.fontSize = fs;
    textSize(fs);
    this.tw = textWidth(label);
    this.w = this.tw + fs;
    this.h = fs * 2;
    this.w2 = this.w / 2;
    this.h2 = this.h / 2;
    this.label = label;
  }

  draw() {
    push();
    translate(this.x, this.y);
    fill(255);
    textSize(this.fontSize);
    text(this.label, -this.tw / 2, this.fontSize * 0.3);
    noFill();
    stroke(255);
    strokeWeight(4);
    rect(-this.w2, -this.h2, this.w, this.h, 4);
    pop();
  }

  isOver(x, y) {
    return (
      x > this.x - this.w2 &&
      x < this.x + this.w2 &&
      y > this.y - this.h2 &&
      y < this.y + this.h2
    );
  }
}
