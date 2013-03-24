var drupalgap = {
  'online':false,
};
var drupalgap_settings;
var drupalgap_user;
var drupalgap_site_settings;
var drupalgap_user_roles_and_permissions;
var drupalgap_content_types_list;
var drupalgap_content_types_user_permissions;
var drupalgap_online;
var drupalgap_states;
var drupalgap_first_time;
var drupalgap_user_position;
//Test for Allan's area...
/*drupalgap_user_position = {};
drupalgap_user_position.coords = {};
drupalgap_user_position.coords.latitude = 55.5998232;
drupalgap_user_position.coords.longitude = 12.6553198;
drupalgap_user_position.coords.accuracy = 13;*/

$(document).ready(function() {
	
	// Clear all local storage, used for testing.
	window.localStorage.clear();
	
	document.addEventListener("deviceready", drupalgap_onDeviceReady, false);
});

function drupalgap_onDeviceReady() {
    
    drupalgap_settings_load();
    
    // Check device connection. If the device is offline, warn the user and then
    // go to the offline page.
    drupalgap_check_connection();
    if (!drupalgap.online) {
      navigator.notification.alert(
          'Du mangler internet forbindelse!',
          function(){ $.mobile.changePage('drupalgap/pages/offline.html'); },
          'Offline',
          'OK'
      );
      return false;
    }
    
	// Make a call to the DrupalGap bundled system connect resource.
	// TODO - do something if the system connect fails.
	// TODO - if app is online, we should probably force a reload on this,
	// otherwise fall back to the local storage session.
	options = {
		"load_from_local_storage":"0",
		"error":function(jqXHR, textStatus, errorThrown){
			console.log(JSON.stringify(errorThrown));
			console.log(JSON.stringify(textStatus));
			$.mobile.changePage("drupalgap/pages/dashboard.html");
		},
		"success":function(){
			$.mobile.changePage("drupalgap/pages/dashboard.html");
			//$.mobile.changePage("drupalgap/pages/sejlnet_gallery.html");
			//node_group_image_nid = 6721;
			//$.mobile.changePage("drupalgap/pages/node_group_image.html");
			//drupalgap_page_node_harbor_nid = 3729;
			//drupalgap_page_node_harbor_nid = 2638; // harbor with comments
			//drupalgap_page_node_harbor_nid = 4382;
			//$.mobile.changePage("drupalgap/pages/node_harbor.html");
			//$.mobile.changePage("drupalgap/pages/sejlnet_harbor_guide_nearby.html");
			//$.mobile.changePage("drupalgap/pages/sejlnet_harbor_guide_map.html");
			//sejlnet_group_nid = 4471;
			//$.mobile.changePage("drupalgap/pages/sejlnet_group.html");
			//$.mobile.changePage("drupalgap/pages/sejlnet_groups.html");
			//$.mobile.changePage("drupalgap/pages/sejlnet_gallery_photo_add.html");
		}
	};
	drupalgap_services_resource_system_connect.resource_call(options);
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

function isConnected() {
	var networkState = navigator.network.connection.type;
	var isIos = (/^iPhone/).test(device.platform) || (/^iPad/).test(device.platform);
	var isConnected = !(networkState == Connection.NONE || (networkState == Connection.UNKNOWN && isIos));
//	console.log("networkState = " + networkState);
//	console.log("device.platform = " + device.platform);
//	console.log("isIos = " + isIos);
//	console.log("isConnected = " + isConnected);
	return isConnected;
}

/**
 * Checks the devices connection and sets drupalgap.online to true if the
 * device has a connection, false otherwise.
 * @returns A string indicating the type of connection according to PhoneGap.
 */
function drupalgap_check_connection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';
    
    if (states[networkState] == 'No network connection') {
    	drupalgap.online = false;
    }
    else {
    	drupalgap.online = true;
    }

    return states[networkState];
}

