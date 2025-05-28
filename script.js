// Oyun temel değişkenleri ve ayarları
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 40; // Harita karolarının büyüklüğü
const mapWidth = 15;
const mapHeight = 10;

// Basit bir şehir haritası matrisi (0: yol, 1: bina)
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

// Oyuncu objesi (insan)
const player = {
  x: 1, // başlangıç harita koordinatları
  y: 1,
  width: tileSize * 0.8,
  height: tileSize * 0.8,
  color: 'green',
  speed: 0.1,
  moving: false,
  inCar: false,
};

// Araba objesi
const car = {
  x: 3,
  y: 1,
  width: tileSize,
  height: tileSize * 0.6,
  color: 'red',
  speed: 0.2,
  occupied: false,
};

// Klavye durumu
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  KeyF: false,
};

// Oyun döngüsü için zaman yönetimi
let lastTime = 0;

function drawMap() {
  for(let y = 0; y < mapHeight; y++) {
    for(let x = 0; x < mapWidth; x++) {
      if(cityMap[y][x] === 1) {
        ctx.fillStyle = '#555'; // bina rengi
      } else {
        ctx.fillStyle = '#ddd'; // yol rengi
      }
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
  // Harita sınırı dışına çıkmasın
  if(x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) return false;
  // Yola mı bakıyoruz?
  return cityMap[Math.floor(y)][Math.floor(x)] === 0;
}

function updatePosition(delta) {
  if(player.inCar) {
    // Arabadayken hareket
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
    // Yürürken hareket
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
  // Araba ve insanın yan yana olup olmadığını kontrol et
  const dx = player.x - car.x;
  const dy = player.y - car.y;
  const distance = Math.sqrt(dx*dx + dy*dy);

  if(distance < 1.5) {
    // "F" tuşuna basılırsa biner veya iner
    if(keys.KeyF) {
      if(player.inCar) {
        player.inCar = false;
        car.occupied = false;
        // İnsan arabadan inerken konumunu arabanın yanına koy
        player.x = car.x + 1;
        player.y = car.y;
      } else if(!car.occupied) {
        player.inCar = true;
        car.occupied = true;
        // İnsan arabanın içine "binmiş" oluyor, pozisyonu arabaya eşitleniyor
        player.x = car.x;
        player.y = car.y;
      }
      keys.KeyF = false; // Tek seferlik işlem için tuşu sıfırla
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

// Tuş dinleme
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

// Oyunu başlat
requestAnimationFrame(gameLoop);
