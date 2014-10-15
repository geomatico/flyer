/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(['leaflet', 'leaflet.layers', 'wms', 'leaflet-info-wms', 'leaflet-hash', 'css!flyer.css'], function(L, layers, wms) {
	var map = L.map('map').setView([41.5, 2], 8);
	var hash = new L.Hash(map);
	//map.locate({setView: true, maxZoom: 16});
	
	// Base layers
    var base = layers.create({
        /*"Satellite": {type: "bing", id: "Aerial"},
        "Hybrid": {type: "bing", id: "AerialWithLabels"},*/
        "Satellite": {type: "here", id: "satellite.day"},
        "Hybrid": {type: "here", id: "hybrid.day"},        
        "Roads": {type: "hydda", id: "hydda"}
        //"Roads": {type: "bing", id: "Road"}
    });
	base.addTo(map);
	var control = base.control;

	var url = "http://sorteny.fonts.cat/geoserver/Giswater/wms";
	var service = wms.service(url);
	service.getLayers().then(updateOverlays);
	var overlays = [];

	function updateOverlays(layers) {
		for (var i in layers) {
			var title = layers[i].title;
			var name = layers[i].name;
            var layer = L.tileLayer.infoWms(url, {
                layers: name,
                version: '1.3.0',
                format: 'image/png8',
                transparent: 'true'
            });
            control.addOverlay(layer, title);
			overlays.push(layer);
		}
	}

	// Add signature
	var signature = L.control({position: "bottomright"});
	signature.onAdd = function(map) {
		var div = L.DomUtil.create("div", "leaflet-control-attribution");
		div.innerHTML = '<div>WMS Light Viewer assembled by <a href="http://fonts.cat" target="_blank">Oscar Fonts</a>, <a href="http://geomati.co" target="_blank">geomati.co</a>, 2014';
		return div;
	}
	signature.addTo(map);
});

