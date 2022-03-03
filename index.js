let map = L.map("map", {
  zoomControl: false,
  maxBoundsViscosity: 1.0,
  worldCopyJump: true
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
  let pattern = /\d+.\d+.\d+.\d+/,
    response,
    data;

  if (pattern.test(domainOrIp)) {
    response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_uAPr1LbdCJl91Tl5D9X1ztkbAu4to&ipAddress=${domainOrIp}`
    );
  } else {
    response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_uAPr1LbdCJl91Tl5D9X1ztkbAu4to&domain=${domainOrIp}`
    );
  }

    data = await response.json();

  showData(data);

}

let marker = L.marker([50, 50]);

let showData = (data) => {
  // show the data on the Dom
  document.getElementById("current-ip").textContent = data.ip;
  document.getElementById(
    "location"
  ).textContent = `${data.location.country}, ${data.location.region}`;
  document.getElementById(
    "timezone"
  ).textContent = `UTC${data.location.timezone}`;
  document.getElementById("isp").textContent = data.isp;

  // map display
  let { lat, lng } = data.location;

  let myIcon = L.icon({
    iconUrl: "./images/icon-location.svg",
  });

  map.setView([lat + 0.01, lng], 13);

  marker.remove();
  
  marker = L.marker([lat, lng], { icon: myIcon });

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

/*
    {"ip":"142.250.68.14","location":{"country":"US","region":"California","timezone":"-08:00"},"domains":["0294197869557992875298820958770566345948.page.link","04day.page.link","08288467059939573940290485384939900786085887282199.page.link","1452dcvbgf1.page.link","15sof.page.link"],"as":{"asn":15169,"name":"GOOGLE","route":"142.250.0.0\/15","domain":"https:\/\/about.google\/intl\/en\/","type":"Content"},"isp":"Google LLC"}

    {"ip":"48.251.15.231","location":{"country":"US","region":"New Jersey","timezone":"-05:00"},"isp":"The Prudential Insurance Company of America"}
*/
