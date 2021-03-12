// console.log("oki doki");

// URL data from USGS.gov
// All earthquakes in the week
let earthquakesUrl =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Significant earthquakes in the week
// let dataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

//URL data for tectonic plates
let platesUrl =  "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Perform a GET request to the query URL
d3.json(earthquakesUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Function that determine the color of circle by magnitude
function getColor(magnitude) {
  switch (true) {
    case magnitude < 1:
      return "#fed976";
    case magnitude < 2:
      return "#feb24c";
    case magnitude < 3:
      return "#fd8d3c";
    case magnitude < 4:
      return "#fc4e2a";
    case magnitude < 5:
      return "#e31a1c";
    default:
      return "#b10026";
  }
}

// Function that determine radius size by magnitude
function getRadiusSize(magnitude){
    if (magnitude === 0){
      return 0.1;
    }
    return magnitude * 5;
}

function createFeatures(earthquakeData) {

    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + ". <br> Magnitude: " + feature.properties.mag + "</p>");
    };
    // Function for style circle marks
    function style(feature){
        return{
            color: "#FFF",
            fillOpacity: 0.7,
            weight: 0.5,
            stroke: true,
            fillColor: getColor(feature.properties.mag),
            radius: getRadiusSize(feature.properties.mag)
        }
    };
    // Funtion to create cirle marks
    function pointToLayer(feature, latlng) {
        return L.circleMarker(latlng);
    };
    // Pass all the functions to earthquakes
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        style: style,
        pointToLayer: pointToLayer
    });
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Define grayscalemap and streetmap
    let grayscalemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });

    let satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
    });

    let outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    // Initialize faultlines LayerGroup
    let faultlines = new L.LayerGroup();

    // Define a baseMaps object to hold our base layers
    let baseMaps = {
        "Grayscale Map": grayscalemap,
        "Satellite Map": satellitemap,
        "Outdoor Map": outdoormap
    };

    // Create overlay object to hold our overlay layer
    let overlayMaps = {
        "Earthquakes": earthquakes,
        "Fault Lines": faultlines
    };

    // Create map
    let map = L.map("map_id", {
        center: [19.4325, -99.1332],
        zoom: 4.5,
        layers: [satellitemap, earthquakes, faultlines]
    });

    satellitemap.addTo(map);

    // Tectonic plates layer 
    d3.json(platesUrl, function(data) {      
      L.geoJson(data, {
        style: function(feature) {
          return {
            color: "#FFA500",
            weight: 2,
          };
        }
      }).addTo(faultlines); 
    });

    // Set up the legend
    let legend = L.control({ 
        position: "bottomright" 
    });

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        let gradeLabels = [0,1,2,3,4,5];
        let legendInfo = "<strong><center>Magnitude<br>Level</center></strong>" + "<div class=\"labels\">" + "</div>";
        div.innerHTML = legendInfo;
        for (let i = 0; i < gradeLabels.length; i++) {
            div.innerHTML += '<i style="background:'+ getColor(gradeLabels[i]) + '"></i> ' +
                gradeLabels[i] + (gradeLabels[i + 1] ? ' &ndash; ' + gradeLabels[i + 1] + '<br>' : ' +');
        }
        return div;
    };
    legend.addTo(map);

    // Create a layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

};