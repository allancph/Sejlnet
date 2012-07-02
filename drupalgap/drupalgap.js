var drupalgap_settings;
var drupalgap_user;
var drupalgap_site_settings;
var drupalgap_user_roles_and_permissions;
var drupalgap_content_types_list;
var drupalgap_content_types_user_permissions;
var drupalgap_online;
var drupalgap_states;
var drupalgap_first_time;

$(document).ready(function() {
	
	// Clear all local storage, used for testing.
	window.localStorage.clear();
	
	document.addEventListener("deviceready", drupalgap_onDeviceReady, false);
});

function drupalgap_onDeviceReady() {
	var networkState = navigator.network.connection.type;

    drupalgap_states = {};
    drupalgap_states[Connection.UNKNOWN]  = 'Unknown connection';
    drupalgap_states[Connection.ETHERNET] = 'Ethernet connection';
    drupalgap_states[Connection.WIFI]     = 'WiFi connection';
    drupalgap_states[Connection.CELL_2G]  = 'Cell 2G connection';
    drupalgap_states[Connection.CELL_3G]  = 'Cell 3G connection';
    drupalgap_states[Connection.CELL_4G]  = 'Cell 4G connection';
    drupalgap_states[Connection.NONE]     = 'No network connection';
    
    drupalgap_settings_load();
    
    if (drupalgap_states[networkState] == 'No network connection') {
    	alert("Missing Internet Connection!");
    	drupalgap_user = {"uid":0};
    	//alert(drupalgap_first_time);
    	if (drupalgap_online == null) {
    		drupalgap_online = false;
    		// First time...
    		drupalgap_first_time = true;
    		$.mobile.changePage("drupalgap/pages/dashboard.html", {allowSamePageTransition:true, reloadPage:true});
    	}
    	else {
    		drupalgap_first_time = false;
    		$.mobile.changePage("dashboard.html", {allowSamePageTransition:true, reloadPage:true});
    	}
    	
    }
    else {
    	drupalgap_online = true;
    	// Make a call to the DrupalGap bundled system connect resource.
    	// TODO - do something if the system connect fails.
    	// TODO - if app is online, we should probably force a reload on this,
    	// otherwise fall back to the local storage session.
    	options = {
    		"load_from_local_storage":"0",
    		"error":function(jqXHR, textStatus, errorThrown){
    			if (errorThrown) {
    				alert(errorThrown);
    			}
    			else {
    				alert(textStatus);
    			}
    		},
    		"success":function(){
    			// Go to the dashboard.
    			
    			// If it isn't our first time loading it (from an offline state)
    			if (!drupalgap_first_time) {
    				$.mobile.changePage("dashboard.html", {allowSamePageTransition:true, reloadPage:true});
    			}
    			else {
    				$.mobile.changePage("drupalgap/pages/dashboard.html");
    				//$.mobile.changePage("drupalgap/pages/sejlnet_gallery.html");
	    			//node_group_image_nid = 6721;
	    			//$.mobile.changePage("drupalgap/pages/node_group_image.html");
	    			//drupalgap_page_node_harbor_nid = 3729;
	    			//drupalgap_page_node_harbor_nid = 2638; // harbor with comments
	    			//$.mobile.changePage("drupalgap/pages/node_harbor.html");
	    			//$.mobile.changePage("drupalgap/pages/sejlnet_harbor_guide_nearby.html");
	    			//$.mobile.changePage("drupalgap/pages/sejlnet_harbor_guide_map.html");
	    			//sejlnet_group_nid = 4471;
	    			//$.mobile.changePage("drupalgap/pages/sejlnet_group.html");
	    			//$.mobile.changePage("drupalgap/pages/sejlnet_groups.html");
	    			//$.mobile.changePage("drupalgap/pages/sejlnet_gallery_photo_add.html");
    			}
    		}
    	};
    	drupalgap_services_resource_system_connect.resource_call(options);
    }
}

function drupalgap_settings_load () {
	//drupalgap_settings = window.localStorage.getItem("drupalgap_settings");
	//if (!drupalgap_settings) { // no settings found in local storage, setup defaults...
		drupalgap_settings = {};
		//drupalgap_settings.site_path = "http://10.0.2.2/sejlnet.dk/www";
		drupalgap_settings.site_path = "http://www.sejlnet.dk";
		//drupalgap_settings.base_path = "/?q=";
		drupalgap_settings.base_path = "/";
		drupalgap_settings.services_endpoint_default = "drupalgap";
		drupalgap_settings.demo = false;
		drupalgap_settings.variable = null;
		//drupalgap_settings_save(drupalgap_settings);
	//}
	//else {
		//drupalgap_settings = JSON.parse(drupalgap_settings);
	//}
	return drupalgap_settings;
}

function drupalgap_settings_save (settings) {
	window.localStorage.setItem("drupalgap_settings",JSON.stringify(settings));
	drupalgap_settings = settings;
	return drupalgap_settings;
}
