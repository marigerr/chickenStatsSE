import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/layers.png';
import 'leaflet/dist/images/layers-2x.png';
import 'Stylesheets/app.css';
import mobileAndTabletcheck from 'Utilities/mobileAndTabletcheck';
import chickenData from 'Data/LanWithChickensV2';
import { dark, baseLayers } from 'Data/basemaps';
import getColor from './getColor';

const isMobile = mobileAndTabletcheck();
// console.log(isMobile);
const stats = { statType: 'ChickenIncreasePercent', breakpoints: [400, 200, 50, 10, -11, -25] };
let geojsonLayer;

const map = L.map('mapid', { layers: [dark], zoomControl: false });
L.control.layers(baseLayers, {}, { position: 'topright' }).addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function updateLegend() {
  let newLegendContent = `<span>${stats.title}</span><br><ul>`;
  const reversedBreaks = stats.breakpoints.slice().reverse();
  for (let i = 0; i < stats.breakpoints.length; i += 1) {
    newLegendContent += `<li><i style="background:${getColor(reversedBreaks[i] + 1, stats)}"></i> ${
      numberWithCommas(reversedBreaks[i])
    }${reversedBreaks[i + 1] ? ` to ${numberWithCommas(reversedBreaks[i + 1])}</li>` : '+</li>'}`;
  }
  newLegendContent += '</ul>';
  document.querySelectorAll('.info.legend.leaflet-control')[0].innerHTML = newLegendContent;
  map.setView(geojsonLayer.getBounds().getCenter(), 5);
}

function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target);
  // info.update();
}

let lastLayerSelected;
function highlightFeature(e) {
  if (lastLayerSelected) geojsonLayer.resetStyle(lastLayerSelected);
  // info.update();
  const layer = e.target;
  lastLayerSelected = layer;
  layer.openPopup();
  // console.log(layer);
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  // info.update(layer.feature.properties);
}

function createPopup(props) {
  const popup = `Region: ${props.LnNamn}</br>`
    + `2005: ${numberWithCommas(props.Höns_2005_1)}</br>`
    + `2016: ${numberWithCommas(props.Höns_2016_1)}</br>`
    + `${Math.round(props.ChickenIncreasePercent)}% change</br>`;
  return popup;
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

function style(feature) {
  return {
    fillColor: getColor(feature.properties[stats.statType], stats),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.6,
  };
}

function getBreakpoints(statType) {
  return statType === 'ChickenIncreasePercent' ? [400, 200, 50, 10, -11, -25]
    : statType === 'Höns_2005_1' ? [1000000, 500000, 100000, 50000, 25000, 0]
      : statType === 'Höns_2016_1' ? [1000000, 500000, 100000, 50000, 25000, 0]
        : statType === 'ChickenPerKm2' ? [150, 100, 75, 50, 25, 0]
          : [400, 200, 50, 10, -11, -25];
}

function changeStats(event) {
  stats.statType = event.target.value;
  stats.breakpoints = getBreakpoints(stats.statType);
  const statsDD = document.getElementById('statsSelect');
  stats.title = statsDD.options[statsDD.selectedIndex].text;
  // console.log(stats.breakpoints.reverse());
  map.removeLayer(geojsonLayer);
  geojsonLayer = L.geoJSON(chickenData, { style, onEachFeature }).addTo(map);
  updateLegend();
}

const selectCtrl = L.control({ position: 'topleft' });
selectCtrl.onAdd = function () {
  const div = L.DomUtil.create('div', 'selectCtrl');
  div.innerHTML = '<div><label id="statsSelectLabel" for="statsSelect">Select Chicken Stats</label></div>'
    + '<div><select id="statsSelect">'
    + '<option value="Höns_2005_1">Chickens per Region 2005</option>'
    + '<option value="Höns_2016_1">Chickens per Region 2016</option>'
    + '<option selected value="ChickenIncreasePercent">Percent Change 2005-2016</option>'
    + '<option value="ChickenPerKm2">Chickens per km2</option>'
    + '</select></div>';

  /*eslint-disable */
  div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation; 
  /* eslint-enable */
  L.DomEvent.on(div.childNodes[1], 'on change', changeStats);

  return div;
};

const instructionCtrl = L.control({ position: 'bottomleft' });
instructionCtrl.onAdd = function () {
  const div = L.DomUtil.create('div', 'instructionCtrl');
  div.innerHTML = 'Hover on region for regional stats';
  return div;
};

geojsonLayer = L.geoJSON(chickenData, { style, onEachFeature }).addTo(map); // , {pointToLayer:
map.setView(geojsonLayer.getBounds().getCenter(), 5);
// map.panBy(L.point(0,-30));
// map.fitBounds(geojsonLayer.getBounds());

const legend = L.control({ position: 'topleft' });

legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'info legend');
  const reversedBreaks = stats.breakpoints.slice().reverse();
  let legendContent = '<span>Percent Change 2005-2016</span><br>';
  legendContent += '<ul>';
  for (let i = 0; i < stats.breakpoints.length; i += 1) {
    legendContent += `<li><i style="background:${getColor(reversedBreaks[i] + 1, stats)}"></i>`;
    legendContent += `${reversedBreaks[i]}${reversedBreaks[i + 1] ? `% to ${reversedBreaks[i + 1]}%<br>` : '% and above'}</li>`;
  }
  legendContent += '</ul>';
  div.innerHTML += legendContent;
  return div;
};

selectCtrl.addTo(map);
instructionCtrl.addTo(map);
legend.addTo(map);

// function zoomToFeature(e) {
//   map.fitBounds(e.target.getBounds());
// }

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
