autenticacao.utils.limparUrl = function() { 
	
	var clean_uri = location.protocol + "//" + location.host + location.pathname;
	var hash_pos = location.href.indexOf("#");
	if (hash_pos > 0) {
	    var hash = location.href.substring(hash_pos, location.href.length);
	    clean_uri += hash;
	}
	
	if (!(/MSIE (\d+\.\d+);/.test(navigator.userAgent))) { //test for MSIE x.x;
		window.history.pushState({}, document.title, clean_uri);
	}
	
};

autenticacao.utils.verificaAncora = function() { 
	
	var hash_pos = location.href.indexOf("#");
	if (hash_pos > 0) {
	    return location.href.substring(hash_pos, location.href.length);
	}
	return false;
	
};