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

$('#sejlnet_harbor_guide_nearby_get_current_location').live("click",function(){
	navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: sejlnet_location_timeout, enableHighAccuracy: true });
});

function onDeviceReady() {
	$('#sejlnet_harbor_guide_nearby_msg').html("Waiting for location...");
    navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: sejlnet_location_timeout, enableHighAccuracy: true });
    sejlnet_harbor_guide_nearby_map_init(sejlnet_location_latitude, sejlnet_location_longitude);
}

function onSuccess(position) {
    location_message = 'Latitude: '           + position.coords.latitude              + '<br />' +
                        'Longitude: '          + position.coords.longitude             + '<br />' +
                        'Altitude: '           + position.coords.altitude              + '<br />' +
                        'Accuracy: '           + position.coords.accuracy              + '<br />' +
                        'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                        'Heading: '            + position.coords.heading               + '<br />' +
                        'Speed: '              + position.coords.speed                 + '<br />';
    $('#sejlnet_harbor_guide_nearby_msg').html(
    	location_message + "<hr />" +
    	"Location found, searching for nearby harbors..."
    );
    
    // Fill in the form with the lat/lng and start the search.
    $('#sejlnet_harbor_guide_nearby_latitude').val(position.coords.latitude);
    $('#sejlnet_harbor_guide_nearby_longitude').val(position.coords.longitude);
    
    sejlnet_harbor_guide_nearby_map_init(position.coords.latitude, position.coords.longitude);
	
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
		$('#sejlnet_harbor_guide_nearby_msg').html("If you know your current latitude and longitude " + 
				"you may enter it in the text boxes provided.");
		// Fill in the form with the lat/lng and start the search.
	    $('#sejlnet_harbor_guide_nearby_latitude').val(sejlnet_location_latitude);
	    $('#sejlnet_harbor_guide_nearby_longitude').val(sejlnet_location_longitude);
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
	sejlnet_harbor_guide_nearby_map_init(latitude, longitude);
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
			latitude = sejlnet_location_latitude;
			longitude = sejlnet_location_longitude;
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
					distance_points = new Array();
					$('#sejlnet_harbor_guide_nearby_msg').html("");
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

function sejlnet_harbor_guide_nearby_map_init(lat,lng) {
	$('#sejlnet_gallery_photo_add_map_canvas').show();
	var myOptions = {
		zoom: 5,
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("sejlnet_harbor_guide_nearby_map_canvas"),myOptions);
    
    var myLatLng = new google.maps.LatLng(lat, lng);
    var myMarkerOptions = {
      position: myLatLng,
      map: map
    }
    var marker = new google.maps.Marker(myMarkerOptions);
}