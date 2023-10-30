//48.693463, 6.183167
let map = L.map('map').setView([48.693463, 6.183167], 14);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let marker = L.marker([48.693463, 6.183167]).addTo(map);