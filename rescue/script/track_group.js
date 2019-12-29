var gpxFiles
var layers
fetch('http://api.github.com/repos/typebrook/ol/releases/tags/v1')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    gpxFiles = myJson.assets;
  });
for (var gpx in gpxFiles) {
  layers.push(
    new ol.layer.Vector({
      title: 'foo',
      visible: false,
      source: new ol.source.Vector({
        url: 'gpx.browser_download_url',
        format: new ol.format.GPX()
      }),
      style: function (feature) {
        // return style_update(feature);
        return style_setter(feature, '#FFEC00')
      }
    }),
  )
}
var track_group = new ol.layer.Group({
  'title': 'GPX maps',
  layers
})
