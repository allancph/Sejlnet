$('#drupalgap_page_dashboard').live('pagebeforeshow',function(){
	try {
		dashboard_init();
	}
	catch (error) {
		console.log("drupalgap_page_dashboard - pagebeforeshow - " + error);
	}
});

var dashboard_first_time = true;
$('#drupalgap_page_dashboard').live('pageshow',function(){
	try {
		
		// If we're offline and this is not our first time visiting the
		// dashboard, re-initialize it because the pagebeforeshow event
		// will not be fired again.
		if (!dashboard_first_time) {
                                    
            // If they're coming back to the dashboard and were offline, they might 
            // be online now, try refreshing the site settings
			// Check for connection.
									
			if (!drupalgap_site_settings && isConnected()) {
                console.log("calling system connect to refresh dashboard");
                options = {
                    "load_from_local_storage":"0",
                    "error":function(jqXHR, textStatus, errorThrown){
                    },
                    "success":function(){
                        dashboard_init();
                    }
                };
                drupalgap_services_resource_system_connect.resource_call(options);
            }
			dashboard_init();
        } else {
            dashboard_first_time = false;
        }
	}
	catch (error) {
		console.log("drupalgap_page_dashboard - pageshow - " + error);
	}
});

function dashboard_init() {
	try {
		
		// Display site name.
		if (drupalgap_site_settings) {
			site_name = drupalgap_site_settings.variable.site_name;
			if (!site_name) { site_name = "DrupalGap"; }
		}
		else {
			site_name = "Offline";
		}
		$('#drupalgap_page_dashboard h1').html(site_name);
		
		// Hide both navbars (logic below will show them).
		$('#drupalgap_page_dashboard_navbar_anonymous').hide();
    	$('#drupalgap_page_dashboard_navbar_authenticated').hide();
		
		if (drupalgap_user.uid == 0) { // user is not logged in...
			$('#drupalgap_page_dashboard_navbar_anonymous').show();
			$('#drupalgap_page_dashboard_header_user h2').hide();
			
			// determine what to do with the user registration button based on the site settings
			if (drupalgap_site_settings) {
				switch (drupalgap_site_settings.variable.user_register) {
					case 0: // Administrators only
					case "0":
						$('#drupalgap_button_user_register').hide();
						break;
					case 1: // Visitors
					case "1":
						break;
					case 2: // Visitors, but administrator approval is required
					case "2":
						break;
				}
			}
        }
        else { // user is logged in...
        	$('#drupalgap_page_dashboard_navbar_authenticated').show();
        	// Say hello.
        	$('#drupalgap_page_dashboard_header_user h2').html("Hej " + drupalgap_user.name + "!");
        }
		
	}
	catch (error) {
		console.log("dashboard_init - " + error);
	}
}

$('#drupalgap_button_user_account').live("click",function(){
	dg_page_user_back_button_destination = "dashboard.html";
	drupalgap_page_user_uid = drupalgap_user.uid;
	$.mobile.changePage("user.html");
});

$('#drupalgap_button_user_logout').live("click",function(){
	try {
		// Build the service call options.
		options = {
			"error":function (jqXHR, textStatus, errorThrown) {
				if (errorThrown) {
					alert(errorThrown);
				}
				else {
					alert(textStatus);
				}
			},
			"success":function(){
				// TODO - changing to the dashboard here has strange behavior,
				// it would be best to go to the dashboard instead.
				$.mobile.changePage("user_login.html");
				//$.mobile.changePage("dashboard.html",{reloadPage:true},{allowSamePageTranstion:true},{transition:'none'});
			},
		};
		// Make the service call.
		drupalgap_services_drupalgap_user_logout.resource_call(options);
	}
	catch (error) {
		console.log("drupalgap_button_user_logout - " + error);	
	}
	return false;
});

$('#sejlnet_button_gallery').live("click", function(){
	// Clear out the group id so the gallery add photo page
	// won't think we are working with a group.
	sejlnet_group_nid = null;
});