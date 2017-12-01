/*Initialize gateway links on current view*/
var activateGateways = function(){
	$('.gateway').unbind("click");
	$('.gateway').click(function(event){
		var target = $(this);
		//Update active section in navigation
		if(target.closest("#side").length > 0){
			$("#side li.on").removeClass("on");
			target.addClass("on");
		}
		//Collect variables to pass to new view
		var attr = target.attr('data-vars');
		//Check if variables exist
		if (typeof attr !== typeof undefined && attr !== false) {
			//Store variable string in local storage for the view name
			localStorage["vars_"+target.attr("data-view").toString()] = target.attr("data-vars");
		}
		if(window.location.hash.substring(1) == target.attr("data-view")){
			//Reload same view
			updateView();
		}else{
			//Change hash and call new view
			window.location.hash = target.attr("data-view");
		}
			
	});
}
//Get the view from the views directory and replace the content on the page
var updateView = function(cache){
	cache = (typeof cache == 'undefined' ? true : cache);
	//Start loading animation
	$("busy").busy();
	//Get the url string of the view to request
	var get = buildViewRequest(cache);
	//Request the view's content
	var jqxhr = $.get( get, function( data ) {
		//Scroll page to top of the frame
		$("#main")[0].scrollTop = 0;
		//Add content onto page
		$("#main").html(data);
		//Activate any new links to views on the new page
		activateGateways();
		//End loading animation
		$("busy").notBusy();
		//Update navigation if the requested view has a match
		if($("#side li[data-view='"+window.location.hash.substring(1)+"']").length > 0){
			$("#side li.on").removeClass("on");
			$("#side li[data-view='"+window.location.hash.substring(1)+"']").addClass("on");
		}else if(window.location.hash.substring(1) == "main"){
			$("#side li.on").removeClass("on");
		}
	}).fail(function() {
		//View could not be found
		window.location.hash = "404";
  	});
}
//Get the url string of the current view being requested
var buildViewRequest = function(cache){
	var get = "";
	cache = (typeof cache == 'undefined' ? true : cache);
	//Check if hash has been set
	if(window.location.hash) {
		//Start with the php file with the same name as the hash
		get = "views/"+window.location.hash.substring(1)+".php";
		//Check if variables have been stored in local storage and need to be passed to the view
		if (localStorage.getItem("vars_"+window.location.hash.substring(1)) !== null) {
			if (localStorage.getItem("vars_"+window.location.hash.substring(1)) != "") {
				//Add stored variables to the url
				get = get+localStorage.getItem("vars_"+window.location.hash.substring(1));
				if(cache === false){
					//Add unique value to force a fresh request
					get = get+"&d="+Date().toString();
				}
			}else if(cache === false){
				//Add unique value to force a fresh request
				get = get+"?d="+Date().toString();	
			}
	  	}else{
			//Add unique value to force a fresh request
			get = get+"?d="+(Date().toString());
	  	}
	} else {
		//Get the default view with no variables passed
		get = "views/main.php";
	}
	return get;
}
//Adds click handler when navigation is open on small devices
var setBody = function(event){
	$('#main,#navCoverall').bind("click touchstart",function(e){
		if(e != event || $(event.target).attr("id") == "navCoverall"){
			$("#home").removeClass("navOn");
		}
		$('#main').unbind("click");
	});
}
//Initialize Functions
$(document).ready(function(){
	//Open menu when menu button is clicked
	$('#openNav').unbind("click");
	$('#openNav').click(function(event){
		$("#home").addClass("navOn");
		setBody(event);
	});
	//Listen for hash to change and update view accordingly
	window.onhashchange = function(e) {
		updateView();
	}
	//Load the page content
	updateView(false);
});