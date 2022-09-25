class StartGame {
  constructor() {
    this.curDirection = -3;
    this.app = new PIXI.Application({
      width: 799,
      height: 599,
      backgroundColor: 0xaaaaa9,
    });
    document.body.appendChild(this.app.view);
    this._insertPaddleL();
    this._insertBall();
    document.addEventListener("keydown", (e) => {
      if (
        e.code === "ArrowDown" &&
        this.leftPaddle.y + 40 < this.app.view.height
      ) {
        this.leftPaddle.y += 20;
      } else if (e.code === "ArrowUp" && this.leftPaddle.y - 20 > 20) {
        this.leftPaddle.y -= 20;
      }
    });
    this.app.ticker.add((delta) => {
      this.ball.x += this.curDirection;
      if (
        this.ball.x < this.leftPaddle.x + 1 &&
        this.ball.x > this.leftPaddle.x - 1
      )
        this.curDirection = 3;
    });
  }
  _insertPaddleL() {
    this.leftPaddle = new PIXI.Sprite.from(PIXI.Texture.WHITE);
    this.leftPaddle.anchor.set(0.5, 0.5);
    this.leftPaddle.x = 15;
    this.leftPaddle.y = this.app.view.height / 2;
    this.leftPaddle.height = 75;
    this.leftPaddle.width = 10;
    this.app.stage.addChild(this.leftPaddle);
  }
  _insertBall() {
    this.ball = new PIXI.Graphics();
    this.ball.beginFill(0xffffff);
    this.ball.drawCircle(15, 15, 15);
    this.ball.endFill();
    this.ball.x = this.app.view.width / 2;
    this.ball.y = this.app.view.height / 2;
    this.app.stage.addChild(this.ball);
  }
}

let start = new StartGame();
