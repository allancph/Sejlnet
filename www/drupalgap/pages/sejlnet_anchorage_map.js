var sejlnet_anchorage_map_object;
var sejlnet_anchorage_map_info_window;// = new google.maps.InfoWindow();

$('#sejlnet_anchorage_map').live('pagebeforeshow',function(){
	try {
	}
	catch (error) {
		alert("sejlnet_anchorage_map - pagebeforeshow - " + error);
	}
});

$('#sejlnet_anchorage_map').live('pageshow',function(){
	try {
		document.addEventListener("deviceready", sejlnet_anchorage_map_onDeviceReady, false);
	}
	catch (error) {
		alert("sejlnet_anchorage_map - pageshow - " + error);
	}
});

function sejlnet_anchorage_map_onDeviceReady () {
	
	// Let's check for an internet connection here, and prevent any further
	// execution if we don't have a connection.
	
    if (!isConnected()) 
    {
    	// No internet connection...
    	navigator.notification.alert(
		    'Du mangler internet forbindelse!',  // message
		    function(){},         // callback
		    'Offline',            // title
		    'OK'                  // buttonName
		);
    }
    else {
	
		views_datasource_harbor_path = "views_datasource/anchorage";
		
		// If the user has a current position, let's use it.
		lat = sejlnet_location_latitude;
		lng = sejlnet_location_longitude;
		if (drupalgap_user_position && 
			drupalgap_user_position.coords.latitude && 
			drupalgap_user_position.coords.longitude) {
			lat = drupalgap_user_position.coords.latitude;
			lng = drupalgap_user_position.coords.longitude;
			//views_datasource_harbor_path = "views_datasource/harbor_guide/nearby/" + lat + "," + lng + "_" + sejlnet_kilometer_range;
		}
		
		// Load the map
		sejlnet_anchorage_map_init(lat, lng);
		
		// Place a marker for the user position if it isn't the default position.
		if (lat != sejlnet_location_latitude && lng != sejlnet_location_longitude) {
			var pinColor = "34ba46";
		    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
		        new google.maps.Size(21, 34),
		        new google.maps.Point(0,0),
		        new google.maps.Point(10, 34));
		    var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
		        new google.maps.Size(40, 37),
		        new google.maps.Point(0, 0),
		        new google.maps.Point(12, 35));
		    var marker = new google.maps.Marker({
		        position: new google.maps.LatLng(lat, lng), 
		        map: sejlnet_anchorage_map_object,
		        icon: pinImage,
		        shadow: pinShadow
		    });
		}
		
		// Retrieve anchorage and place on map.
		views_options = {
			"path":views_datasource_harbor_path,
			"error":function(jqXHR, textStatus, errorThrown) {
				console.log(JSON.stringify(errorThrown));
				console.log(JSON.stringify(textStatus));
			},
			"success":function(content) {
				if ($(content.nodes).length > 0) {
					$.each(content.nodes,function(index,obj){
						
						var myLatLng = new google.maps.LatLng(obj.node.latitude, obj.node.longitude);
					    var myMarkerOptions = {
					      position: myLatLng,
					      map: sejlnet_anchorage_map_object
					    }
					    var marker = new google.maps.Marker(myMarkerOptions);
					    
					    var title = obj.node.title;
						if (title == null) {
							title = obj.node.titel; // the live site uses 'titel' for the field name
						}
					    google.maps.event.addListener(marker, 'click', function() {
					    	div_attributes = " id='" + obj.node.nid + "' " + 
					    	" style='border: 1px solid black; padding: 1em; color: blue; text-decoration: underline;' " + 
					    	" class='sejlnet_anchorage_map_anchor' ";
					    	html_content = "<div " + div_attributes + ">" + title + "</div>";
					    	sejlnet_anchorage_map_info_window.setContent(html_content);
					    	sejlnet_anchorage_map_info_window.open(sejlnet_anchorage_map_object, marker);
				    	});
					});
				}
				else {
					// No published harbors.
					alert("Beklager, der er ingen havne.");
				}
			},
		};
		// Make the service call to retrieve content.
		drupalgap_views_datasource_retrieve.resource_call(views_options);
    }
	
}

function sejlnet_anchorage_map_init(lat,lng) {
	// Set default zoom to out, zoom in if we have a user position.
	zoom = 5;
	if (drupalgap_user_position) {
		zoom = 10;
	}
	var myOptions = {
		zoom: zoom,
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    sejlnet_anchorage_map_object = new google.maps.Map(document.getElementById("sejlnet_anchorage_map_canvas"),myOptions);
    sejlnet_anchorage_map_info_window = new google.maps.InfoWindow();
}

$('.sejlnet_anchorage_map_anchor').live("click",function(){
	// Save a reference to the node id.
	drupalgap_page_node_harbor_nid = $(this).attr('id');
	drupalgap_page_node_harbor_back = "map";
	$.mobile.changePage("node_harbor.html");
});
