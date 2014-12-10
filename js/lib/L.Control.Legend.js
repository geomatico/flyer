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

		for (i in overlays) {
			this._addLayer(overlays[i], i, true);
		}
		
		this._container = L.DomUtil.create('div', 'leaflet-control-layers legend');
		L.DomEvent.disableClickPropagation(this._container);
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
			legendUrl: this._createWMSLegendUrl(layer),
			visible: false
		};
		
	},

	_update: function () {
		if (!this._container) { return; }
		
		this._container.innerHTML = '';

		//var overlaysPresent, i, obj;

		for (i in this._layers) {
			obj = this._layers[i];
			if(obj.visible) this._addItem(obj);
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
		
		//if(!obj.legendUrl) return;
		var div = L.DomUtil.create("div", "legend-text"); 
		//obj.legendUrl = 'http://maps.bgeo.es/geoserver/urbanisme/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&STRICT=false&style=urb_sect';

		var image = L.DomUtil.create('img', 'leaflet-buttons-control-img');
		image.setAttribute('src', obj.legendUrl);
		div.innerHTML = '<br>' + obj.name;
		
		this._container.appendChild(div);
		this._container.appendChild(image);

		return this._container;
	}, 
	
	_createWMSLegendUrl: function (layer) {
		
		var params = {
		          request: 'GetLegendGraphic',
		          //style: "urb_sect",
		          layer: layer.wmsParams.layers,
		          version: "1.1.1", // Force 1.1.1, don't use 1.3.0
		          format: "image/png",
		          height: 20,
		          width: 20
		        };		
		
		return layer._url + L.Util.getParamString(params);
	}
});

L.control.legend = function (overlays, options) {
	return new L.Control.Legend(overlays, options);
};