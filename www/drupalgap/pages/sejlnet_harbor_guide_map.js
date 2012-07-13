var sejlnet_harbor_guide_map_object;
var sejlnet_harbor_guide_map_info_window;// = new google.maps.InfoWindow();

$('#sejlnet_harbor_guide_map').live('pagebeforeshow',function(){
	try {
	}
	catch (error) {
		alert("sejlnet_harbor_guide_map - pagebeforeshow - " + error);
	}
});

$('#sejlnet_harbor_guide_map').live('pageshow',function(){
	try {
		document.addEventListener("deviceready", sejlnet_harbor_guide_map_onDeviceReady, false);
	}
	catch (error) {
		alert("sejlnet_harbor_guide_map - pageshow - " + error);
	}
});

function sejlnet_harbor_guide_map_onDeviceReady () {
	
	// Let's check for an internet connection here, and prevent any further
	// execution if we don't have a connection.
	var networkState = navigator.network.connection.type;

    drupalgap_states = {};
    drupalgap_states[Connection.UNKNOWN]  = 'Unknown connection';
    drupalgap_states[Connection.ETHERNET] = 'Ethernet connection';
    drupalgap_states[Connection.WIFI]     = 'WiFi connection';
    drupalgap_states[Connection.CELL_2G]  = 'Cell 2G connection';
    drupalgap_states[Connection.CELL_3G]  = 'Cell 3G connection';
    drupalgap_states[Connection.CELL_4G]  = 'Cell 4G connection';
    drupalgap_states[Connection.NONE]     = 'No network connection';

    // TODO: I don't know why we're doing a compare with a string literal, 
    //       which requires an extra hash lookup and seems more error-prone than 
    //       comparing directly to Connection.UNKNOWN, Connection.WIFI, etc.
    //       Also, this code (and comment) are copy-pasted into 3 locations.  
    //       Let's factor this out.
    //       -joe
    
    if (drupalgap_states[networkState] == 'No network connection'
        || drupalgap_states[networkState] == 'Unknown connection') 
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
	
		views_datasource_harbor_path = "views_datasource/harbor_guide";
		
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
		sejlnet_harbor_guide_map_init(lat, lng);
		
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
		        map: sejlnet_harbor_guide_map_object,
		        icon: pinImage,
		        shadow: pinShadow
		    });
		}
		
		// Retrieve harbors and place on map.
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
					      map: sejlnet_harbor_guide_map_object
					    }
					    var marker = new google.maps.Marker(myMarkerOptions);
					    
					    var title = obj.node.title;
						if (title == null) {
							title = obj.node.titel; // the live site uses 'titel' for the field name
						}
					    google.maps.event.addListener(marker, 'click', function() {
					    	html_content = "<a href='node_harbor.html' id='" + obj.node.nid + "' style='align: center; font-style: bold; font-size: 30px;' class='sejlnet_harbor_guide_map_harbor'>" + title + "</a>";
					    	sejlnet_harbor_guide_map_info_window.setContent(html_content);
					    	sejlnet_harbor_guide_map_info_window.open(sejlnet_harbor_guide_map_object, marker);
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

function sejlnet_harbor_guide_map_init(lat,lng) {
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
    sejlnet_harbor_guide_map_object = new google.maps.Map(document.getElementById("sejlnet_harbor_guide_map_canvas"),myOptions);
    sejlnet_harbor_guide_map_info_window = new google.maps.InfoWindow();
}

$('.sejlnet_harbor_guide_map_harbor').live("click",function(){
	// Save a reference to the node id.
	drupalgap_page_node_harbor_nid = $(this).attr('id');
	drupalgap_page_node_harbor_back = "map";
});
