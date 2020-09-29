// default zoom, center and rotation
var zoom = 11.5;
var center = [121.0879, 24.4995];

if (window.location.hash !== '') {
  // try to restore center, zoom-level and rotation from the URL
  var hash = window.location.hash.replace('#map=', '');
  var parts = hash.split('/');
  if (parts.length === 3) {
    zoom = parseInt(parts[0], 10);
    center = [
      parseFloat(parts[1]),
      parseFloat(parts[2])
    ];
  }
}

var map = new ol.Map({
  target: 'map',
  layers: [
    basemap,
    track_group
  ],
  view: new ol.View({
      center: ol.proj.fromLonLat(center),
      zoom: zoom

  })
});

// Create a LayerSwitcher instance and add it to the map
var layerSwitcher = new ol.control.LayerSwitcher();
map.addControl(layerSwitcher);

var shouldUpdate = true;
var view = map.getView();
var updatePermalink = function() {
  if (!shouldUpdate) {
    // do not update the URL when the view was changed in the 'popstate' handler
    shouldUpdate = true;
    return;
  }

  var center = view.getCenter();
  var coor = ol.proj.toLonLat(center)
  var hash = '#map=' +
      view.getZoom().toFixed(1) + '/' +
      coor[0].toFixed(7) + '/' +
      coor[1].toFixed(7)
  var state = {
    zoom: view.getZoom(),
    center: view.getCenter()
  };
  window.history.pushState(state, 'map', hash);
};

map.on('moveend', updatePermalink);

// restore the view state when navigating through the history, see
// https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
window.addEventListener('popstate', function(event) {
  if (event.state === null) {
    return;
  }
  map.getView().setCenter(event.state.center);
  map.getView().setZoom(event.state.zoom);
  shouldUpdate = false;
});

var center1 = ol.proj.fromLonLat([121.0697, 24.49671]);
var center2 = ol.proj.fromLonLat([121.0879, 24.4995]);
var layer1 = new ol.layer.Vector({
    source: new ol.source.Vector({
      projection: 'EPSG:4326',
      features: [
        new ol.Feature(new ol.geom.Circle(center1, 19000))
      ]
    }),
    style: [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'blue',
          width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      })
    ]
});
var layer2 = new ol.layer.Vector({
    source: new ol.source.Vector({
      projection: 'EPSG:4326',
      features: [
        new ol.Feature(new ol.geom.Circle(center2, 19000))
      ]
    }),
    style: [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'yellow',
          width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 255, 0, 0.1)'
        })
      })
    ]
});
map.addLayer(layer1);
map.addLayer(layer2);
