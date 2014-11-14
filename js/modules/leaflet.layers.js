/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["leaflet"], function(L) {

    var urls = {
        "mapbox":    "http://{s}.tiles.mapbox.com/v3/{styleId}/{z}/{x}/{y}.png",
        "stamen":    "http://{s}.tile.stamen.com/{styleId}/{z}/{x}/{y}.png",
        "hydda":     "http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png",
        "here": "http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/{id}/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}"
    };
    
    var apiKeys = {
        // Bing types: Aerial, AerialWithLabels, Birdseye, BirdseyeWithLabels, Road
        "bing": {
            "id" : "Au0fzRXOjOMS6KE0Z5ZOLjVIt57V1OvnUamDKKs6CaC1-Cx-0_oSFl3J9aIwUgSM"
        },
        "here": {
            "id": "VThnsShdretYiE8QDwIM",
            "code": "_nR9U5-hvBQ7-T5L-7_HKw"
        } 
    };
    
    var attributions = {
        "mapbox": 'Map data &copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap contributors</a>, imagery &copy; <a href="http://mapbox.com" target="_blank">MapBox</a>',
        "stamen": 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
        "hydda": 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        "here": 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>'
    };
    
    return {
        create: function(list) {
            var control = L.control.layers();
            //control.options = {autoZIndex: true, position: 'topright'};
            var layer;

            for (name in list) {
                var def = list[name];
                switch (def.type) {
                    case "bing":
                        layer = new L.BingLayer(apiKeys[def.type]["id"], {type: def.id, culture: 'es-ES'});                   
                        break;
                    case "here":
                        layer = L.tileLayer(urls[def.type], { subdomains: '1234',  mapID: 'newest', id: def.id, app_id: apiKeys[def.type]["id"], app_code: apiKeys[def.type]["code"], base: 'aerial', minZoom: 0, maxZoom: 20, styleId: def.id, attribution: attributions[def.type]});                    
                        break;
                    default:
                        layer = L.tileLayer(urls[def.type], {styleId: def.id, attribution: attributions[def.type]});                    
                        break;
                };
                control.addBaseLayer(layer, name);
            }
            
            return {
                control: control,
                activeLayer: layer,
                addTo: function(map) {
                    map.addControl(this.control);
                    map.addLayer(this.activeLayer);
                }
            };
        }
    };

});
