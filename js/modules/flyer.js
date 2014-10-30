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

	var url = "/geoserver/";
	if(window.location.host == "localhost") url = "http://maps.bgeo.es" + url;
	// get workspace
	var workspace = getQueryVariable("ws");
	if(workspace) url += workspace + "/";
	url += "wms";
	
	// get capabilities, parse, get layers and center
	var service = wms.service(url);
	service.getLayers().then(updateOverlays).then(centerMap);
	var overlays = [];
	
	function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
          var pair = vars[i].split("=");
          if (pair[0] == variable) {
            return pair[1];
          }
        } 
        //alert('Query Variable ' + variable + ' not found');
    }
	
	function centerMap() {
	    var bbox = wms.getBbox();
	    var southWest = L.latLng(bbox.miny, bbox.minx),
	    northEast = L.latLng(bbox.maxy, bbox.maxx),
	    bounds = L.latLngBounds(southWest, northEast);
	    map.fitBounds(bounds);
	}

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

	// Add all sorts of decorations
	L.control.scale().addTo(map);

	var signature = L.control({position: "bottomright"});
	signature.onAdd = function(map) {
		var div = L.DomUtil.create("div", "leaflet-control-attribution");
		div.innerHTML = '<div>Assembled by <a href="http://fonts.cat" target="_blank">O.Fonts</a>, <a href="http://www.pericay.com" target="_blank">M.Pericay</a>, 2014';
		return div;
	}
	signature.addTo(map);

	var logo = L.control({position: "topleft"});
	logo.onAdd = function(map) {
		var div = L.DomUtil.create("div", "logo");
		div.innerHTML = '<img width="80" src="http://maps.bgeo.es/geoserver/www/logo_small.png">';
        div.style.backgroundColor = "rgba(255,255,255,0.7)";
		div.style.padding = "5px";
		return div;
	}
	logo.addTo(map);

});

