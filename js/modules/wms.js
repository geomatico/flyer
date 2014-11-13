/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["http", "xml"], function(http, xml) {
    var bbox = null;
	return {
	    getBbox: function() {
            return bbox;
        },	    
		service: function(url) {
			function getCapabilities() {
				var params = {
					service: "wms",
					version: "1.3.0",
					request: "GetCapabilities"
				}
				// If WMS address is absolute, proxify ... we'll use CORS!
				/*if(url.indexOf("//") > -1) {
					params.url = url;
					url = "proxy/";
				}*/
				return http.get(url, params).then(function(response) {
				    if(!response) return false;
					return xml.read(response, true);
				});				
			}

			function getLayers(capabilities) {
			    if(capabilities == false) return false;
				var ret = [];
				var layers = capabilities.WMS_Capabilities.Capability.Layer.Layer;
				bbox = capabilities.WMS_Capabilities.Capability.Layer.BoundingBox;
				for (var i in layers) {
					ret.push({
						title: layers[i].Title,
						name: layers[i].Name
					});
				}
				return ret;
			}

			return {
				getLayers: function() {
					return getCapabilities().then(getLayers);
				}
			}
		}
	}
});

