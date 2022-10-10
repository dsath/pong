class Pong {
  constructor() {
    this.ballHeight = 30;
    this.ballWidth = 30;
    this.paddleWidth = 10;
    this.paddleHeight = 75;

    this.app = new PIXI.Application({
      width: 799,
      height: 599,
      backgroundColor: 0xaaaaa9,
    });
    document.body.appendChild(this.app.view);
    this._insertPaddleL(this.paddleWidth, this.paddleHeight);
    this._insertBall(this.ballWidth, this.ballHeight);
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
  }

  start() {
    this.app.ticker.add((delta) => {
      this.leftPaddle.updatePhysicals();
      this.ball.updatePhysicals();

      this.ball.x += this.ball.horizontalMovement;
      this.ball.y += this.ball.verticalMovement;
      let quadrant = this._ballHitsLeftPaddle();
      console.log(quadrant);
      switch (quadrant) {
        case 2:
          this.ball.changeMovement(2, -3);
          break;

        case 1:
          this.ball.changeMovement(2, -1);
          break;

        case -1:
          this.ball.changeMovement(2, 1);
          break;

        case -2:
          this.ball.changeMovement(2, 3);
          break;

        default:
          break;
      }
    });
  }

  _ballHitsLeftPaddle() {
    const fourthQuadrant = [
      (this.leftPaddle.physicalY[1] + this.leftPaddle.y) / 2,
      this.leftPaddle.physicalY[1],
    ];
    const thirdQuadrant = [
      this.leftPaddle.y,
      (this.leftPaddle.physicalY[1] + this.leftPaddle.y) / 2,
    ];
    const secondQuadrant = [
      (this.leftPaddle.physicalY[0] + this.leftPaddle.y) / 2,
      this.leftPaddle.y,
    ];
    const firstQuadrant = [
      this.leftPaddle.physicalY[0],
      (this.leftPaddle.physicalY[0] + this.leftPaddle.y) / 2,
    ];
    console.log(this.ball.y, fourthQuadrant);

    if (this.ball.physicalX - this.leftPaddle.physicalX < 0) {
      if (
        this.ball.y >= fourthQuadrant[1] &&
        this.ball.y <= fourthQuadrant[0]
      ) {
        return 2;
      } else if (
        this.ball.y >= thirdQuadrant[1] &&
        this.ball.y <= thirdQuadrant[0]
      ) {
        return 1;
      } else if (
        this.ball.y >= secondQuadrant[1] &&
        this.ball.y <= secondQuadrant[0]
      ) {
        return -1;
      } else if (
        this.ball.y >= firstQuadrant[1] &&
        this.ball.y <= firstQuadrant[0]
      ) {
        return -2;
      } else {
        return 0;
      }
    }
    return 0;
  }

  _insertPaddleL(width, height) {
    this.leftPaddle = new PIXI.Sprite.from(PIXI.Texture.WHITE);
    this.leftPaddle.anchor.set(0.5, 0.5);
    this.leftPaddle.x = 15;
    this.leftPaddle.y = this.app.view.height / 2;
    this.leftPaddle.height = height;
    this.leftPaddle.width = width;
    this.app.stage.addChild(this.leftPaddle);

    // creating my own members

    // Need these values to make the paddle coming into contact with the pong more realistic
    this.leftPaddle.yDifferential =
      this.leftPaddle.height / 2 + this.ballHeight / 2;
    this.leftPaddle.xDifferential = this.leftPaddle.width / 2;

    // actual phsyical point of contact for paddle when coming into contact with ball
    this.leftPaddle.updatePhysicals = () => {
      this.leftPaddle.physicalY = [
        this.leftPaddle.y + this.leftPaddle.yDifferential, // bottom of paddle
        this.leftPaddle.y - this.leftPaddle.yDifferential, // top of paddle
      ];
      this.leftPaddle.physicalX =
        this.leftPaddle.x + this.leftPaddle.xDifferential;
    };
  }

  _insertBall(width, height) {
    this.ball = new PIXI.Sprite.from("./assets/pong_ball.png");
    this.ball.x = this.app.view.width / 2;
    this.ball.y = this.app.view.height / 2;
    this.ball.height = width;
    this.ball.width = height;
    this.ball.anchor.set(0.5, 0.5);
    this.app.stage.addChild(this.ball);

    // creating my own members

    // Need these values to make the paddle coming into contact with the pong more realistic
    this.ball.xDifferential = this.ball.width / 2;

    // Actual physical point of contact for ball to hit paddle
    this.ball.updatePhysicals = () => {
      this.ball.physicalX = this.ball.x - this.ball.xDifferential;
    };

    // current movement of ball
    this.ball.horizontalMovement = -1;
    this.ball.verticalMovement = 0;

    // creating my own methods
    this.ball.changeMovement = (x, y) => {
      this.ball.horizontalMovement = x;
      this.ball.verticalMovement = y;
    };
  }
}

let pong = new Pong();
pong.start();
