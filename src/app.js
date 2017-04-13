import $ from 'jquery';
import 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import styles from './assets/stylesheets/app.css';
import getColor from './getColor';


var topo = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibWFyaWdlcnIiLCJhIjoiY2l6NDgxeDluMDAxcjJ3cGozOW1tZnV0NCJ9.Eb2mDsjDBmza-uhme0TLSA'
});

var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.satellite',
    accessToken: 'pk.eyJ1IjoibWFyaWdlcnIiLCJhIjoiY2l6NDgxeDluMDAxcjJ3cGozOW1tZnV0NCJ9.Eb2mDsjDBmza-uhme0TLSA'
});

var baseLayers = {
    "Topo": topo,
    "Satellite": satellite
};

var map = L.map('mapid', {layers: [topo]}).setView([51.505, -0.09], 13);
L.control.layers(baseLayers,{},{position : 'topleft'}).addTo(map);

var markers = L.markerClusterGroup({showCoverageOnHover: false,
                                    maxClusterRadius: 50, 
                                    disableClusteringAtZoom: 15, 
                                    spiderfyOnMaxZoom: false 
                                    //, chunkedLoading: true, chunkProgress :checkProgress
                                });
var geojsonLayer;                                
$.getJSON("./GeoJson/Jönköping.geojson", function(data){
    success(data);
    // geojsonLayer.addData(HaboTrees, {pointToLayer: pointToLayer, onEachFeature: onEachFeature});
    // console.log(geojsonLayer._layers);
    // map.fitBounds(geojsonLayer.getBounds());
});

function success(data){
    geojsonLayer = L.geoJSON(data, {pointToLayer: pointToLayer, onEachFeature: onEachFeature});
    markers.addLayer(geojsonLayer);
    map.addLayer(markers);
	map.fitBounds(markers.getBounds());
}

function pointToLayer(feature, latlng) {
  
    var radius;
    var x = feature.properties.Stamomkret;
    switch (true) {
    case (x < 1000):
        // console.log("less than six hundred");
        radius = 5;
        break;
    case (x >= 1000  && x < 1500):
        // alert("between 5 and 8");
        radius = 10;
        break;
    case (x >= 1500):
        // alert("between 9 and 11");
        radius = 15;
        break;
    default:
        console.log("error with radius");
        break;
    }
    return new L.CircleMarker(latlng, {
        radius: radius,
        // fillColor: colors[feature.properties.Tradslag],
        fillColor: getColor(feature.properties.Tradslag),
        color: getColor(feature.properties.Tradslag),
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        clickable: true
    });
}

function onEachFeature(feature, layer) {
        // console.log(feature);
		var popupContent = "";
		if (feature.properties) {
            popupContent += "Id: " + feature.properties.Obj_idnr + "</br>";
			popupContent += "Stamomkret: " + feature.properties.Stamomkret + " cm</br>";
            popupContent += "Tradslag: " + feature.properties.Tradslag + "</br>";
            popupContent += "Status: " + feature.properties.Tradstatus + "</br>";            
		}
		layer.bindPopup(popupContent);
        // markers.addLayer(layer);
}


