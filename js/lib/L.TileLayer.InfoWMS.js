L.TileLayer.InfoWMS = L.TileLayer.WMS.extend({

  onAdd: function (map) {
    // Triggered when the layer is added to a map.
    //   Register a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onAdd.call(this, map);
    map.on('click', this.getFeatureInfo, this);
  },
  
  onRemove: function (map) {
    // Triggered when the layer is removed from a map.
    //   Unregister a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
    map.off('click', this.getFeatureInfo, this);
  },
  
  getFeatureInfo: function (evt) {
    // Make an AJAX request to the server and hope for the best
    var url = this.getFeatureInfoUrl(evt.latlng),
        showResults = L.Util.bind(this.showGetFeatureInfo, this);
    $.ajax({
      url: url,
      success: function (data, status, xhr) {
        showResults(null, evt.latlng, data);
      },
      error: function (xhr, status, error) {
        showResults(error);  
      }
    });
  },
  
  getFeatureInfoUrl: function (latlng) {
    // Construct a GetFeatureInfo request URL given a point
    var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
        size = this._map.getSize(),
        
        params = {
          request: 'GetFeatureInfo',
          service: 'WMS',
          srs: 'EPSG:4326',
          styles: this.wmsParams.styles,
          transparent: this.wmsParams.transparent,
          version: "1.1.1", // Force 1.1.1, don't use 1.3.0
          format: this.wmsParams.format,
          bbox: this._map.getBounds().toBBoxString(),
          height: size.y,
          width: size.x,
          x: point.x,
          y: point.y,
          layers: this.wmsParams.layers,
          query_layers: this.wmsParams.layers,
          info_format: this.wmsParams.info_format,
          feature_count: 20
        };

    // Cross-domain info request with no CORS headers need a proxy...
	/*if(this._url.indexOf("//") > -1) {
		params.url = this._url;
		url = "proxy/";
	} else {
		url = this._url;
	}*/
    // we don't need proxy! CORS!
    url = this._url;
    
    return url + L.Util.getParamString(params, url, true);
  },
  
  parseJsonToHtml: function (json) {
      var html = '';
      if(json.features) {
          for(var i = 0; i < json.features.length ; i++){
              html += '<div class="info-layer">'+json.features[i].id.split('.')[0] +'</div>';
              var fields = json.features[i].properties;
              html += '<div class="info-fields">';
              $.each(fields, function(key, data) {
                  html += '<b>' + key + '</b>: ' + data + '<br/>';
              });
              html += '</div>';
          }
      }
      
      return html;
  },
  
  showGetFeatureInfo: function (err, latlng, content) {

    if (err) { console.log(err); return; } // do nothing if there's an error
    
    //content = '<div>'+ Mustache.render("{{type}}", content)+'</div>';
    //this could be better done with mustache or similar
    if(this.wmsParams.info_format == "application/json") content = this.parseJsonToHtml(content);
    
	if (!this._map._popup) {
	  var minWidth = 220, maxHeight = 400;
	  if(L.Browser.mobile) {
	      minWidth = 150;
	      maxHeight = 200;
	  }
      
	  // Create a new popup
      var popup = L.popup({ minWidth: minWidth, maxWidth: 300, maxHeight: maxHeight})
       .setLatLng(latlng);
      
      //we don't want to show an empty popup or an error message
      if(content) popup.setContent(content).openOn(this._map);
      
	} else {
	  // Add content to popup
      this._map._popup.setContent(this._map._popup.getContent() + content);
    }
  }
});

L.tileLayer.infoWms = function (url, options) {
  return new L.TileLayer.InfoWMS(url, options);  
};
