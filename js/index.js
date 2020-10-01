//element declarations
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var scorecard = document.getElementById("score");
var footer = document.getElementById("footer");
//click Elvents
canvas.addEventListener("click", tapHandler);
canvas.addEventListener("touchstart", function(event) {
  event.preventDefault();
  tapHandler();
});
//element sizing
if (innerWidth >= innerHeight) {
  canvas.height = innerHeight - 5;
  canvas.width = innerHeight - 5;
  footer.style.float = "right";
} else if (innerHeight >= innerWidth) {
  canvas.height = innerWidth - 5;
  canvas.width = innerWidth - 5;
  footer.style.float = "bottom";
} else {
  document.write("Unable to read Window Width and Height");
  console.log("No video output stream detected, The game in probably running in terminal and not a browser");
}
var sz = canvas.width;
var un = sz / 5;  //A unit for playground scaling
var grassImage = new Image();
grassImage.addEventListener("load", function() {
  ctx.drawImage(grassImage, 0, 0, sz, sz);
});
grassImage.src = "assets/images/grass.png";
var landImage = new Image();
landImage.addEventListener("load", function() {
ctx.drawImage(landImage, un, un, 3 * un, 3 * un);
ctx.drawImage(grassImage, 2 * un, 2 * un, un, un);
});
landImage.src = "assets/images/land.png";
renderPlayground(); //playground drawing
function renderPlayground() {
ctx.drawImage(grassImage, 0, 0, sz, sz);
ctx.drawImage(landImage, un, un, 3 * un, 3 * un);
ctx.drawImage(grassImage, 2 * un, 2 * un, un, un);
}
//playground partition
var leftOut = un;
var topOut = un;
var rightOut = 4 * un;
var bottomOut = 4 * un;
var leftIn = 2 * un;
var topIn = 2 * un;
var rightIn = 3 * un;
var bottomIn = 3 * un;
//ball Object
var ball = {
  x: leftOut + 2,
  y: topIn + 2,
  width: un / 2,
  height: un / 2
};
var speed = 1; //ball speed
//ball image loading
var ballImage = new Image();
ballImage.onload = function() {
  ctx.drawImage(ballImage, ball.x, ball.y, ball.height, ball.width);
};
ballImage.src = "assets/images/ball.png";
//game start
var started = false;
var direction = "left";
function renderBall() {
  ctx.drawImage(ballImage, ball.x, ball.y, ball.width, ball.height);
}
function changeDirection() {
  if(direction == "up") {
    direction = "right";
  } else if(direction == "right") {
    direction = "down";
  } else if(direction == "down") {
    direction = "left";
  } else if(direction == "left") {
    direction = "up";
  }
}
function mangle() { //move the ball
  if(direction == "up") {
    ball.y = ball.y - speed;
  } else if(direction == "right") {
    ball.x = ball.x + speed;
  } else if(direction == "down") {
    ball.y = ball.y + speed;
  } else if(direction == "left") {
    ball.x = ball.x - speed;
  }
}
var speedCounter = 0; //speed increase validity checker
function updateSpeed() { //increase Speed if valid
  if(speedCounter == 9) {
    speed++;
    speedCounter = 0;
  } else {
    speedCounter++;
  }
}
var renderer;
//mainloop
function tapHandler() {
  changeDirection();
  updateSpeed();
  if(!started) {
    loop();
    started = true;
  }
}
function isColliding() {
  if(ball.x < un || ball.y < un || ball.x + ball.width > un * 4 || ball.y + ball.height > un * 4) {
    return true;
  } else if(ball.x + ball.width > 2 * un && ball.y + ball.height > 2 * un && ball.x < 3 * un && ball.y < 3 * un) {
    return true;
  } else {
    return false;
  }
}
var toClose = false;
var score = 0;
function updateScore() {
  score++;
  scorecard.innerHTML = "Score:" + score;
}
function loop() {
  renderPlayground();
  renderBall();
  if(isColliding()) {
    cancelAnimationFrame(renderer);
    toClose = true;
    window.navigator.vibrate(200);
    return;
  }
  if(toClose) {
    close();
  }
  mangle();
  updateScore();
  renderer = requestAnimationFrame(loop);
}
