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
    this._insertPaddleR(this.paddleWidth, this.paddleHeight);
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
      // this.rightPaddle.changeMovement(-2);

      this.ball.x += this.ball.horizontalMovement;
      this.ball.y += this.ball.verticalMovement;
      this.rightPaddle.y += this.rightPaddle.verticalMovement;
      if (this._ballHitsLeftPaddle()) {
        this._leftPaddleHit();
      }

      if (this._ballHitsBarrier()) {
        this.ball.multiplyMovement(1, -1);
      }

      if (this._ballHitsRightPaddle()) {
        this._rightPaddleHit();
      }
    });
  }

  _ballHitsBarrier() {
    if (this.ball.verticalContact[1] < 0) {
      this.ball.y += 10; // need to remove ball from contact zone so the same boolean value wont be returned
      return true;
    } else if (this.ball.verticalContact[0] > this.app.view.height) {
      this.ball.y -= 10; // need to remove ball from contact zone so the same boolean value wont be returned
      return true;
    }
    return false;
  }
  _updateContactPoints() {
    this.leftPaddle.updateContactPoints();
    this.rightPaddle.updateContactPoints();
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
  _rightPaddleHit() {
    const fourthQuadrant = [
      (this.rightPaddle.verticalContact[1] + this.rightPaddle.y) / 2,
      this.rightPaddle.verticalContact[1],
    ];
    const thirdQuadrant = [
      this.rightPaddle.y,
      (this.rightPaddle.verticalContact[1] + this.rightPaddle.y) / 2,
    ];
    const secondQuadrant = [
      (this.rightPaddle.verticalContact[0] + this.rightPaddle.y) / 2,
      this.rightPaddle.y,
    ];
    const firstQuadrant = [
      this.rightPaddle.verticalContact[0],
      (this.rightPaddle.verticalContact[0] + this.rightPaddle.y) / 2,
    ];

    if (this.ball.y >= fourthQuadrant[1] && this.ball.y <= fourthQuadrant[0]) {
      this.ball.changeMovement(-2, -3);
    } else if (
      this.ball.y >= thirdQuadrant[1] &&
      this.ball.y <= thirdQuadrant[0]
    ) {
      this.ball.changeMovement(-2, -1);
    } else if (
      this.ball.y >= secondQuadrant[1] &&
      this.ball.y <= secondQuadrant[0]
    ) {
      this.ball.changeMovement(-2, 1);
    } else if (
      this.ball.y >= firstQuadrant[1] &&
      this.ball.y <= firstQuadrant[0]
    ) {
      this.ball.changeMovement(-2, 3);
    }
  }

  _ballHitsRightPaddle() {
    if (
      this.ball.horizontalContact[1] - this.rightPaddle.horizontalContact >
      0
    ) {
      if (
        this.ball.y >= this.rightPaddle.verticalContact[1] &&
        this.ball.y <= this.rightPaddle.verticalContact[0]
      ) {
        return true;
      }
    }
    return false;
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
    this.leftPaddle.updateContactPoints = function () {
      this.verticalContact = [
        this.y + this.yDifferential, // bottom of paddle
        this.y - this.yDifferential, // top of paddle
      ];
      this.horizontalContact = this.x + this.xDifferential;
    };
  }
  _insertPaddleR(width, height) {
    this.rightPaddle = new PIXI.Sprite.from(PIXI.Texture.WHITE);
    this.rightPaddle.anchor.set(0.5, 0.5);
    this.rightPaddle.x = this.app.view.width - 15;
    this.rightPaddle.y = this.app.view.height / 2;
    this.rightPaddle.height = height;
    this.rightPaddle.width = width;
    this.app.stage.addChild(this.rightPaddle);

    // creating my own members
    this.rightPaddle.verticalMovement = 0;

    this.rightPaddle.changeMovement = function (x) {
      this.verticalMovement = x;
    };

    // Need these values to make the paddle coming into contact with the pong more realistic
    this.rightPaddle.yDifferential =
      this.rightPaddle.height / 2 + this.ballHeight / 2;
    this.rightPaddle.xDifferential = this.rightPaddle.width / 2;

    // actual phsyical point of contact for paddle when coming into contact with ball

    this.rightPaddle.updateContactPoints = function () {
      this.verticalContact = [
        this.y + this.yDifferential, // bottom of paddle
        this.y - this.yDifferential, // top of paddle
      ];
      this.horizontalContact = this.x - this.xDifferential;
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
    this.ball.updateContactPoints = function () {
      this.verticalContact = [this.y + this.radius, this.y - this.radius];
      this.horizontalContact = [this.x - this.radius, this.x + this.radius];
    };

    // current movement of ball
    this.ball.horizontalMovement = -5;
    this.ball.verticalMovement = 0;

    // creating my own methods
    this.ball.changeMovement = function (x, y) {
      this.horizontalMovement = x;
      this.verticalMovement = y;
    };

    this.ball.multiplyMovement = function (x, y) {
      this.horizontalMovement = this.horizontalMovement * x;
      this.verticalMovement = this.verticalMovement * y;
    };
  }
}

let pong = new Pong();
pong.start();
