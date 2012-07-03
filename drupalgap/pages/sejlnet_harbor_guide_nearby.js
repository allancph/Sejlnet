$('#sejlnet_harbor_guide_nearby').live('pagebeforeshow',function(){
	try {
		// Clear the list.
		$("#sejlnet_harbor_guide_nearby_content_list").html("");
		$('#sejlnet_harbor_guide_nearby_get_current_location').hide();
	}
	catch (error) {
		alert("sejlnet_harbor_guide_nearby - pagebeforeshow - " + error);
	}
});

$('#sejlnet_harbor_guide_nearby').live('pageshow',function(){
	try {
		document.addEventListener("deviceready", sejlnet_harbor_guide_nearby_onDeviceReady, false);
	}
	catch (error) {
		alert("sejlnet_harbor_guide_nearby - pageshow - " + error);
	}
});

$('#sejlnet_harbor_guide_nearby_get_current_location').live("click",function(){
	$('#sejlnet_harbor_guide_nearby_get_current_location').hide();
	// Waiting for location...
	$('#sejlnet_harbor_guide_nearby_msg').html("Venter på position...");
	navigator.geolocation.getCurrentPosition(
		sejlnet_harbor_guide_nearby_onSuccess, 
		sejlnet_harbor_guide_nearby_onError, 
		{ timeout: sejlnet_location_timeout, enableHighAccuracy: true }
	);
});

function sejlnet_harbor_guide_nearby_onDeviceReady() {
	// Hide the 'get current location' button.
	$('#sejlnet_harbor_guide_nearby_get_current_location').hide();
	// Waiting for location...
	$('#sejlnet_harbor_guide_nearby_msg').html("Venter på position...");
	navigator.geolocation.getCurrentPosition(
		sejlnet_harbor_guide_nearby_onSuccess, 
		sejlnet_harbor_guide_nearby_onError, 
		{ timeout: sejlnet_location_timeout, enableHighAccuracy: true }
	);
}

function sejlnet_harbor_guide_nearby_onSuccess(position) {
	// Location found, search for nearby harbors...
	$('#sejlnet_harbor_guide_nearby_get_current_location').show();
    location_message = sejlnet_render_geo_location_info(position);
    $('#sejlnet_harbor_guide_nearby_msg').html(
    	location_message + "<br />" +
    	"<span>Position fundet, søger efter havne tæt på...</span>"
    );
	
    sejlnet_harbor_guide_nearby_location_search(position.coords.latitude, position.coords.longitude);
}

function sejlnet_harbor_guide_nearby_onError(error) {
	// Unable to determine current position, try again?
	confirm_msg = "Vi kan ikke fastslå din position, vil du prøve igen?";
	if (confirm(confirm_msg)) {
		sejlnet_harbor_guide_nearby_onDeviceReady();
	}
	else {
		// Unable to determine current location.
		$('#sejlnet_harbor_guide_nearby_get_current_location').show();
		$('#sejlnet_harbor_guide_nearby_msg').html("Vi kan ikke fastslå din position.");
	}    
}

function sejlnet_harbor_guide_nearby_location_search(latitude, longitude) {
	try {
		
		// If we are located way outside of Denmark (testing in Ann Arbor),
		// spoof a location somewhere in Denmark.
		/*if (
				(Math.floor(latitude) > 40 && Math.floor(latitude) < 45) &&
				(Math.floor(longitude) > -85 && Math.floor(longitude) < 80)
		) {
			alert("It appears you are in the Ann Arbor Michigan area, we are going to spoof your location to Denmark.");
			latitude = sejlnet_location_latitude;
			longitude = sejlnet_location_longitude;
		}*/
		
		kilometer_range = 30;
		path = "views_datasource/harbor_guide/nearby/" + latitude + "," + longitude + "_" + kilometer_range;
		views_options = {
				"path":path,
				"error":function(jqXHR, textStatus, errorThrown) {
					if (errorThrown) {
						alert(errorThrown);
					}
					else {
						alert(textStatus);
					}
					// Refresh the list.
					$("#sejlnet_harbor_guide_nearby_content_list").listview("destroy").listview();
				},
				"success":function(content) {
					$('#sejlnet_harbor_guide_nearby_msg span').html("");
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
						html = "Sorry, we were not able to locate any nearby harbors.";
						$("#sejlnet_harbor_guide_nearby_content_list").append($("<li></li>",{"html":html}));
					}
					
					// Now that we've pulled out all the distances, let's sort them and list the harbors.
					sorted_distance_points = distance_points.sort(function(a,b){return a-b});
					if ($(content.nodes).length > 0) {
						$.each(sorted_distance_points,function(distance_index,distance_object){
							$.each(content.nodes,function(index,obj){
								if (obj.node.distance == distance_object) {
									// Extract title.
									title = obj.node.title;
									if (title == null) {
										title = obj.node.titel; // the live site uses 'titel' for the field name
									}
									// Add harbor to list.
									html = "<a href='node_harbor.html' id='" + obj.node.nid + "'>(" + obj.node.distance + " km) " + title + "</a>";
									$("#sejlnet_harbor_guide_nearby_content_list").append($("<li></li>",{"html":html}));
									return false;
								}
							});
						});
					}
					
					// Refresh the list.
					$("#sejlnet_harbor_guide_nearby_content_list").listview("destroy").listview();
				},
			};
			// Make the service call to retrieve content.
			drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		alert("sejlnet_harbor_guide_nearby_content_list - " + error);
	}
}

//When a content list item is clicked...
$('#sejlnet_harbor_guide_nearby_content_list a').live("click",function(){
	// Save a reference to the node id.
	drupalgap_page_node_harbor_nid = $(this).attr('id');
	drupalgap_page_node_harbor_back = "nearby";
});