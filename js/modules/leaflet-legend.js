/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["leaflet"], function(L) {

    return {
        create: function(list) {
            var control = L.control.legend();
            
            return {
                control: null
                //control: control
            };
        }
    };

});
