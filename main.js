console.log("Starting");
let myBox;
let myBox2;
let context;
let allBoxes;
let mousePosX;
let mousePosY;
let me;
const setupFunction = () => {
  console.log("Loading canvas");
  globalCanvas = document.getElementById("shadowCanvas");
  pRatio = devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  globalCanvas.width = width * pRatio;
  globalCanvas.height = height * pRatio;

  globalCanvas.style.width = globalCanvas.width + "px";
  globalCanvas.style.height = globalCanvas.height + "px";

  context = globalCanvas.getContext("2d");
  allBoxes = new Boxes(context, width, height);
  me = new Player(context, 300, 300);
  me.showPlayer();

  // window.addEventListener("mousemove", handleMouseMove);
};

class Box {
  constructor({
    context = context,
    width = 30 + Math.random() * 20,
    height = 30 + Math.random() * 20,
    posX = 100 + Math.random() * 500,
    posY = 100 + Math.random() * 500,
  }) {
    this.cx = posX;
    this.cy = posY;
    this.width = width;
    this.height = height;
    this.context = context;
    this.minAngle = Infinity;
    this.maxAngle = -Infinity;
    this.corners = {
      tL: { x: this.cx - this.width / 2, y: this.cy - this.height / 2 },
      tR: { x: this.cx + this.width / 2, y: this.cy - this.height / 2 },
      bL: { x: this.cx - this.width / 2, y: this.cy + this.height / 2 },
      bR: { x: this.cx + this.width / 2, y: this.cy + this.height / 2 },
    };
    this.bottomShadowCorner = this.corners.tL;
    this.topShadowCorner = this.corners.bR;
  }
  moveBox(x, y) {
    console.log("Moving boxes");
    this.cx += x;
    this.cy += y;
    this.corners = {
      tL: { x: this.cx - this.width / 2, y: this.cy - this.height / 2 },
      tR: { x: this.cx + this.width / 2, y: this.cy - this.height / 2 },
      bL: { x: this.cx - this.width / 2, y: this.cy + this.height / 2 },
      bR: { x: this.cx + this.width / 2, y: this.cy + this.height / 2 },
    };
  }
  drawSelf() {
    this.context.fillStyle = "#000";
    this.context.beginPath();
    this.context.strokeStyle = "#000";

    this.context.rect(
      this.cx - this.width / 2,
      this.cy - this.height / 2,
      this.width,
      this.height
    );
    this.context.stroke();

    this.context.fillRect(
      this.cx - this.width / 2,
      this.cy - this.height / 2,
      this.width,
      this.height
    );
  }

  updateShadowCorners(fromX, fromY, camX, camY) {
    fromX -= camX;
    fromY -= camY;
    this.minAngle = Infinity;
    this.maxAngle = -Infinity;
    this.context.beginPath();
    let length = Math.max(width, height);
    let previousCorner = this.corners.bR;
    let prevX = previousCorner.x;
    let prevY = previousCorner.y;
    Object.values(this.corners).forEach((corner) => {
      let delX = corner.x - fromX;
      let delY = fromY - corner.y;
      let scaleFactor = length / Math.min(Math.abs(delX), Math.abs(delY));

      this.context.lineTo(corner.x, corner.y);
      this.context.lineTo(
        corner.x + delX * scaleFactor,
        corner.y - delY * scaleFactor
      );
      this.context.lineTo(prevX, prevY);
      this.context.stroke();
      this.context.closePath();
      prevX = corner.x + delX * scaleFactor;
      prevY = corner.y - delY * scaleFactor;
      this.context.fillStyle = "rgba(255,0,0,0.1)";

      this.context.fillStyle = "rgba(0,0,0,255)";
      this.context.fill();
      previousCorner = corner;
      this.drawSelf();
    });
    this.context.closePath();
  }
}

/*
Individual box definition above


















Collective boxes definition below
*/

class Boxes {
  constructor(context, width, height) {
    this.context = context;
    this.boxes = [];
    this.width = width;
    this.height = height;
    this.createBoxes(50);
    setInterval(() => this.moveBoxes(0.1, 0.1), 10);
  }

  createBoxes(n) {
    for (let i = 0; i < Math.floor(Math.sqrt(n)) + 1; i++) {
      for (let j = 0; j < Math.ceil(Math.sqrt(n)); j++) {
        if (Math.random() < 0.003) continue;
        let box = new Box({
          context: this.context,

          posX: (i * this.width) / Math.sqrt(n) + Math.random() * 200 - 100,
          posY: (j * this.height) / Math.sqrt(n) + Math.random() * 200 - 100,
        });
        box.drawSelf();
        this.boxes.push(box);
      }
    }
  }
  updateBoxes(x, y) {
    this.boxes.forEach((box) => {
      box.updateShadowCorners(x, y, 0, 0);
    });
  }
  moveBoxes(x, y) {
    // box.updateShadowCorners(x, y, 0, 0);
    // this.boxes.forEach((box) => {
    //   box.moveBox(x, y);
    //   // this.updateBoxes(e.clientX, e.clientY, 0, 0);
    //   box.drawSelf()
    //   // nonMouseMove()
    // });
    // this.context.translate(x, y);
  }
  animate() {}
}

class Player {
  constructor(context, x, y) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.prevTime = Date.now();
    window.addEventListener("keydown", (e) => {
      console.log("Keydown");
      switch (e.key) {
        case "ArrowUp":
          this.vy = -0.2;
          this.vx = 0;
          break;
        case "ArrowDown":
          this.vy = 0.2;
          this.vx = 0;
          break;
        case "ArrowLeft":
          this.vx = -0.2;
          this.vy = 0;
          break;
        case "ArrowRight":
          this.vx = 0.2;
          this.vy = 0;
          break;
      }
    });
    this.animatePlayer();
  }
  showPlayer() {
    this.context.fillStyle = "#00F";
    this.context.beginPath();
    this.context.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    this.context.fill();
  }
  animatePlayer() {
    playerMove(this.x, this.y, 0, 0);
    this.showPlayer();

    console.log("Animating");
    let currentTime = Date.now();
    let deltaTime = currentTime - this.prevTime;
    this.x += (this.vx * deltaTime) / 10000;
    this.y += (this.vy * deltaTime) / 10000;
    requestAnimationFrame(this.animatePlayer.bind(this));
  }
}

const handleMouseMove = (e) => {
  //   console.log(e);
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  mousePosX = e.clientX;
  mousePosY = e.clientY;
  allBoxes.updateBoxes(e.clientX, e.clientY, 0, 0);
  me.showPlayer();
};

const nonMouseMove = () => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  allBoxes.updateBoxes(mousePosX, mousePosY, 0, 0);
};
const playerMove = (x, y) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  // mousePosX = e.clientX;
  // mousePosY = e.clientY;
  allBoxes.updateBoxes(x, y, 0, 0);
}

// setInterval(() => { allBoxes.updateBoxes(mousePosX, mousePosY, 0, 0) }, 100)
// setInterval(() => { context.clearRect(0, 0, window.innerWidth, window.innerHeight) }, 10)
window.addEventListener("load", setupFunction);
