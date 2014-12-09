/*
 * L.Control.Legend is a control to show legend of active layers
 */

L.Control.Legend = L.Control.extend({
	options: {
		collapsed: false,
		position: 'bottomright',
		autoZIndex: true
	},

	onAdd: function () {

	    var div = L.DomUtil.create('div', 'leaflet-control-layers legend');
	
	    div.innerHTML += '<img src="http://maps.bgeo.es/geoserver/urbanisme/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&STRICT=false&style=urb_clas" alt="legend">';
	    div.innerHTML += '<br><img src="http://maps.bgeo.es/geoserver/urbanisme/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&STRICT=false&style=urb_sect" alt="legend">';
	
	    return div;

	}
});

L.control.legend = function (baseLayers, overlays, options) {
	return new L.Control.Legend(baseLayers, overlays, options);
};