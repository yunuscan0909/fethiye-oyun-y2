const map = L.map('map').setView([36.6512, 29.1236], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
}).addTo(map);

const carIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

let car = L.marker([36.6512, 29.1236], { icon: carIcon }).addTo(map);

document.addEventListener('keydown', function (e) {
  let pos = car.getLatLng();
  let lat = pos.lat;
  let lng = pos.lng;
  const step = 0.0005;

  if (e.key === 'ArrowUp') lat += step;
  if (e.key === 'ArrowDown') lat -= step;
  if (e.key === 'ArrowLeft') lng -= step;
  if (e.key === 'ArrowRight') lng += step;

  const newPos = [lat, lng];
  car.setLatLng(newPos);
  map.panTo(newPos);
});
