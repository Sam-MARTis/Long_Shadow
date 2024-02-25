console.log("Starting");
const setupFunction = () => {
    console.log("Loading canvas");
    globalCanvas = document.getElementById("shadowCanvas");
    pRatio = devicePixelRatio || 1;
    width = window.innerWidth
    height = window.innerHeight
    globalCanvas.width = width * pRatio
    globalCanvas.height = width*pRatio
    
    globalCanvas.style.width = globalCanvas.height + 'px';
    globalCanvas.style.height = globalCanvas.height + 'px';

  context = globalCanvas.getContext("2d");
  const myPlayer = new Box(context);
  myPlayer.draw();
};

class Box {
  constructor(context, width = 30+Math.random()*20, height = 30+Math.random()*20) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.context = context;
  }
  draw() {
    console.log("Drawing");
    this.context.fillStyle = "#8AF";
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
}

window.addEventListener("load", setupFunction);
