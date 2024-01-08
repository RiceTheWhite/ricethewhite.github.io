const catElement = document.createElement("div");
const size = 48

let catPosX = size;
let catPosY = size;

let mousePosX = 0;
let mousePosY = 0;
let mouseDown = false;

function init() {
  catElement.id = "cat";
  catElement.ariaHidden = true;
  catElement.style.width = `${size*2}px`;
  catElement.style.height = `${size*2}px`;
  catElement.style.backgroundSize = `${size*2}px ${size*2}px`;
  catElement.style.position = "fixed";
  catElement.style.pointerEvents = "none";
  catElement.style.backgroundImage = 'url("cat/jump1_E.png")';
  catElement.style.imageRendering = "pixelated";
  catElement.style.left = `${catPosX - size}px`;
  catElement.style.top = `${catPosY - size}px`;
  catElement.style.zIndex = Number.MAX_VALUE;

  document.body.appendChild(catElement);

  document.addEventListener("mousemove", function (event) {
    mousePosX = event.clientX;
    mousePosY = event.clientY;
  });

  catElement.addEventListener("mousedown", function (event) {
    mouseDown = true
  });

  document.addEventListener("mouseup", function (event) {
    mouseDown = false
  });
  
  window.requestAnimationFrame(onAnimationFrame)
}

let lastFrameTimestamp;
function onAnimationFrame(timestamp) {
  frame()
  window.requestAnimationFrame(onAnimationFrame);
}

let currentFrame = -1;
let direction;
let animFrame = 0;

function setSprite(dir) {
  animFrame += 1;

  if (isIdling) {
    catElement.style.backgroundImage = `url(${`cat/jump2_${dir}.png`})`
    return
  }
  catElement.style.backgroundImage = `url(${`cat/jump${animFrame%4+1}_${dir}.png`})`
}

const catSpeed = 10 * size/24;
let isIdling = true;

function frame() {
  currentFrame += 1;
  const diffX = catPosX - mousePosX;
  const diffY = catPosY - mousePosY;
  const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

  let direction;
  direction = diffY / distance > 0.5 ? "N" : "";
  direction += diffY / distance < -0.5 ? "S" : "";
  direction += diffX / distance > 0.5 ? "W" : "";
  direction += diffX / distance < -0.5 ? "E" : "";

  if (mouseDown) {
    catElement.style.pointerEvents = "auto";
    catElement.style.cursor = "grabbing";
    catPosX = mousePosX;
    catPosY = mousePosY;
    catElement.style.left = `${catPosX - size}px`;
    catElement.style.top = `${catPosY - size}px`;
    return
  }

  if (distance < 50*size/24) {
    isIdling = true

    if (distance < 30*size/24) {
      catElement.style.pointerEvents = "auto";
      catElement.style.cursor = "grab"
    } else {
      catElement.style.pointerEvents = "none";
    }

  } else {
    isIdling = false
  }

  //DIRTY ASS FUCKING HACK OH MY GOD I LOVE THIS
  if (currentFrame%6) {
    return
  }

  setSprite(direction)

  if (isIdling) {
    return
  }


  catPosX -= (diffX / distance) * catSpeed;
  catPosY -= (diffY / distance) * catSpeed;

  catPosX = Math.min(Math.max(size*2, catPosX), window.innerWidth - size*2);
  catPosY = Math.min(Math.max(size*2, catPosY), window.innerHeight - size*2);

  catElement.style.left = `${catPosX - size}px`;
  catElement.style.top = `${catPosY - size}px`;
}

init()