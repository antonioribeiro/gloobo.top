$(document).ready(function(){
	autenticacao.logoutAutomatico();  
});

var autenticacao = {};

autenticacao.versao = '1.0';

autenticacao.logoutAutomatico = function () {
	
	var cookieUtils = autenticacao.cookie;
	
	var localStorageUtils = autenticacao.localStorage;

	if (cookieUtils.getInfoglobo() == '') {
		localStorageUtils.removeToken();
		return;
	}
	
	
	if (cookieUtils.getGloboCom() != '' && localStorageUtils.getToken() == null) {
		return;
	}
	
	if (localStorageUtils.isNotAtivo() || cookieUtils.getGloboCom() == localStorageUtils.getToken()) {
		return;
	}
	
	
	$.ajax({
		url : "/cadun/logout/",
		async: false,
		type: 'POST', 
		complete: function() { 
			localStorageUtils.removeToken(); 
		}
	});
};

autenticacao.localStorage = {
	chave: 'VALIDA_GLB',
	
	getToken : function () {
		if (this.isNotAtivo()) {
			return null;
		}
		
		return localStorage.getItem(this.chave);
	},
		
	removeToken : function () {
		if (this.isNotAtivo()) {
			return;
		}
		
		localStorage.removeItem(this.chave);
	},
	
	setToken : function (valor) {
		if (this.isNotAtivo()) {
			return;
		}
		
		localStorage.setItem(this.chave, valor);
	},
	
	isNotAtivo : function () {
		return !this.isAtivo();
	},
		
	isAtivo: function () {
		if(typeof(Storage) !== "undefined") {
		    return true;
		}
		
		return false;
	}
};

autenticacao.cadun = function (kwargs) {
	
	var idServico = autenticacao.utils.extrairValorQuerystring('concluirLogin', null);
	
	var listaIdsValidos = kwargs.listaServicos;
	
	if (listaIdsValidos.indexOf(idServico) > -1) {
		
		autenticacao.utils.limparUrl();
		
		if (autenticacao.cookie.recuperar(autenticacao.cookie.globoCom) != "") {
			new autenticacao.conectar(idServico, kwargs);
		}
	}
	
};

autenticacao.conectar = function(idServico, kwargs) {
	
	var url_login = autenticacao.utils.getUrl() + 'cadun/autenticacao/';
	
	$.ajax({
		cache: false,
		data : {idDoServico : idServico},
		dataType: 'json',
		type : 'post',
		contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
		url: url_login,
		success: function(json) {

			var localStorageUtils = autenticacao.localStorage;
			var cookieUtils = autenticacao.cookie;
			
			localStorageUtils.setToken(cookieUtils.getGloboCom());
			
			if (kwargs.sucesso) {
				kwargs.sucesso(json);
			}
		},
		error: function(data) {
			if (kwargs.erro) {
				kwargs.erro(data);
			}
	  	}
	});
};


autenticacao.cookie = {
	globoCom : 'GLBID',
	
	infoglobo : 'INFGCADUN',
	
	recuperar : function (nome) {
		
		var nomeEQ = nome + "=";
		var cookies = document.cookie.split(';');
		
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			
			while (cookie.charAt(0)==' ') 
				cookie = cookie.substring(1, cookie.length);
			
			if (cookie.indexOf(nomeEQ) == 0) { 
				return cookie.substring(nomeEQ.length, cookie.length);
			}
		}
		
		return "";
	},
	
	getGloboCom: function () {
		return this.recuperar(this.globoCom);
	},
	
	getInfoglobo: function () {
		return this.recuperar(this.infoglobo);
	}	
};

autenticacao.utils = {
	extrairValorQuerystring : function(chave, url) {
		if (url == null) {
			url = this.getUrlcompleta();
		}
		chave = chave.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + chave + "=([^&#]*)");
		var qs = regex.exec(url);
		if (qs == null) {
			return "";
		} else {
			return qs[1];
		}
	},
	getUrl : function () {
		return 'http://' + window.location.hostname + '/';
	},
	getUrlcompleta : function () {
		return window.location.href;
	},
	limparUrl : function () {
		var uri = window.location.toString();
		if (uri.indexOf("?") > 0) {
		   
			var url_sem_queryString = uri.substring(0, uri.indexOf("?"));
			
			if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
				 
				 window.location.href = url_sem_queryString;
				
			} else {
				
				window.history.pushState({}, document.title, url_sem_queryString);
			}

		}
	}
};