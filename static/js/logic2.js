function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the earthquakes layer.
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options.
  let map = L.map("map", {
    center: [32.71, -111.55],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

// Create markers whose size increases with magnitude and color with depth
function createMarker(feature, latlng) {
  return L.circleMarker(latlng, {
    radius: markerSize(feature.properties.mag),
    fillColor: markerColor(feature.geometry.coordinates[2]),
    color:"#000",
    weight: 0.5,
    opacity: 0.5,
    fillOpacity: 1
  });
}

function createFeatures(earthquakeData) {
  //Define function to run for each feature in the features array.
  // Give each feature a popup that describes the time and place of the earthquake.
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
}

// Create a GeoJSON layer that contains the features array on the earthquakeData object.
// Run the onEachFeature function for each piece of data in the array.
let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createMarker
});

// Send earthquakes layer to the createMap function
createMap(earthquakes);
}

// Increase marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 3;
}

// Change marker color based on depth
function markerColor(depth) {
  return depth > 90 ? '#d73027' :
          depth > 70 ? '#fc8d59' :
          depth > 50 ? '#fee08b' :
          depth > 30 ? '#d9ef8b' :
          depth > 10 ? '#91cf60' :
                       '#1a9850' ;          
}

// Perform an API call to the USGS GeoJSON Feed API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(earthquakeData) {
  //Send data.features object to the createFeatures function.
  console.log(earthquakeData);
  createFeatures(earthquakeData.features);
});