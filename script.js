const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 40;
const mapWidth = 15;
const mapHeight = 10;

const cityMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,0,0,1,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,0,1,0,1,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,0,1,1,1,1,0,1],
  [1,0,0,1,0,0,0,1,0,0,0,0,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const player = {
  x: 1,
  y: 1,
  width: tileSize * 0.8,
  height: tileSize * 0.8,
  color: 'green',
  speed: 0.1,
  moving: false,
  inCar: false,
};

const car = {
  x: 3,
  y: 1,
  width: tileSize,
  height: tileSize * 0.6,
  color: 'red',
  speed: 0.2,
  occupied: false,
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  KeyF: false,
};

let lastTime = 0;

function drawMap() {
  for(let y = 0; y < mapHeight; y++) {
    for(let x = 0; x < mapWidth; x++) {
      ctx.fillStyle = cityMap[y][x] === 1 ? '#555' : '#ddd';
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x * tileSize + (tileSize - player.width)/2, player.y * tileSize + (tileSize - player.height)/2, player.width, player.height);
}

function drawCar() {
  ctx.fillStyle = car.color;
  ctx.fillRect(car.x * tileSize, car.y * tileSize + tileSize*0.2, car.width, car.height);
}

function canMove(x, y) {
  if(x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) return false;
  return cityMap[Math.floor(y)][Math.floor(x)] === 0;
}

function updatePosition(delta) {
  if(player.inCar) {
    let newX = car.x;
    let newY = car.y;

    if(keys.ArrowUp) newY -= car.speed * delta;
    if(keys.ArrowDown) newY += car.speed * delta;
    if(keys.ArrowLeft) newX -= car.speed * delta;
    if(keys.ArrowRight) newX += car.speed * delta;

    if(canMove(newX, newY)) {
      car.x = newX;
      car.y = newY;
    }
  } else {
    let newX = player.x;
    let newY = player.y;

    if(keys.ArrowUp) newY -= player.speed * delta;
    if(keys.ArrowDown) newY += player.speed * delta;
    if(keys.ArrowLeft) newX -= player.speed * delta;
    if(keys.ArrowRight) newX += player.speed * delta;

    if(canMove(newX, newY)) {
      player.x = newX;
      player.y = newY;
    }
  }
}

function checkCarInteraction() {
  const dx = player.x - car.x;
  const dy = player.y - car.y;
  const distance = Math.sqrt(dx*dx + dy*dy);

  if(distance < 1.5) {
    if(keys.KeyF) {
      if(player.inCar) {
        player.inCar = false;
        car.occupied = false;
        player.x = car.x + 1;
        player.y = car.y;
      } else if(!car.occupied) {
        player.inCar = true;
        car.occupied = true;
        player.x = car.x;
        player.y = car.y;
      }
      keys.KeyF = false;
    }
  }
}

function gameLoop(timestamp=0) {
  let delta = timestamp - lastTime;
  lastTime = timestamp;

  updatePosition(delta);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap();
  drawCar();
  if(!player.inCar) drawPlayer();

  checkCarInteraction();

  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
  if(keys.hasOwnProperty(e.code)) {
    keys[e.code] = true;
  }
});

window.addEventListener('keyup', (e) => {
  if(keys.hasOwnProperty(e.code)) {
    keys[e.code] = false;
  }
});

requestAnimationFrame(gameLoop);
