var sejlnet_harbor_guide_map_object;

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
	// Load the map
	sejlnet_harbor_guide_map_init(sejlnet_location_latitude, sejlnet_location_longitude);
	
	// Retrieve harbors and place on map.
	views_options = {
		"path":"views_datasource/harbor_guide",
		"error":function(jqXHR, textStatus, errorThrown) {
			if (errorThrown) {
				alert(errorThrown);
			}
			else {
				alert(textStatus);
			}
		},
		"success":function(content) {
			// If there is any content, add each to the list, otherwise show an
			// empty message.
			
			var infowindow = new google.maps.InfoWindow();
			
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
				    	new google.maps.InfoWindow({
				    	    content: "<a href='#' id='" + obj.node.nid + "' class='sejlnet_harbor_guide_map_harbor'>" + title + "</a>"
				    	}).open(sejlnet_harbor_guide_map_object,marker);
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

function sejlnet_harbor_guide_map_init(lat,lng) {
	var myOptions = {
		zoom: 5,
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    sejlnet_harbor_guide_map_object = new google.maps.Map(document.getElementById("sejlnet_harbor_guide_map_canvas"),myOptions);
}

$('.sejlnet_harbor_guide_map_harbor').live("click",function(){
	// Save a reference to the node id.
	drupalgap_page_node_harbor_nid = $(this).attr('id');
	drupalgap_page_node_harbor_back = "map";
	$.mobile.changePage("node_harbor.html");
});
