var require = (function() {
	var scripts = document.getElementsByTagName('script');
	var HERE = scripts[scripts.length-1].src.replace(/[^\/]*$/, '');
	var LIB_PATH = HERE + "lib/";
	return {
		baseUrl: HERE + "modules/",
		paths: {
			"css": LIB_PATH + "css",
			"jquery": "//code.jquery.com/jquery-2.1.1.min",
			"jquery-xdomainrequest": LIB_PATH + "jquery-xdomainrequest-1.0.1.min",
			//"bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
			"leaflet": "//cdn.leafletjs.com/leaflet-0.7.3/leaflet",
			"leaflet-info-wms": LIB_PATH + "L.TileLayer.InfoWMS",
			"leaflet-legend": LIB_PATH + "L.Control.Legend",
			"leaflet-hash": LIB_PATH + "leaflet-hash",
			"jquery-simplemodal": LIB_PATH + "jquery.simplemodal.1.4.4.min"
			//"mustache": "//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.8.1/mustache"
			//"bing": LIB_PATH + "leaflet-bing"
		},
		shim: {
			"bootstrap": {
				deps: ["jquery", "css!//maxcdn.bootstrapcdn.com/bootswatch/3.2.0/amelia/bootstrap.min.css"]
			},
			"jquery-xdomainrequest": {
				deps: ["jquery"]
			},
			"jquery-simplemodal": {
				deps: ["css!../../css/modal.css"]
			},
			"leaflet": {
				deps: ["css!//cdn.leafletjs.com/leaflet-0.7.3/leaflet.css"]
			},
			"bing": {
				deps: ["leaflet"]
			},
			"leaflet-hash": {
				deps: ["leaflet"]
			},
			"leaflet-info-wms": {
				deps: ["leaflet"]
			},
			"leaflet-legend": {
				deps: ["leaflet"]
			}  
		}
	};
})();

