/*
 * L.Control.Legend is a control to show legend of active layers
 * @author Martí Pericay <marti@pericay.com>
 */

L.Control.Legend = L.Control.extend({
	options: {
		position: 'bottomright'
	},

	initialize: function (overlays, options) {
		L.setOptions(this, options);		

		this._layers = {};

		for (i in overlays) {
			this._addLayer(overlays[i], i, true);
		}
		
		this._container = L.DomUtil.create('div', 'leaflet-control-layers legend');
		L.DomEvent.disableClickPropagation(this._container);
		L.DomEvent.addListener(this._container, 'mousewheel', function (e) {
		    L.DomEvent.stopPropagation(e);
		});
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
		
		// we need a 'visible' param to activate/deactivate layers in legend
		if(e.type == 'overlayadd') this._layers[id].visible = true;
		if(e.type == 'overlayremove') this._layers[id].visible = false;
		
		this._update();
	},

	_addItem: function (obj) {
		
		//if(!obj.legendUrl) return;
		var div = L.DomUtil.create('div', 'legend-title'); 

		var image = L.DomUtil.create('img', 'legend-img');
		image.setAttribute('src', obj.legendUrl);
		div.innerHTML = obj.name;
		
		this._container.appendChild(div);
		this._container.appendChild(image);

		return this._container;
	}, 
	
	_createWMSLegendUrl: function (layer) {
		
		var params = {
		          request: "GetLegendGraphic",
		          //style: "urb_sect",
		          layer: layer.wmsParams.layers,
		          version: "1.1.1", // Force 1.1.1, don't use 1.3.0
		          format: "image/png",
		          //css-like Geoserver-specific options
		          legend_options: "fontName:Helvetica%20Neue;fontAntiAliasing:true;fontColor:0x000033;fontSize:12"
		        };		
		
		return layer._url + L.Util.getParamString(params);
	}
});

L.control.legend = function (overlays, options) {
	return new L.Control.Legend(overlays, options);
};