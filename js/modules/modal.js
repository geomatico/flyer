/**
 * @author Martí Pericay <marti@pericay.com>
 */
define(['jquery-simplemodal'], function() {
	
	var ids = {
			user: "loginUser",
			pwd: "loginPwd",
			submit: "modalSubmit",
			loginLink: "loginLink",
			loginModal: "loginModal"
	};
	
	var title = "BGEO log in";
	var logo =  "http://maps.bgeo.es/logos/bgeo_trans.png";
	
	function buildLink(action) {
		$('#'+ids.loginLink).html("<button>Login</button>");
		$('#'+ids.loginLink).bind('click', function() {
			buildLogin({autoOpen: 1, onSubmit: action});
			//$.modal.open();
		});
	}
	
	function buildLogin(options, identifiers) {
		if(identifiers) ids = identifiers;
    	$('#'+ids.loginModal).html('<img class="logo" src="' + logo + '" /><h3>' + title + '</h3><input id="' + ids.user + '" placeholder="User"/><br/><input id="' + ids.pwd + '" placeholder="Password" type="password"/><input id="' + ids.submit + '" type="submit" value="Login">');
    	var modalObj = $('#'+ids.loginModal).modal();
    	
    	//build button "Login"
    	buildLink(options.onSubmit);
    	
    	if(options) {
    		if(options.onSubmit) onSubmit(options.onSubmit);
	    	// default is a closed plugin
	    	if(!(options.autoOpen == '1')) modalObj.close();
    	}
    	return modalObj;
    }
	
	function onSubmit(callback) {
		// we bind the callback to submit and close the modal
		$('#'+ids.submit).bind('click', function() {
			callback($('#'+ids.user).val(), $('#'+ids.pwd).val());
			$.modal.close();
		});
	}

	return {
		
		buildError: function(msg) {
			$.modal(msg).open();
        },
        
		buildLogin: function(options, identifiers) {
	    	return buildLogin(options, identifiers);
        }
	}
});

