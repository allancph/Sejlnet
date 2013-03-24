$('#node_anchorage_map').live('pagebeforeshow',function(){
	try {
		anchorage = drupalgap_page_node_anchorage;
		// Show the anchorage title.
		$('#node_anchorage_map h2').html(anchorage.title);
	}
	catch (error) {
		alert("node_anchorage_map - pagebeforeshow " + error);
	}
});

$('#node_anchorage_map').live('pageshow',function(){
	try {
		anchorage = drupalgap_page_node_anchorage;
		// Show the anchorage google map.
		if (anchorage.latitude && anchorage.longitude) {
			node_anchorage_map_initialize(anchorage.latitude, anchorage.longitude);
		}
	}
	catch (error) {
		alert("node_anchorage_map - pageshow " + error);
	}
});

$('#node_anchorage_map_back').live("click",function(){
	node_anchorage_go_back();
});

function node_anchorage_map_initialize(lat,lng) {
	var myOptions = {
		zoom: 12,
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
    
    var myLatLng = new google.maps.LatLng(lat, lng);
    var myMarkerOptions = {
      position: myLatLng,
      map: map
    }
    var marker = new google.maps.Marker(myMarkerOptions);
}