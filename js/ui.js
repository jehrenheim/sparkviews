// JavaScript Document
(function ( $ ) {
	$.fn.busy = function() {
		var busy = $("#busy");
		if(busy.attr("data-busy") != "true"){
			busy.attr("data-busy","true");
			$("#busycoverall").velocity("fadeIn",{duration: 300, complete: function() {}});
			busy.velocity("fadeIn",{delay: 300,duration: 300, complete: function() {}});
		}else{
			//This busy already exists	
		}
		return busy;
	};
	$.fn.notBusy = function() {
		var replacement = $("#busy");
		if($("#busy").attr("data-busy") == "true"){
			$("#busy").velocity("fadeOut",{duration: 300, complete: function() {}});
			$("#busycoverall").velocity("fadeOut",{duration: 300, complete: function() { replacement = $('<div id="busy">'); $("#busy").replaceWith(replacement);}});
		}else{
			//Busy doesn't exist	
		}
		return replacement;
	};
}( jQuery ));