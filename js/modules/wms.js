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
			/*function setCookie(user, pwd) {
				var params = {
						username: user,
						password: pwd
				}
 
				http.get('http://maps.bgeo.es/geoserver/j_spring_security_check', params).then(function(response) {
					//TODO: check that cookie is set
				});				
			}*/
			function getCapabilities(user, pwd) {
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
				if(user && pwd) http.auth.set(user, pwd);
				return http.get(url, params).then(function(response) {
				    if(!response) return false;
				    //TODO: check if user is logged in looking for a Cookie!
					return xml.read(response, true);
				});				
			}

			function getLayers(capabilities) {
			    if(capabilities == false) return false;
				var ret = [];
				var layers = capabilities.WMS_Capabilities.Capability.Layer.Layer;
				bbox = capabilities.WMS_Capabilities.Capability.Layer.BoundingBox;
				//only one layer?
				if(!layers.length) layers = new Array(layers);
				for (var i in layers) {
					ret.push({
						title: layers[i].Title,
						name: layers[i].Name
					});
				}
				return ret;
			}

			return {
				getLayers: function(user, pwd) {
					//setCookie(user, pwd);
					return getCapabilities(user, pwd).then(getLayers);
				}
			}
		}
	}
});

