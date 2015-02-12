/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['jquery-simplemodal'], function() {
	
	var ids = {
			user: "loginUser",
			pwd: "loginPwd",
			submit: "modalSubmit"
	};
	
	var title = "Inicieu sessió al servei de mapes";
	var logo =  "http://maps.bgeo.es/logos/bgeo_trans.png";

	return {
		
		buildError: function(msg) {
	    	$.modal(msg).open();
        },
        
		buildLogin: function(identifiers) {
	    	if(identifiers) ids = identifiers;
	    	$.modal('<img class="logo" src="' + logo + '" /><h3>' + title + '</h3><input id="' + ids.user + '" placeholder="Usuari"/><br/><input id="' + ids.pwd + '" placeholder="Contrasenya" type="password"/><input id="' + ids.submit + '" type="submit" value="Enviar">').open();
        },	
        
		onSubmit: function(callback) {
			// we bind the callback to submit and close the modal
			$('#'+ids.submit).bind('click', function() {
				callback($('#'+ids.user).val(), $('#'+ids.pwd).val());
				$.modal.close();
			});
		}
	}
});

