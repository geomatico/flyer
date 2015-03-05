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
 
				http.get('/geoserver/j_spring_security_check', params).then(function(response) {
					//TODO: error mangement
					//if(getCookie("SPRING_SECURITY_REMEMBER_ME_COOKIE") == "") alert("Wrong ID");
					console.info("Cookie set");
				});				
			}
			function getCookie(c_name) {
			    if (document.cookie.length > 0) {
			        c_start = document.cookie.indexOf(c_name + "=");
			        if (c_start != -1) {
			            c_start = c_start + c_name.length + 1;
			            c_end = document.cookie.indexOf(";", c_start);
			            if (c_end == -1) {
			                c_end = document.cookie.length;
			            }
			            return unescape(document.cookie.substring(c_start, c_end));
			        }
			    }
			    return "";
			}
			
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
					return xml.read(response, true);
				});				
			}

			function getLayers(capabilities) {
			    if(capabilities == false) return false;
				var ret = [];
				var layers = capabilities.WMS_Capabilities.Capability.Layer.Layer;
				bbox = capabilities.WMS_Capabilities.Capability.Layer.BoundingBox;
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
					if(user && pwd) setCookie(user, pwd);
					return getCapabilities(user, pwd).then(getLayers);
				}
			}
		}
	}
});

