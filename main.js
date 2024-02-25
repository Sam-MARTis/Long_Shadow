console.log("Starting");
let myBox;
let context;
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
  myBox = new Box(context);
    myBox.drawSelf();
    window.addEventListener("mousemove", handleMouseMove);
};

class Box {
  constructor(
    context,
    width = 30 + Math.random() * 20,
    height = 30 + Math.random() * 20
  ) {
    this.cx = 100;
    this.cy = 100;
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
    console.log(this.corners);
  }
  drawSelf() {
    console.log("Drawing");
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
    this.drawFromCorner(this.bottomShadowCorner,this.topShadowCorner, this.minAngle, this.maxAngle);
    this.drawFromCorner();
    console.log("Drawing shadow");
  }
  drawFromCorner(bottomCorner, topCorner, minAngle, maxAngle) {
    let length = Math.max(width, height);
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
      this.drawSelf()
  }
  updateShadowCorners(fromX, fromY) {
    this.minAngle = Infinity;
    this.maxAngle = -Infinity;
    Object.values(this.corners).forEach((corner) => {
      console.log("Corner x: " + corner.x);
      console.log("Corner y: " + corner.y);
      let delX = corner.x - fromX;
      let delY = fromY - corner.y;
      let angle = Math.atan2(delY, delX);
      console.log(corner, angle);
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

const handleMouseMove = (e) => {
    //   console.log(e);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
  myBox.drawShadow(e.clientX, e.clientY);
};

window.addEventListener("load", setupFunction);

