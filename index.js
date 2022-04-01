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
  // let pattern = /\d+.\d+.\d+.\d+/,
  let response, data;

  response = await fetch(
    `https://api.ipgeolocation.io/ipgeo/?apiKey=18857f4cab7e49daa74a150f4cbd1856&ip=${domainOrIp}`
  );

<<<<<<< HEAD
  data = await response.json();

  if (data.ip === undefined) {
    return null;
  }
=======
    data = await response.json();
>>>>>>> 132d272c19c1af70947cc7680a44b082ee54992e

  showData(data);
}

let marker = L.marker([50, 50]);

let showData = (data) => {
  // show the data on the Dom
  document.getElementById("current-ip").textContent = data.ip;
  document.getElementById(
    "location"
  ).textContent = `${data.country_code2}, ${data.state_prov}`;
  document.getElementById("timezone").textContent = `UTC${
    data.time_zone.offset > 0 ? "+" + data.time_zone.offset : ""
  }:00`;
  document.getElementById("isp").textContent = data.isp;

  // map display
  let myIcon = L.icon({
    iconUrl: "./images/icon-location.svg",
  });

  map.setView(
    [+(+data.latitude).toFixed(2) + 0.01, (+data.longitude).toFixed(2)],
    13
  );

  marker.remove();

  marker = L.marker(
    [(+data.latitude).toFixed(2), (+data.longitude).toFixed(2)],
    { icon: myIcon }
  );

  marker.addTo(map);
};

// set current data (for first loading)
// window.onload = async function () {
//   let currentIp = await getIPs().then((res) => res.join(""));

//   getData(currentIp);
// };

document.getElementById("search").addEventListener("click", () => {
  getData(document.getElementById("ip").value);
});
