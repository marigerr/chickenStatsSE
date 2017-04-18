import $ from 'jquery';
import 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './stylesheets/app.css';
import getColor from './getColor';
require.context("./GeoJson", true, /\.geojson$/);




var dark = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.dark',
    accessToken: 'pk.eyJ1IjoibWFyaWdlcnIiLCJhIjoiY2l6NDgxeDluMDAxcjJ3cGozOW1tZnV0NCJ9.Eb2mDsjDBmza-uhme0TLSA'
});

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
    "Dark": dark,
    "Topo": topo,
    "Satellite": satellite,
};

var map = L.map('mapid', {layers: [dark]});
L.control.layers(baseLayers,{},{position : 'topleft'}).addTo(map);

var selectCtrl = L.control({position: 'topright'});
selectCtrl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'selectCtrl');
    div.innerHTML = '<select id="statsSelect">' +
                        '<option value="">Select Stats</option>' +
                        '<option value="Höns_2005_1">Chickens per Region 2005</option>' +
                        '<option value="Höns_2016_1">Chickens per Region 2016</option>' +
                        '<option value="ChickenIncreasePercent">Chicken Increase Percent</option>' +
                        '<option value="ChickenPerKm2">Chickens per km2</option>' +
                    '</select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    L.DomEvent.on(div.firstChild, 'on change', changeStats); 
    
    return div;
};

selectCtrl.addTo(map);
var stats = {statType: "ChickenIncreasePercent", breakpoints: [400,200,50,10,-11,-25]};

function changeStats(event){
    stats.statType = event.target.value;
    stats.breakpoints = getBreakpoints(stats.statType);
    // console.log(stats.breakpoints.reverse());
    map.removeLayer(geojsonLayer);
    geojsonLayer = L.geoJSON(chickenData, {style: style, onEachFeature: onEachFeature}).addTo(map);
    updateLegend();
}

function getBreakpoints(statType){
     return statType == "ChickenIncreasePercent"  ? [400,200,50,10,-11,-25] :
            statType == "Höns_2005_1" ? [1000000,500000,100000,50000,25000,0] :
            statType == "Höns_2016_1" ? [1000000,500000,100000,50000,25000,0] :
                                        [400,200,50,10,-11,-25];
}

var geojsonLayer;               
var chickenData;

$.getJSON("./GeoJson/LanWithChickensV2.geojson", function(data){
    chickenData = data;
    success(chickenData);
});

function success(data){
    geojsonLayer = L.geoJSON(data, {style: style, onEachFeature: onEachFeature}).addTo(map); //, {pointToLayer: 
	map.setView(geojsonLayer.getBounds().getCenter(), 5);
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties[stats.statType], stats),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.6
    };
}

function highlightFeature(e) {
    geojsonLayer.resetStyle(e.target);
    info.update();
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: highlightFeature
    });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        labels = [];

    var reversedBreaks = stats.breakpoints.slice().reverse();
    for (var i = 0; i < stats.breakpoints.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(reversedBreaks[i] + 1, stats) + '"></i> ' +
            reversedBreaks[i] + (reversedBreaks[i + 1] ? '% to ' + reversedBreaks[i + 1] + '%<br>' : '% +');
    }

    return div;
};

legend.addTo(map);

function updateLegend(){
    $(".info.legend.leaflet-control").empty();
    var newLegendContent = '';
    var reversedBreaks = stats.breakpoints.slice().reverse();
    for (var i = 0; i < stats.breakpoints.length; i++) {
        newLegendContent += '<i style="background:' + getColor(reversedBreaks[i] + 1, stats) + '"></i> ' +
            numberWithCommas(reversedBreaks[i]) + 
            (reversedBreaks[i+1] ? ' to ' + numberWithCommas(reversedBreaks[i+1]) + '<br>' : '+');
    } 
    $(".info.legend.leaflet-control").html(newLegendContent);      
}

var info = L.control({position: 'bottomright'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Chicken Stats</h4>' +  (props ?
        '<b>' + props.LnNamn + '</b><br />' + 
        '2005: ' + numberWithCommas(props.Höns_2005_1) + '<br />' +
        '2016: ' + numberWithCommas(props.Höns_2016_1) + '<br />' + 
        props.ChickenIncreasePercent + '% change' + '<br />' +
        'Chickens per km2: ' + props.ChickenPerKm2 
        : 'Click on a region to see more details');
};

info.addTo(map);

