$('#node_anchorage_comments').on('pagebeforeshow',function(){
	try {
		anchorage = drupalgap_page_node_anchorage;
		// Show the anchorage title.
		$('#node_anchorage_comments h2').html(anchorage.title);
	}
	catch (error) {
		alert("node_anchorage_comments - pagebeforeshow " + error);
	}
});

$('#node_anchorage_comments').on('pageshow',function(){
	try {
		anchorage = drupalgap_page_node_anchorage;
		
		// Retrieve comments.
		comment_options = {
			"nid":drupalgap_page_node_anchorage_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				console.log(JSON.stringify(errorThrown));
				console.log(JSON.stringify(textStatus));
			},
			"success":function(results) {
				
				// Show the 'add comment' button.
				$('#node_anchorage_comments_add').show();
				
				html = "";
				
				if (results.comments.length == 0) {
					html += "Der er ingen kommentarer på denne havn."
				}
				else {
					// If there are any comments, add each to the container, otherwise show an empty message.
					$.each(results.comments,function(index,obj){
						
						// Build comment html.
						html += drupalgap_services_comment_render(obj.comment);
					});
				}
				$("#node_anchorage_comments_list").append(html);
			},
		}
		drupalgap_services_comment_node_comments.resource_call(comment_options);
	}
	catch (error) {
		alert("node_anchorage_comments - pageshow " + error);
	}
});

$('#node_anchorage_comments_back').on("click",function(){
	node_anchorage_go_back();
});

function node_anchorage_comments_initialize(lat,lng) {
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

$('#node_anchorage_comments_add').live("click",function(){
	if (drupalgap_user.uid == 0) {
		if (confirm("Du skal være logged på for at skrive kommentarer.")) {
			$.mobile.changePage("user_login.html");
		}
		else {
			return false;
		}
	}
	else {
		// Set the comment nid.
		drupalgap_page_comment_edit_nid = drupalgap_page_node_anchorage_nid;
		$.mobile.changePage("comment_edit.html");
	}
});