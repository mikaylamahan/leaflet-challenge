const API_KEY = "pk.eyJ1IjoibXJvbGxlcjIxIiwiYSI6ImNrNGMyN25jajBqdmIzZWxrdzk0ZzI1cTIifQ.jwwYrX2C0qlp6s_voVf_Jw"

// Create map object
var map = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 11
});

var earthquakes = new L.LayerGroup();

// overlays 
var overlayMaps = {
    "Earthquakes": earthquakes
  };
  
  L
    .control
    .layers(titleLayer, overlayMaps)
    .addTo(map);

// Add tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson"

// retrieve earthquake geoJSON data.
d3.json(link, function (data) {

    //set up your response so that you can retrieve the magnitude
    function mapInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.properties.mag),
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }

    //determine color of marker based on magnitude of earthquake
    function chooseColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#red";
            case magnitude > 4:
                return "#maroon";
            case magnitude > 3:
                return "#pink";
            case magnitude > 2:
                return "#orange";
            case magnitude > 1:
                return "#yellow";
            default:
                return "#green";
        }
    }

    // define the radius of earthquake marker 

    function findRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 3;
    }

    // add GeoJSON layer to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }

    }).addTo(earthquakes);

    earthquakes.addTo(map);


    var legend = L.control({
        position: "bottomright"
    });


    legend.onAdd = function () {
        var div = L
            .DomUtil
            .create("div", "info legend");

        var scale = [0, 1, 2, 3, 4, 5];
        var colorScale = [
            "#red",
            "#maroon",
            "#pink",
            "#orange",
            "#yellow",
            "#green"
        ];


        for (var i = 0; i < scale.length; i++) {
            div.innerHTML += "<i style='background: " + colorScale[i] + "'></i> " +
                scale[i] + (scale[i + 1] ? "&ndash;" + scale[i + 1] + "<br>" : "+");
        }
        return div;
    
       
    };


    legend.addTo(map)});