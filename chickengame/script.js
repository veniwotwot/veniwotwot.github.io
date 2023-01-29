const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 900;
CANVAS_HEIGHT = canvas.height = 600;
const gridWidth = 9;
const gridHeight = 6;
const grid = [];
let frame = 1;
let score = 0;
let ingame = false;
var soundtrack;

//adjustable by user
let spawnCount = 1;
let timeLimit = 60;
let hearts = 3;

//assets
let chicken = new Image();
chicken.src = 'assets/chicken.jpg';
let warning = new Image();
warning.src = 'assets/danger.png';

class GridSquare {
  constructor(a, b) {
    this.x = a * 100;
    this.y = b * 100;
    this.width = 100;
    this.height = 100;
    this.warning = false;
    this.warningFrame = -1;
    this.active = false;
    this.activationFrame = -1;
  }
  draw() {
    if (this.active) {
      //ctx.fillStyle = "red";
      //ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.drawImage(chicken, this.x, this.y, this.width, this.height);
    }
    else if (this.warning) {
      //ctx.fillStyle = "orange";
      //ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.drawImage(warning, this.x, this.y, this.width, this.height);
    }
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
  loudsquawk() {
    let num = Math.ceil(Math.random() * 6);
    var squawk = new Audio(`assets/squawk${num}.wav`);
    console.log("SQUAWK");
    squawk.play();
  }
}

//Populate Grid Array
function populate() {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      grid.push(new GridSquare(x, y));
    }
  }
}

function randomize(size, times) {
  for (let i = 0; i < times; i++) {
    let chicken = Math.floor(Math.random() * size);
    grid[chicken].warning = true;
  }
}

function activate() {
  grid.forEach((square) => {
    if (square.warning) {
      if (frame - square.warningFrame >= timeLimit) {
        square.warning = false;
        square.active = true;
        square.activationFrame = frame;
        square.loudsquawk();
      }
    }
  })
}

function deactivate() {
  grid.forEach((square) => {
    if (square.active) {
      if (frame - square.activationFrame >= timeLimit) {
        square.active = false;
        hearts--;
      }
    }
  })
}

function determineLocation(x, y) {
  x = Math.floor(x / 100);
  y = Math.floor(y / 100);
  let result = 0;
  if (x > CANVAS_WIDTH || y > CANVAS_HEIGHT)
    return -1;
  while (true) {
    if (x == 0 && y == 0)
      return result;
    else if (y > 0) {
      result += 9;
      y--;
    }
    else if (x > 0) {
      result++;
      x--;
    }
  }
}

function swingHammer(x, y) {
  let squareHit = determineLocation(x, y);

  if (squareHit > -1) {
    if (grid[squareHit].active) {
      grid[squareHit].active = false;
      score++;
      document.getElementById('score').innerHTML = `Score: ${score}`;
    }
  }
}

//Mouse Position By Click
function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let mouseX = event.clientX - rect.left;
  let mouseY = event.clientY - rect.top;
  swingHammer(mouseX, mouseY);
}

let canvasElem = document.getElementById("canvas1");
canvasElem.addEventListener("mousedown", function (e) {
  getMousePosition(canvasElem, e);
});

function start() {
  if (!ingame) {
    ingame = true;
    let form = document.getElementById("cxnfig");
    spawnCount = form.elements[0].value;
    timeLimit = form.elements[1].value;
    hearts = form.elements[2].value;
    populate();
    animate();

    //Play Soundtrack
    soundtrack = new Audio('assets/squawk-idle.wav');
    soundtrack.loop = true;
    soundtrack.play();
  }
}

function gameOver() {
  soundtrack.pause();
  ingame = false;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "rgba(255,0,0,1)";
  ctx.font = "bold 30px FranklinGothicMedium";

  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, 100);
  ctx.fillText(`Your score was: ${score}`, CANVAS_WIDTH / 2, 150);
  ctx.fillText(`First time headphone users, did you enjoy yourselves?`, CANVAS_WIDTH / 2, 350);
}

//Main Animate Function
function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (frame % timeLimit == 0) {
    randomize(gridHeight * gridWidth, spawnCount);
  }
  if (frame % timeLimit == Math.floor((timeLimit / 2))) {
    activate();
    deactivate();
    document.getElementById('heartcount').innerHTML = `Heart Count: ${hearts}`;
  }

  grid.forEach(square => {
    square.draw();
  })

  frame++;
  if (hearts > 0) {
    window.requestAnimationFrame(animate);
  }
  else {
    gameOver();
  }
}

//TODO: RUBBER DUCKY (SQUEAKY DOG TOY) SOUNDTRACK

