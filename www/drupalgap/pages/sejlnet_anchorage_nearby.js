$('#sejlnet_anchorage_nearby').on('pagebeforeshow',function(){
	try {
		// Clear the list.
		$("#sejlnet_anchorage_nearby_content_list").html("");
		$('#sejlnet_anchorage_nearby_get_current_location').hide();
	}
	catch (error) {
		alert("sejlnet_anchorage_nearby - pagebeforeshow - " + error);
	}
});

$('#sejlnet_anchorage_nearby').on('pageshow',function(){
	try {
		document.addEventListener("deviceready", sejlnet_anchorage_nearby_onDeviceReady, false);
	}
	catch (error) {
		alert("sejlnet_anchorage_nearby - pageshow - " + error);
	}
});

$('#sejlnet_anchorage_nearby_get_current_location').live("click",function(){
	// User didn't have a position set, let's try to locate them...
	$('#sejlnet_anchorage_nearby_get_current_location').hide();
	// Waiting for location...
	$('#sejlnet_anchorage_nearby_msg').html("Venter på position...");
	navigator.geolocation.getCurrentPosition(
		sejlnet_anchorage_nearby_onSuccess, 
		sejlnet_anchorage_nearby_onError, 
		{ timeout: sejlnet_location_timeout, enableHighAccuracy: true }
	);
});

function sejlnet_anchorage_nearby_onDeviceReady() {
	
	// Let's check for an internet connection here, and prevent any further
	// execution if we don't have a connection.
	if (!isConnected()) {
    	// No internet connection...
    	navigator.notification.alert(
		    'Du mangler internet forbindelse!',  // message
		    function(){},         // callback
		    'Offline',            // title
		    'OK'                  // buttonName
		);
    }
    else {
		// If the user has a current position, let's use it,
		// otherwise try to locate them.
		if (drupalgap_user_position && 
			drupalgap_user_position.coords && 
			drupalgap_user_position.coords.latitude && 
			drupalgap_user_position.coords.longitude) {
			sejlnet_anchorage_nearby_onSuccess(drupalgap_user_position);
		}
		else {
			// Hide the 'get current location' button.
			$('#sejlnet_anchorage_nearby_get_current_location').hide();
			// Waiting for location...
			$('#sejlnet_anchorage_nearby_msg').html("Venter på position...");
			navigator.geolocation.getCurrentPosition(
				sejlnet_anchorage_nearby_onSuccess, 
				sejlnet_anchorage_nearby_onError, 
				{ timeout: sejlnet_location_timeout, enableHighAccuracy: true }
			);
		}
    }
}

function sejlnet_anchorage_nearby_onSuccess(position) {
	// Update drupalgap user position variable.
	drupalgap_user_position = position;
	
	// Location found, search for nearby harbors...
	$('#sejlnet_anchorage_nearby_get_current_location').show();
    location_message = sejlnet_render_geo_location_info(position);
    $('#sejlnet_anchorage_nearby_msg').html(
    	location_message + "<br />" +
    	"<span>Position fundet, søger efter havne tæt på...</span>"
    );
	
    sejlnet_anchorage_nearby_location_search(position.coords.latitude, position.coords.longitude);
}

function sejlnet_anchorage_nearby_onError(error) {
	// Unable to determine current position, try again?
	confirm_msg = "Vi kan ikke fastslå din position, vil du prøve igen?";
	if (confirm(confirm_msg)) {
		// Clear out their last position and try again.
		drupalgap_user_position = null;
		sejlnet_anchorage_nearby_onDeviceReady();
	}
	else {
		// Unable to determine current location.
		$('#sejlnet_anchorage_nearby_get_current_location').show();
		$('#sejlnet_anchorage_nearby_msg').html("Vi kan ikke fastslå din position.");
	}    
}

function sejlnet_anchorage_nearby_location_search(latitude, longitude) {
	try {
		
		// If we are located way outside of Denmark (testing in Ann Arbor),
		// spoof a location somewhere in Denmark.
		if (
				(Math.floor(latitude) > 40 && Math.floor(latitude) < 45) &&
				(Math.floor(longitude) > -85 && Math.floor(longitude) < 80)
		) {
			alert("It appears you are in the Ann Arbor Michigan area, we are going to spoof your location to Denmark.");
			// Set the location somewhere near Allen.
			latitude = 55.6998232;
			longitude = 12.7553198;
		}
		
		// Clear the list.
		$("#sejlnet_anchorage_nearby_content_list").html("");
		
		var path = "views_datasource/anchorage/nearby/" + latitude + "," + longitude + "_" + sejlnet_kilometer_range;
		views_options = {
				"path":path,
				"error":function(jqXHR, textStatus, errorThrown) {
					console.log(JSON.stringify(errorThrown));
					console.log(JSON.stringify(textStatus));
					// Refresh the list.
					$("#sejlnet_anchorage_nearby_content_list").listview("destroy").listview();
				},
				"success":function(content) {
					$('#sejlnet_anchorage_nearby_msg span').html("");
					distance_points = new Array();
					// If there is any content, add each to the list, otherwise show an
					// empty message.
					if ($(content.nodes).length > 0) {
						$.each(content.nodes,function(index,obj){
							
							// Extract latitude and longitude from harbor.
							harbor_lat = obj.node.latitude;
							harbor_lng = obj.node.longitude;
							
							// Compute distance between current location and this harbor.
							distance = CalcDistanceBetween(latitude, longitude, harbor_lat, harbor_lng);
							distance_points[distance_points.length] = distance;
							
							// Add the distance to the result set so we can reference it later.
							content.nodes[index].node.distance = distance;
						});
					}
					else {
						html = "Beklager, vi kan ikke finde havne tæt på.";
						$("#sejlnet_anchorage_nearby_content_list").append($("<li></li>",{"html":html}));
					}
					
					// Now that we've pulled out all the distances, let's sort them. 
					sorted_distance_points = distance_points.sort(function(a,b){return a-b});
					// Now list the harbors.
					count = 0;
					limit = 10;
					if ($(content.nodes).length > 0) {
						$.each(sorted_distance_points,function(distance_index,distance_object){
							if (count < limit) {
								$.each(content.nodes,function(index,obj){
									if (obj.node.distance == distance_object) {
										// Extract title.
										title = obj.node.title;
										if (title == null) {
											title = obj.node.titel; // the live site uses 'titel' for the field name
										}
										// Add harbor to list.
										html = "<a href='node_anchorage.html' id='" + obj.node.nid + "'>(" + obj.node.distance + " km) " + title + "</a>";
										$("#sejlnet_anchorage_nearby_content_list").append($("<li></li>",{"html":html}));
										count++;
										return false;
									}
								});
							}
							else {
								// We reached the limit, break out.
								return false;
							}
						});
					}
					
					// Refresh the list.
					$("#sejlnet_anchorage_nearby_content_list").listview("destroy").listview();
				},
			};
			// Make the service call to retrieve content.
			drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		alert("sejlnet_anchorage_nearby_content_list - " + error);
	}
}

//When a content list item is clicked...
$('#sejlnet_anchorage_nearby_content_list a').on("click",function(){
	// Save a reference to the node id.
	drupalgap_page_node_anchorage_nid = $(this).attr('id');
	drupalgap_page_node_anchorage_back = "nearby";
});
