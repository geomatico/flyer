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
			
			function setCookie(user, pwd) {
				var params = {
						username: user,
						password: pwd
				}
				
				var securityUrl = '/geoserver/j_spring_security_check';
 
				return http.get(securityUrl).then(function(response) {
					console.info("Cookie set");
					return response;
				}, function(error) {
					console.info("Error getting cookie at " + securityUrl + ": " + error.error + " (code " + error.code + ")");
					return 0;
				});				
			}
			
			function callCapabilities(user, pwd) {
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
					return xml.read(response, true);
				}, function(error){
					return false;
				});				
			}
			
			function getCapabilities(user, pwd) {
				// we need to make one call after the other or cookies are mixed!
				return callCapabilities(user, pwd).then(setCookie(user, pwd));
			}

			function getLayers(capabilities) {
			    if(capabilities == false) return false;
				var ret = [];
				var layers = capabilities.WMS_Capabilities.Capability.Layer.Layer;
				if(layers) bbox = capabilities.WMS_Capabilities.Capability.Layer.BoundingBox;
				//only one layer?
				if(layers && !layers.length) layers = new Array(layers);
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
					//if(user && pwd) setCookie(user, pwd);
					return getCapabilities(user,pwd).then(getLayers);
				}
			}
		}
	}
});

