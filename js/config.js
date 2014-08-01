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
			"bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
			"leaflet": "//cdn.leafletjs.com/leaflet-0.7.3/leaflet",
			"leaflet-hash": LIB_PATH + "leaflet-hash",
			"bing": LIB_PATH + "leaflet-bing"
		},
		shim: {
			"bootstrap": {
				deps: ["jquery", "css!//maxcdn.bootstrapcdn.com/bootswatch/3.2.0/amelia/bootstrap.min.css"]
			},
			"jquery-xdomainrequest": {
				deps: ["jquery"]
			},
			"leaflet": {
				deps: ["css!//cdn.leafletjs.com/leaflet-0.7.3/leaflet.css"]
			},
			"bing": {
				deps: ["leaflet"]
			},
			"leaflet-hash": {
				deps: ["leaflet"]
			}
		}
	};
})();

