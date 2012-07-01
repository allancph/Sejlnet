var drupalgap_settings;
var drupalgap_user;
var drupalgap_site_settings;
var drupalgap_user_roles_and_permissions;
var drupalgap_content_types_list;
var drupalgap_content_types_user_permissions;

$(document).ready(function() {
	
	// Clear all local storage, used for testing.
	window.localStorage.clear();
	
	drupalgap_settings_load();
	
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
			//$.mobile.changePage("drupalgap/pages/dashboard.html");
			//$.mobile.changePage("drupalgap/pages/sejlnet_gallery.html");
			//node_group_image_nid = 6721;
			//$.mobile.changePage("drupalgap/pages/node_group_image.html");
			//drupalgap_page_node_harbor_nid = 3729;
			//$.mobile.changePage("drupalgap/pages/node_harbor.html");
			$.mobile.changePage("drupalgap/pages/sejlnet_harbor_guide_nearby.html");
			//sejlnet_group_nid = 4471;
			//$.mobile.changePage("drupalgap/pages/sejlnet_group.html");
			//$.mobile.changePage("drupalgap/pages/sejlnet_groups.html");
			//$.mobile.changePage("drupalgap/pages/sejlnet_gallery_photo_add.html");
			
		}
	};
	drupalgap_services_resource_system_connect.resource_call(options);
	
});

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
