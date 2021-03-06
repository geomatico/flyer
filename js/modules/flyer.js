/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(['leaflet', 'leaflet.layers','wms', 'jquery', 'modal', 'leaflet-legend', 'leaflet-info-wms', 'leaflet-hash', 'css!flyer.css'], function(L, layers, wms, $, modal) {
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
	var layerControl = base.control;
	var legendExists = (getQueryVariable("leg") == "1") ? true : false;
	var legendControl = L.control.legend();

	var overlays = [];
	var auth = false;
	var url;
	var baseUrl = "/geoserver/";
	// get workspace
	var defaultWorkspace = "home";
	// special users that don't have an associated workspace
	var specialUsers = ["admin", "public"];
	var workspace = getQueryVariable("ws"); 
	
	//get profile
	var profileId = getQueryVariable("profile");
	if(!profileId) profileId = window.location.hostname;
	var profile = getProfile(profileId);
	
	// we build the modal
	//after submitting, we reload everything, with auth: capabilities, layer manager
	modal.buildLogin({ logo: profile.modalLogo,  autoOpen: getQueryVariable("login"), onSubmit: loadLayers });
	 
	//we load the default layers (before logging) 
	loadLayers();
	
	function loadLayers(user, pwd) {
		url = baseUrl;
		if(specialUsers.indexOf(user) == -1) {
			if(user) url += user + "/";	
			else url += workspace ? workspace + "/" : defaultWorkspace + "/";
		}
		url += "wms";
		
		auth = ((user && pwd) ? true : false);
		
		//remove old overlays
		for (var i in overlays) {
			layerControl.removeLayer(overlays[i]);
			map.removeLayer(overlays[i]);
		}		
		// get capabilities, parse, get layers and center
		var service = wms.service(url);
		service.getLayers(user, pwd).then(updateOverlays, errorLayers).then(centerMap);
	}
	
	function errorLayers() {
		if(auth) {
			var msg = "User or password not valid";
			if(workspace) msg = "This user has no permission in workspace " + workspace;
			modal.buildError(msg);
		}
	}
	
	function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
          var pair = vars[i].split("=");
          if (pair[0] == variable) {
            return pair[1];
          }
        } 
    }
	
	function getProfile(profileId) {
		var modalLogo, mainLogo;
		switch(profileId) {
			case "maps.geo-training.com":
				modalLogo = "/logos/geot_trans.png";
				defaultLogo = "/logos/geot.png";
				break;
			case "maps.bgeo.es":
			default:
				modalLogo = "/logos/bgeo_trans.png";
				defaultLogo = "/logos/bgeo.png";
				break;
		}
		return {
			modalLogo: modalLogo,
			defaultLogo: defaultLogo
		}
	}
	
	function centerMap() {
	    var bbox = wms.getBbox();
	    if(bbox == null) return;
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
                transparent: 'true',
                info_format: 'application/json'
            });

            layerControl.addOverlay(layer, title);
            legendControl.addOverlay(layer, title);
            //we want top-to-bottom approach so we set zIndex manually
            var zIndex = 100 - i;
            layer.setZIndex(zIndex);
            
			overlays.push(layer);
		}
		
		// we only build legend if it's not a mobile device?
		//if(legendExists && !L.Browser.mobile) buildLegend();
		if(legendExists) buildLegend();
		
	}
	
	function buildLegend() {
		
		map.on('overlayadd overlayremove', function (e) {
			legendControl._onLayerChange(e);
		  });
		
		// add to map
		legendControl.addTo(map);
			
	}

	// Add all sorts of decorations
	L.control.scale().addTo(map);

	var signature = L.control({position: "bottomright"});
	signature.onAdd = function(map) {
		var div = L.DomUtil.create("div", "leaflet-control-attribution");
		div.innerHTML = '<div>Developed by <a href="http://www.bgeo.es" target="_blank">BGEO</a>, <a href="http://fonts.cat" target="_blank">O.Fonts</a>, <a href="http://www.pericay.com" target="_blank">M.Pericay</a>, 2014-15';
		return div;
	};
	signature.addTo(map);
	
	
    /*var refresh = L.control({position: "bottomright"});
    
    refresh.onAdd = function(map) {
        function refreshMap(e) {
            map._resetView(map.getCenter(), map.getZoom(), true);
            e.stopPropagation();
        }
        var div = L.DomUtil.create("div", "leaflet-control-attribution");
        var butt = L.DomUtil.create("button", "butt", div);
        butt.innerHTML = "Refresh";
        L.DomEvent.addListener(butt, 'click', refreshMap);
        return div;
    }
    refresh.addTo(map);*/

	var logo = L.control({position: "topleft"});
	logo.onAdd = function(map) {
		var div = L.DomUtil.create("div", "logo");
		var logoSrc = (workspace && (workspace != defaultWorkspace)) ? "/logos/" + workspace.toLowerCase() + ".png" : profile.defaultLogo;
		div.innerHTML = '<img src="' + logoSrc + '">';
		return div;
	};
	logo.addTo(map);

});

