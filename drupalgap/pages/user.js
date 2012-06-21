var drupalgap_page_user_uid;
var drupalgap_page_user_object;
var drupalgap_page_user_object_expiration = 86400; // 60*60*24 = 1 day = 86400

$('#drupalgap_page_user').live('pagebeforeshow',function(){
	try {
		// If no one set the page user id, use the current user id.
		if (!drupalgap_page_user_uid) {
			drupalgap_page_user_uid = drupalgap_user.uid;
		}
		// Prevent anonymous user profile from loading.
		if (drupalgap_page_user_uid == 0) {
			alert("Can't load user zero.");
			$.mobile.changePage("dashboard.html");
		}
    }
	catch (error) {
		alert("drupalgap_page_user - pagebeforeshow - " + error);
	}
});

$('#drupalgap_page_user').live('pageshow',function(){
	try {
		
		// If the user is looking at their own profile...
		if (drupalgap_user.uid == drupalgap_page_user_uid) {
		}
		else {
			// The user is looking at someone else's profile...
		}
		
		// Build service call options to load the user.
		options = {
			"uid":drupalgap_page_user_uid,
			"load_from_local_storage":true,
			"local_storage_expire":drupalgap_page_user_object_expiration,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert(drupalgap_page_user.errorThrown);
				alert("drupalgap_page_user - failed to load user (" + drupalgap_page_user_uid + ")");
			},
			"success":function(user){
				
				// Save a copy of the user object so others can use it.
				drupalgap_page_user_object = user;
				
				console.log(JSON.stringify(user));
				
				// Populate user account template place holders.
				
				// User name.
				$('#drupalgap_page_user h2').html(user.name);
				
				// Display account creation date and date last online. 
				// (Drupal's time value(s) must be multiplied by 1000 
				// since JavaScript deals in milliseconds for the Unix Epoch????)
				created = new Date(parseInt(user.created)*1000);
				$('#drupalgap_page_user_created').html(created.toDateString());
				last_online = new Date(parseInt(user.access)*1000);
				$('#drupalgap_page_user_last_online').html(last_online.toDateString());
			},
		};
		// Load user via services call.
		drupalgap_services_user_retrieve.resource_call(options);
		
    }
	catch (error) {
		alert("drupalgap_page_user - pageshow - " + error);
	}
});
