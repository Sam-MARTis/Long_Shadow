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
  allBoxes = new Boxes(context, width, height);

  window.addEventListener("mousemove", handleMouseMove);
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
    // this.drawFromCorner(
    //   this.bottomShadowCorner,
    //   this.topShadowCorner,
    //   this.minAngle,
    //   this.maxAngle
    // );
    // this.updateShadowCorners(fromX, fromY);
    // console.log("Drawing shadow");
  }

  // drawFromCorner(bottomCorner, topCorner, minAngle, maxAngle) {
  //   let maxTrigValue = Math.max(
  //     Math.abs(1 / Math.sin(minAngle)),
  //     Math.abs(1 / Math.cos(minAngle)),
  //     Math.abs(1 / Math.sin(maxAngle)),
  //     Math.abs(1 / Math.cos(maxAngle))
  //   );
  //   let length = Math.max(width * maxTrigValue, height * maxTrigValue);
  //   //   let length = 100
  //   this.context.beginPath();
  //   this.context.strokeStyle = "rgba(0,0,0,0.1)";
  //   let bottomStartPosX = bottomCorner.x;

  //   let bottomStartPosY = bottomCorner.y;
  //   let topStartPosX = topCorner.x;
  //   let topStartPosY = topCorner.y;
  //   let topEndPosX = topStartPosX + Math.cos(maxAngle) * length;
  //   let topEndPosY = topStartPosY - Math.sin(maxAngle) * length;
  //   let bottomEndPosX = bottomStartPosX + Math.cos(minAngle) * length;
  //   let bottomEndPosY = bottomStartPosY - Math.sin(minAngle) * length;

  //   this.context.moveTo(topStartPosX, topStartPosY);
  //   this.context.lineTo(bottomStartPosX, bottomStartPosY);
  //   this.context.lineTo(bottomEndPosX, bottomEndPosY);
  //   this.context.lineTo(bottomEndPosX, topEndPosY);
  //   this.context.lineTo(topEndPosX, topEndPosY);
  //   this.context.lineTo(topStartPosX, topStartPosY);
  //   this.context.closePath();
  //   this.context.fillStyle = "rgba(0,0,0,1";
  //   this.context.fill();
  //   this.context.stroke();
  //   this.drawSelf();
  // }
  updateShadowCorners(fromX, fromY) {
    this.minAngle = Infinity;
    this.maxAngle = -Infinity;
    Object.values(this.corners).forEach((corner) => {
      let delX = corner.x - fromX;
      let delY = fromY - corner.y;
      let angle = Math.atan2(delY, delX);
      corner.theta = angle;
      // console.log(corner, angle);
      // if (corner.theta < this.minAngle) {
      //   this.minAngle = corner.theta;
      //   this.bottomShadowCorner = corner;
      // }
      // if (corner.theta > this.maxAngle) {
      //   this.maxAngle = corner.theta;
      //   this.topShadowCorner = corner;
      // }
      // this.pickShadowCorners()



      this.context.beginPath();
      Object.values(this.corners).forEach((corner) => {
        this.context.moveTo(corner.x, corner.y);
        let angle = corner.theta;
        let maxTrigFactor = Math.max(1 / Math.sin(angle), 1 / Math.cos(angle));
        let length = Math.max(width * maxTrigFactor, height * maxTrigFactor);
        this.context.lineTo(
          corner.x + Math.abs(Math.cos(angle) * length )* Math.sign(delX),
          corner.y - Math.abs(Math.sin(angle) * length )* Math.sign(delY)
        );
        this.context.stroke();
        // this.context.closePath();
        this.context.fillStyle = "rgba(0,0,0,1";
        this.context.fill();
        this.context.stroke();
        this.drawSelf();
      });
    });
  }
  pickShadowCorners() {
    let cornerAngles = [];
    Object.values(this.corners).forEach((corner) => {
      cornerAngles.push(corner.theta);
    });
    console.log(Math.min(...cornerAngles), Math.max(...cornerAngles));

    if (Math.max(...cornerAngles) - Math.min(...cornerAngles) < Math.PI/2) {
      console.log("If statement");
      this.minAngle = Math.min(...cornerAngles);
      this.maxAngle = Math.max(...cornerAngles);
      Object.values(this.corners).forEach((corner) => {
        if (corner.theta == this.minAngle) {
          this.bottomShadowCorner = corner;
        }
        if (corner.theta == this.maxAngle) {
          this.topShadowCorner = corner;
        }
      });
    } else {
      console.log("Else statement");
      cornerAngles.forEach((angle) => {
        if (angle < 0) angle = 6.28 - angle;
      });
      this.minAngle = Math.min(...cornerAngles);
      this.maxAngle = Math.max(...cornerAngles);
      console.log(this.minAngle, this.maxAngle);
      Object.values(this.corners).forEach((corner) => {
        if (corner.theta == this.minAngle) {
          this.bottomShadowCorner = corner;
        }
        if (corner.theta == this.maxAngle) {
          this.topShadowCorner = corner;
        }
      });
    }
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
    this.createBoxes(1);
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
