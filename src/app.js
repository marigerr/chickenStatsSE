import $ from 'jquery';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './stylesheets/app.css';
import getColor from './getColor';
// require.context("./GeoJson", true, /\.geojson$/);

var isMobile = mobileAndTabletcheck();
console.log(isMobile);

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

var map = L.map('mapid', { layers: [dark], zoomControl: false });
L.control.layers(baseLayers, {}, { position: 'topright' }).addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);

var selectCtrl = L.control({ position: 'topleft' });
selectCtrl.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'selectCtrl');
  div.innerHTML = '<select id="statsSelect">' +
        '<option selected value="">Select Stats</option>' +
        '<option value="Höns_2005_1">Chickens per Region 2005</option>' +
        '<option value="Höns_2016_1">Chickens per Region 2016</option>' +
        '<option value="ChickenIncreasePercent">Chicken Increase 2005-2016</option>' +
        '<option value="ChickenPerKm2">Chickens per km2</option>' +
        '</select>';
  div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
  L.DomEvent.on(div.firstChild, 'on change', changeStats);

  return div;
};

// selectCtrl.addTo(map);
var stats = { statType: "ChickenIncreasePercent", breakpoints: [400, 200, 50, 10, -11, -25] };


var geojsonLayer;
var chickenData;

$.getJSON("./GeoJson/LanWithChickensV2.json", function (data) {
  chickenData = data;
  success(chickenData);
});

function changeStats(event) {
  stats.statType = event.target.value;
  stats.breakpoints = getBreakpoints(stats.statType);
  stats.title = $("#statsSelect option:selected").text();
  // console.log(stats.breakpoints.reverse());
  map.removeLayer(geojsonLayer);
  geojsonLayer = L.geoJSON(chickenData, { style: style, onEachFeature: onEachFeature }).addTo(map);
  updateLegend();
}

function getBreakpoints(statType) {
  return statType == "ChickenIncreasePercent" ? [400, 200, 50, 10, -11, -25] :
    statType == "Höns_2005_1" ? [1000000, 500000, 100000, 50000, 25000, 0] :
      statType == "Höns_2016_1" ? [1000000, 500000, 100000, 50000, 25000, 0] :
        statType == "ChickenPerKm2" ? [150, 100, 75, 50, 25, 0] :
          [400, 200, 50, 10, -11, -25];
}
function success(data) {
  geojsonLayer = L.geoJSON(data, { style: style, onEachFeature: onEachFeature }).addTo(map); //, {pointToLayer: 
  map.setView(geojsonLayer.getBounds().getCenter(), 5);
  // map.panBy(L.point(0,-30));
  // map.fitBounds(geojsonLayer.getBounds());
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

var lastLayerSelected;
function highlightFeature(e) {
  if (lastLayerSelected) geojsonLayer.resetStyle(lastLayerSelected);
  // info.update();
  var layer = e.target;
  lastLayerSelected = layer;
  layer.openPopup();
  // console.log(layer);
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });
  // console.log(layer);

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  // info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target);
  // info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  if (isMobile) {
    layer.bindPopup(createPopup(feature.properties), { autoPanPaddingTopLeft: L.point(5, 175) });
  } else {
    layer.bindPopup(createPopup(feature.properties));
  }
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    // click: highlightFeature
  });
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var legend = L.control({ position: 'topleft' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    labels = [];
  div.innerHTML += '<span>Chickens Increase 2005-2016</span><br>';

  var reversedBreaks = stats.breakpoints.slice().reverse();
  for (var i = 0; i < stats.breakpoints.length; i++) {
    div.innerHTML +=
            '<i style="background:' + getColor(reversedBreaks[i] + 1, stats) + '"></i> ' +
            reversedBreaks[i] + (reversedBreaks[i + 1] ? '% to ' + reversedBreaks[i + 1] + '%<br>' : '% +');
  }

  return div;
};

selectCtrl.addTo(map);
legend.addTo(map);


function updateLegend() {
  $(".info.legend.leaflet-control").empty();
  if (stats.title == "Select Stats") {
    return;
  } else {

    // var newLegendContent = '';
    var newLegendContent = '<span>' + stats.title + '</span><br>';
    var reversedBreaks = stats.breakpoints.slice().reverse();
    for (var i = 0; i < stats.breakpoints.length; i++) {
      newLegendContent += '<i style="background:' + getColor(reversedBreaks[i] + 1, stats) + '"></i> ' +
                numberWithCommas(reversedBreaks[i]) +
                (reversedBreaks[i + 1] ? ' to ' + numberWithCommas(reversedBreaks[i + 1]) + '<br>' : '+');
    }
    $(".info.legend.leaflet-control").html(newLegendContent);
    map.setView(geojsonLayer.getBounds().getCenter(), 5);
  }
}

function createPopup(props) {
  var popup = 'Region: ' + props.LnNamn + '</br>' +
        '2005: ' + numberWithCommas(props.Höns_2005_1) + '</br>' +
        '2016: ' + numberWithCommas(props.Höns_2016_1) + '</br>' +
        Math.round(props.ChickenIncreasePercent) +
        '% change' + '</br>';
  return popup;
}

function mobileAndTabletcheck() {
  var check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}




// var info = L.control({position: 'bottomright'});

// info.onAdd = function (map) {
//     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//     this.update();
//     return this._div;
// };

// method that we will use to update the control based on feature properties passed
// info.update = function (props) {
//     this._div.innerHTML = '<h4>Chicken Stats</h4>' +  (props ?
//         '<b>' + props.LnNamn + '</b><br />' + 
//         '2005: ' + numberWithCommas(props.Höns_2005_1) + '<br />' +
//         '2016: ' + numberWithCommas(props.Höns_2016_1) + '<br />' + 
//         props.ChickenIncreasePercent + '% change' + '<br />' +
//         'Chickens per km2: ' + props.ChickenPerKm2 
//         : 'Click on a region to see more details');
// };

// info.addTo(map);