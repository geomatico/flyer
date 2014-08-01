/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(['leaflet', 'leaflet.layers', 'wms', 'leaflet-hash', 'css!flyer.css'], function(L, layers, wms) {
	var map = L.map('map').setView([41.5, 2], 8);
	var hash = new L.Hash(map);
	//map.locate({setView: true, maxZoom: 16});

	// Base layers
    var base = layers.create({
        "Watercolor": {type: "stamen", id: "watercolor"},
        "Toner": {type: "stamen", id: "toner"},
        "Roads": {type: "bing", id: "Road"},
        "Satellite": {type: "bing", id: "AerialWithLabels"}
    });
	base.addTo(map);
	var control = base.control;
	
	var url = "http://sorteny.fonts.cat/geoserver/wms"; // TODO externalize
	var service = wms.service(url);
	service.getLayers().then(updateOverlays);
	var overlays = [];

	function updateOverlays(layers) {
		// TODO delete previous overlays
		for (var i in layers) {
			var title = layers[i].title;
			var name = layers[i].name;
            var layer = L.tileLayer.wms(url, {
                layers: name,
                version: '1.3.0',
                format: 'image/png8',
                transparent: 'true'
            });
            control.addOverlay(layer, title);
			overlays.push(layer);
		}
	}


});

