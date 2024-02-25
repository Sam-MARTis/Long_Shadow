console.log("Starting");
let myBox;
let myBox2;
let context;
let allBoxes;
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
    allBoxes = new Boxes(context, width, height)

  window.addEventListener("mousemove", handleMouseMove);
};

class Box {
    constructor(
        {
            context = context,
            width = 30 + Math.random() * 20,
            height = 30 + Math.random() * 20,
            posX = 100 + Math.random() * 500,
            posY = 100 + Math.random() * 500
        }
  ) {
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
    // console.log(this.corners);
  }
  drawSelf() {
    // console.log("Drawing");
    this.context.fillStyle = "#8AF";
    this.context.beginPath();
    this.context.strokeStyle = "#468";

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
  drawShadow(fromX, fromY) {
    this.updateShadowCorners(fromX, fromY);
    // console.log("bottomShadowCorner", this.bottomShadowCorner);
    // console.log("topShadowCorner", this.topShadowCorner);
    this.drawFromCorner(
      this.bottomShadowCorner,
      this.topShadowCorner,
      this.minAngle,
      this.maxAngle
    );
    // console.log("Drawing shadow");
  }
  drawFromCorner(bottomCorner, topCorner, minAngle, maxAngle) {
    let maxTrigValue = Math.max(
      Math.abs(1 / Math.sin(minAngle)),
      Math.abs(1 / Math.cos(minAngle)),
      Math.abs(1 / Math.sin(maxAngle)),
      Math.abs(1 / Math.cos(maxAngle))
    );
    let length = Math.max(width * maxTrigValue, height * maxTrigValue);
    //   let length = 100
    this.context.beginPath();
    this.context.strokeStyle = "rgba(0,0,0,0.1)";
    let bottomStartPosX = bottomCorner.x;

    let bottomStartPosY = bottomCorner.y;
    let topStartPosX = topCorner.x;
    let topStartPosY = topCorner.y;
    let topEndPosX = topStartPosX + Math.cos(maxAngle) * length;
    let topEndPosY = topStartPosY - Math.sin(maxAngle) * length;
    let bottomEndPosX = bottomStartPosX + Math.cos(minAngle) * length;
    let bottomEndPosY = bottomStartPosY - Math.sin(minAngle) * length;

    this.context.moveTo(topStartPosX, topStartPosY);
    this.context.lineTo(bottomStartPosX, bottomStartPosY);
    this.context.lineTo(bottomEndPosX, bottomEndPosY);
    this.context.lineTo(bottomEndPosX, topEndPosY);
    this.context.lineTo(topEndPosX, topEndPosY);
    this.context.lineTo(topStartPosX, topStartPosY);
    this.context.closePath();
    this.context.fillStyle = "rgba(0,0,0,0.2";
    this.context.fill();
    this.context.stroke();
    this.drawSelf();
  }
  updateShadowCorners(fromX, fromY) {
    this.minAngle = Infinity;
    this.maxAngle = -Infinity;
    Object.values(this.corners).forEach((corner) => {
      //   console.log("Corner x: " + corner.x);
      //   console.log("Corner y: " + corner.y);
      let delX = corner.x - fromX;
      let delY = fromY - corner.y;
      let angle = Math.atan2(delY, delX);
      //   console.log(corner, angle);
      if (angle < this.minAngle) {
        this.minAngle = angle;
        this.bottomShadowCorner = corner;
      }
      if (angle > this.maxAngle) {
        this.maxAngle = angle;
        this.topShadowCorner = corner;
      }
    });
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
    this.createBoxes(10);
  }

  createBoxes(n) {
      for (let i = 0; i < Math.floor(Math.sqrt(n))+1; i++) {
          for (let j = 0; j < Math.ceil(Math.sqrt(n)); j++) {
              if (Math.random() < 0.3) continue;
              let box = new Box({
                  context: this.context,

                  posX:
                      i* this.width/ Math.sqrt(n) +
                      Math.random()*200 -100,
                  posY:
                      (j * this.height) / Math.sqrt(n) +
                      Math.random()*200 -100,
              });
              box.drawSelf();
              this.boxes.push(box);
          }
      }
  }
  updateBoxes(x, y) {
    this.boxes.forEach((box) => {
      box.drawShadow(x, y);
    });
  }
}
const handleMouseMove = (e) => {
  //   console.log(e);
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  allBoxes.updateBoxes(e.clientX, e.clientY);
  //   myBox.drawShadow(e.clientX, e.clientY);
  //   myBox2.drawShadow(e.clientX, e.clientY);
};
window.addEventListener("load", setupFunction);
