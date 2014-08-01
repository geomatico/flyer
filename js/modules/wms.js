/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["http", "xml"], function(http, xml) {
	return {
		service: function(url) {
			function getCapabilities() {
				var params = {
					url: url,
					service: "wms",
					version: "1.3.0",
					request: "GetCapabilities"
				}
				return http.get("proxy/", params).then(function(response) {
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

