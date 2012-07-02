$('#node_harbor_map').live('pagebeforeshow',function(){
	try {
		harbor = drupalgap_page_node_harbor;
		// Show the harbor title.
		$('#node_harbor_map h2').html(harbor.title);
	}
	catch (error) {
		alert("node_harbor_map - pagebeforeshow " + error);
	}
});

$('#node_harbor_map').live('pageshow',function(){
	try {
		harbor = drupalgap_page_node_harbor;
		// Show the harbor google map.
		if (harbor.latitude && harbor.longitude) {
			node_harbor_map_initialize(harbor.latitude, harbor.longitude);
		}
	}
	catch (error) {
		alert("node_harbor_map - pageshow " + error);
	}
});

$('#node_harbor_map_back').live("click",function(){
	node_harbor_go_back();
});

function node_harbor_map_initialize(lat,lng) {
	//alert("loading map (" + lat + ", " + lng + ")");
	var myOptions = {
		zoom: 8,
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
    
    var myLatLng = new google.maps.LatLng(lat, lng);
    var myMarkerOptions = {
      position: myLatLng,
      map: map
    }
    var marker = new google.maps.Marker(myMarkerOptions);
}
