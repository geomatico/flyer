/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["http", "xml"], function(http, xml) {
	return {
		service: function(url) {
			function getCapabilities() {
				var params = {
					service: "wms",
					version: "1.3.0",
					request: "GetCapabilities"
				}
				// If WMS address is absolute, proxify
				if(url.indexOf("//") > -1) {
					params.url = url;
					url = "proxy/";
				}
				return http.get(url, params).then(function(response) {
					return xml.read(response, true);
				});				
			}

			function getLayers(capabilities) {
				var ret = [];
				var layers = capabilities.WMS_Capabilities.Capability.Layer.Layer;
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

