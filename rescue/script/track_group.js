var track_group = new ol.layer.Group({
    'title': 'GPX maps',
    layers: [
        new ol.layer.Vector({
            title: '搜索路線',
            visible: true,
            source: new ol.source.Vector({
              url: './data/20200928中雪山搜救航跡彙整_手機用.gpx',
              format: new ol.format.GPX()
            }),
            style: function(feature) {
                // return style_update(feature);
                return style_setter(feature,'#00FFFF')
            }
        })
    ]
})
