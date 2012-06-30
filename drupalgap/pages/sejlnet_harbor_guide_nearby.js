$('#sejlnet_harbor_guide_nearby').live('pagebeforeshow',function(){
	try {
		// Clear the list.
		$("#sejlnet_harbor_guide_nearby_content_list").html("");
	}
	catch (error) {
		alert("sejlnet_harbor_guide_nearby - pagebeforeshow - " + error);
	}
});

$('#sejlnet_harbor_guide_nearby').live('pageshow',function(){
	try {
		document.addEventListener("deviceready", onDeviceReady, false);
	}
	catch (error) {
		alert("sejlnet_harbor_guide_nearby - pageshow - " + error);
	}
});

function onDeviceReady() {
	$('#sejlnet_harbor_guide_nearby_msg').html("Waiting for location...");
    navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: sejlnet_location_timeout, enableHighAccuracy: true });
}

function onSuccess(position) {
	$('#sejlnet_harbor_guide_nearby_msg').html("Location found, searching for nearby harbors...");
    /*location_message = 'Latitude: '           + position.coords.latitude              + '<br />' +
                        'Longitude: '          + position.coords.longitude             + '<br />' +
                        'Altitude: '           + position.coords.altitude              + '<br />' +
                        'Accuracy: '           + position.coords.accuracy              + '<br />' +
                        'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                        'Heading: '            + position.coords.heading               + '<br />' +
                        'Speed: '              + position.coords.speed                 + '<br />' +
                        'Timestamp: '          +                                   position.timestamp          + '<br />';
    alert(location_message);*/
    
    // Fill in the form with the lat/lng and start the search.
    //$('#sejlnet_harbor_guide_nearby_latitude').val(position.coords.latitude);
    //$('#sejlnet_harbor_guide_nearby_longitude').val(position.coords.longitude);
	
    sejlnet_harbor_guide_nearby_location_search(position.coords.latitude, position.coords.longitude);
}

// onError Callback receives a PositionError object
//
function onError(error) {
	//alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
	confirm_msg = "We were unable to determine your current location. " + 
	"Would you like to try again?";
	if (confirm(confirm_msg)) {
		onDeviceReady();
	}
	else {
		alert_msg = "If you know your current latitude and longitude " + 
		"you may enter it in the text boxes provided.";
		alert(alert_msg);
		$('#sejlnet_harbor_guide_nearby_location_wrapper').show();
	}    
}

$('#sejlnet_harbor_guide_nearby_search').live("click",function(){
	latitude = $('#sejlnet_harbor_guide_nearby_latitude').val();
	longitude = $('#sejlnet_harbor_guide_nearby_longitude').val();
	if (!latitude) {
		alert("Please enter your latitude.");
		return;
	}
	if (!longitude) {
		alert("Please enter your longitude.");
		return;
	}
	$('#sejlnet_harbor_guide_nearby_msg').html("Searching for nearby harbors...");
	sejlnet_harbor_guide_nearby_location_search(latitude, longitude);
});

function sejlnet_harbor_guide_nearby_location_search(latitude, longitude) {
	try {
		
		// If we are located way outside of Denmark (testing in Ann Arbor),
		// spoof a location somewhere in Denmark.
		if (
				(Math.floor(latitude) > 40 && Math.floor(latitude) < 45) &&
				(Math.floor(longitude) > -85 && Math.floor(longitude) < 80)
		) {
			alert("It appears you are in the Ann Arbor Michigan area, we are going to spoof your location to Denmark.");
			latitude = 55.594546;
			longitude = 12.354361;
		}
		
		kilometer_range = 30;
		path = "views_datasource/harbor_guide/nearby/" + latitude + "," + longitude + "_" + kilometer_range;
		views_options = {
				"path":path,
				"error":function(jqXHR, textStatus, errorThrown) {
					$('#sejlnet_harbor_guide_nearby_msg').html("");
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
					$('#sejlnet_harbor_guide_nearby_msg').html("");
					// If there is any content, add each to the list, otherwise show an
					// empty message.
					if ($(content.nodes).length > 0) {
						$.each(content.nodes,function(index,obj){
							title = obj.node.title;
							if (title == null) {
								title = obj.node.titel; // the live site uses 'titel' for the field name
							}
							html = "<a href='node_harbor.html' id='" + obj.node.nid + "'>" + title + "</a>";
							$("#sejlnet_harbor_guide_nearby_content_list").append($("<li></li>",{"html":html}));
						});
					}
					else {
						html = "Sorry, we were not able to locate any nearby harbors.";
						$("#sejlnet_harbor_guide_nearby_content_list").append($("<li></li>",{"html":html}));
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