let map = L.map("map", {
  zoomControl: false,
  maxBoundsViscosity: 1.0,
  worldCopyJump: true,
});

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    minZoom: 2,
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "sk.eyJ1IjoiYWJkdWxrZXJpbWF3YWQiLCJhIjoiY2wwNnpmcGo1MTVrOTNrcGR5bWJnbmk3bSJ9.1X5or_AvlQX3845OLJsNOA",
  }
).addTo(map);

/* -------------------------------------------------------------------------- */

async function getData(domainOrIp) {
  let response, data;

  response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://geo.ipify.org/api/v2/country,city?apiKey=at_uAPr1LbdCJl91Tl5D9X1ztkbAu4to&ipAddress=${domainOrIp}`
  );

  data = await response.json();

  if (data.ip === undefined) {
    return null;
  }

  showData(data);
}

let marker = L.marker([50, 50]);

let showData = (data) => {
  // show the data on the Dom
  document.getElementById("current-ip").textContent = data.ip;
  document.getElementById(
    "location"
  ).textContent = `${data.location.region}, ${data.location.city}`;
  document.getElementById(
    "timezone"
  ).textContent = `UTC${data.location.timezone}:00`;
  document.getElementById("isp").textContent = data.isp;

  // map display
  let myIcon = L.icon({
    iconUrl: "./images/icon-location.svg",
  });

  map.setView([data.location.lat + 0.01, data.location.lng], 13);

  marker.remove();

  marker = L.marker([data.location.lat, data.location.lng], { icon: myIcon });

  marker.addTo(map);
};

// set current data (for first loading)
window.onload = async function () {
  let currentIp = await getIPs().then((res) => res.join(""));

  getData(currentIp);
};

document.getElementById("search").addEventListener("click", () => {
  getData(document.getElementById("ip").value);
});
