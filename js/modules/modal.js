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
 
	var logo =  "/logos/bgeo_trans.png";
	
	function buildLoginButton(action) {
		$('#'+ids.loginLink).html("<button>Login</button>");
		$('#'+ids.loginLink).bind('click', function() {
			buildLogin({autoOpen: 1, onSubmit: action});
			//$.modal.open();
		});
	}
	
	function buildLogin(options, identifiers) {
		if(identifiers) ids = identifiers;
		if(options.logo) logo = options.logo;
    	$('#'+ids.loginModal).html('<img class="logo" src="' + logo + '" /><input id="' + ids.user + '" placeholder="User"/><br/><input id="' + ids.pwd + '" placeholder="Password" type="password"/><input id="' + ids.submit + '" type="submit" value="Login">');
    	var modalObj = $('#'+ids.loginModal).modal();
    	
    	//build button "Login"
    	buildLoginButton(options.onSubmit);
    	
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
	    	msg = "<h3>Error</h3>" + msg;
			$.modal(msg).open();
        },
        
		buildLogin: function(options, identifiers) {
	    	return buildLogin(options, identifiers);
        }
	}
});

