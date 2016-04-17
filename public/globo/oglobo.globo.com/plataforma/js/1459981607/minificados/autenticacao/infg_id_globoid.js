$(document).ready(function(){
	INFG_ID_GLOBOID.main();  
});

var INFG_ID_GLOBOID = {

	cocoonPRD: "cocoon.globo.com",
	
	cocoonSTG: "cocoon.qa.globoi.com",
	
	getCocoonUrl: function() {
		var cocoonAddress;
		
		if (this.getDominio().match(/globoi/)) {
			cocoonAddress =  this.cocoonSTG;
		} else {
			cocoonAddress =  this.cocoonPRD;
		}
		
		return "http://" + cocoonAddress + "/user/logged";
	},
		
	main: function () {
	    var glbidCookie = $.cookie('GLBID');
	    
	    var infgCookie = $.cookie('infg_id_globoid');
	    
	    if (this.isEmpty(glbidCookie)) {
	    	if (!this.isEmpty(infgCookie)) {
	        	this.removerInfgCookie();
	    	}
	    	
	    } else {
	    	    	
	    	if (this.isEmpty(infgCookie) || !this.isInfgCookieValido(infgCookie, glbidCookie)) {
	    		this.criaInfgCookie(glbidCookie);
	    	}    	
	    	
	    }
	    
	},	
	
	hashCode: function (str) {
		var hash = 0, i, chr, len;
		if (str.length == 0) return hash;
		for (i = 0, len = str.length; i < len; i++) {
		    chr   = str.charCodeAt(i);
		    hash  = ((hash << 5) - hash) + chr;
		    hash |= 0; // Convert to 32bit integer
		}
		return hash;
	},	
	
	isEmpty: function (str) {
	    return (!str || 0 === str.length);
	},
	
	removerInfgCookie: function () {
		$.removeCookie('infg_id_globoid', { expires: 30, path: '/', domain: this.getDominio() });
	},
	
	criaInfgCookie: function (glbidCookie) {
		
		var cocoonUrl = this.getCocoonUrl();
		
		// recupera o globoid e cria o cookie.	
		$.ajax({
		    url: cocoonUrl,
		    
		    async: false,
		     
		    // The name of the callback parameter, as specified by the YQL service
		    jsonp: "callback",
		 
		    // Tell jQuery we're expecting JSONP
		    dataType: "jsonp",
		 
		    // Work with the response
		    success: function( response ) {	    
		    	if (response.status == "authorized") {
		    		var globoid = response.id; // server response
		    		var globoIdPadded = INFG_ID_GLOBOID.padWithZeroes(globoid);
		    		var cookieName = "infg_id_globoid";
		    		var cookieValue = globoIdPadded + '.' + INFG_ID_GLOBOID.hashCode(glbidCookie);
		    		$.cookie(cookieName, cookieValue, { expires: 30, path: '/', domain: INFG_ID_GLOBOID.getDominio() });
		    		
		    	} else {
		    		INFG_ID_GLOBOID.removerInfgCookie();
		    	}    		    		 	  
		    },
		
			error: function ( response ) {
				this.removerInfgCookie();
			}
		});	
	},
	
	padWithZeroes: function (id) {
		var idStr = id.toString();
		while (idStr.length < 10) {
			idStr = "0" + idStr;
		}
		return idStr;
	},
	
	getDominio: function () {
		var host = document.domain;
		if (! host) {
			return "";
		} else if (host.match(/globo\.com$/)) {
			return ".globo.com";
		} else if (host.match(/globoi\.com$/)) {
			return ".globoi.com";
		} else {
			return host;
		}
	},
	

	/**
	 * Confere se o hash do cookie GLBID é igual ao valor do hash armazenado no cookie infgCookie 
	 * @param infgCookie
	 * @param glbidCookie0
	 */
	 isInfgCookieValido: function (infgCookie, glbidCookie) {
		var hashSalvo = infgCookie.split(".")[1];
		
		var hashGlbidAtual = this.hashCode(glbidCookie);
		
		return (hashSalvo == hashGlbidAtual);
	}			
};


/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));
