/*
 * L.Control.Legend is a control to show legend of active layers
 */

L.Control.Legend = L.Control.extend({
	options: {
		collapsed: false,
		position: 'bottomright',
		autoZIndex: true
	},

	initialize: function (overlays, options) {
		L.setOptions(this, options);

		this._layers = {};
		this._lastZIndex = 0;
		this._handlingClick = false;

		for (i in overlays) {
			this._addLayer(overlays[i], i, true);
		}
		
		this._container = L.DomUtil.create('div', 'leaflet-control-layers legend');
	},

	onAdd: function () {
		
	    this._update();
	    return this._container;
	},

	addOverlay: function (layer, name) {
		this._addLayer(layer, name, true);
	},
	
	_addLayer: function (layer, name, overlay) {

		var id = L.stamp(layer);
		
		this._layers[id] = {
			layer: layer,
			name: name,
			overlay: overlay,
			//url: L.Util.getParamString(params, url, true),
			visible: false
		};
		
	},

	_update: function () {
		if (!this._container) { return; }
		
		this._container.innerHTML = '';

		//var overlaysPresent, i, obj;

		for (i in this._layers) {
			/*obj = this._layers[i];
			this._addItem(obj);
			overlaysPresent = overlaysPresent || obj.overlay;*/
			if(this._layers[i].visible) this._container.innerHTML += this._layers[i].name + '<br><img src="http://maps.bgeo.es/geoserver/urbanisme/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&STRICT=false&style=urb_sect" alt="legend"><br/>';
		}

		return this;
	},

	_onLayerChange: function (e) {

		var id = L.stamp(e.layer);
		
		// necesitamos un parametro 'visible' de la capa que se pueda activar o desactivar
		if(e.type == 'overlayadd') this._layers[id].visible = true;
		if(e.type == 'overlayremove') this._layers[id].visible = false;
		
		this._update();
	},

	_addItem: function (obj) {
		var image = L.DomUtil.create('img', 'leaflet-buttons-control-img');
		//image.setAttribute('src',obj.legendUrl);
		image.setAttribute('src','http://maps.bgeo.es/geoserver/urbanisme/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&STRICT=false&style=urb_sect');
		
		this._container.appendChild(image);

		return image;
	}
});

L.control.legend = function (overlays, options) {
	return new L.Control.Legend(overlays, options);
};