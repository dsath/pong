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
      this._updateContactPoints();

      this.ball.x += this.ball.horizontalMovement;
      this.ball.y += this.ball.verticalMovement;
      if (this._ballHitsLeftPaddle()) {
        this._leftPaddleHit();
      }

      if (this._ballHitsBarrier) {
      }
    });
  }

  _ballHitsBarrier() {
    if (this.ball.verticalContact) {
    }
  }
  _updateContactPoints() {
    this.leftPaddle.updateContactPoints();
    this.ball.updateContactPoints();
  }

  // Returns true if ball is in contact with left paddle
  _ballHitsLeftPaddle() {
    if (
      this.ball.horizontalContact[0] - this.leftPaddle.horizontalContact <
      0
    ) {
      if (
        this.ball.y >= this.leftPaddle.verticalContact[1] &&
        this.ball.y <= this.leftPaddle.verticalContact[0]
      ) {
        return true;
      }
    }
    return false;
  }

  // Redirects ball after hitting left paddle
  _leftPaddleHit() {
    const fourthQuadrant = [
      (this.leftPaddle.verticalContact[1] + this.leftPaddle.y) / 2,
      this.leftPaddle.verticalContact[1],
    ];
    const thirdQuadrant = [
      this.leftPaddle.y,
      (this.leftPaddle.verticalContact[1] + this.leftPaddle.y) / 2,
    ];
    const secondQuadrant = [
      (this.leftPaddle.verticalContact[0] + this.leftPaddle.y) / 2,
      this.leftPaddle.y,
    ];
    const firstQuadrant = [
      this.leftPaddle.verticalContact[0],
      (this.leftPaddle.verticalContact[0] + this.leftPaddle.y) / 2,
    ];

    if (this.ball.y >= fourthQuadrant[1] && this.ball.y <= fourthQuadrant[0]) {
      this.ball.changeMovement(2, -3);
    } else if (
      this.ball.y >= thirdQuadrant[1] &&
      this.ball.y <= thirdQuadrant[0]
    ) {
      this.ball.changeMovement(2, -1);
    } else if (
      this.ball.y >= secondQuadrant[1] &&
      this.ball.y <= secondQuadrant[0]
    ) {
      this.ball.changeMovement(2, 1);
    } else if (
      this.ball.y >= firstQuadrant[1] &&
      this.ball.y <= firstQuadrant[0]
    ) {
      this.ball.changeMovement(2, 3);
    }
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
    this.leftPaddle.updateContactPoints = () => {
      this.leftPaddle.verticalContact = [
        this.leftPaddle.y + this.leftPaddle.yDifferential, // bottom of paddle
        this.leftPaddle.y - this.leftPaddle.yDifferential, // top of paddle
      ];
      this.leftPaddle.horizontalContact =
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
    this.ball.radius = this.ball.width / 2;

    // Actual physical point of contact for ball to hit paddle
    this.ball.updateContactPoints = () => {
      this.ball.verticalContact = [
        this.ball.y + this.ball.radius,
        this.ball.y - this.ball.radius,
      ];
      this.ball.horizontalContact = [
        this.ball.x - this.ball.radius,
        this.ball.x + this.ball.radius,
      ];
    };

    // current movement of ball
    this.ball.horizontalMovement = -5;
    this.ball.horizontalContact = [];
    this.ball.verticalMovement = 0;
    this.ball.horizontalContact = [];

    // creating my own methods
    this.ball.horizontalContact = [];
    this.ball.changeMovement = (x, y) => {
      this.ball.horizontalMovement = x;
      this.ball.verticalMovement = y;
    };
  }
}

let pong = new Pong();
pong.start();
