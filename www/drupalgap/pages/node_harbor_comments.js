$('#node_harbor_comments').live('pagebeforeshow',function(){
	try {
		harbor = drupalgap_page_node_harbor;
		// Show the harbor title.
		$('#node_harbor_comments h2').html(harbor.title);
	}
	catch (error) {
		alert("node_harbor_comments - pagebeforeshow " + error);
	}
});

$('#node_harbor_comments').live('pageshow',function(){
	try {
		harbor = drupalgap_page_node_harbor;
		
		// Retrieve comments.
		comment_options = {
			"nid":drupalgap_page_node_harbor_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				console.log(JSON.stringify(errorThrown));
				console.log(JSON.stringify(textStatus));
			},
			"success":function(results) {
				
				// Show the 'add comment' button.
				$('#node_harbor_comments_add').show();
				
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
				$("#node_harbor_comments_list").append(html);
			},
		}
		drupalgap_services_comment_node_comments.resource_call(comment_options);
	}
	catch (error) {
		alert("node_harbor_comments - pageshow " + error);
	}
});

$('#node_harbor_comments_back').live("click",function(){
	node_harbor_go_back();
});

function node_harbor_comments_initialize(lat,lng) {
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

$('#node_harbor_comments_add').live("click",function(){
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
		drupalgap_page_comment_edit_nid = drupalgap_page_node_harbor_nid;
		$.mobile.changePage("comment_edit.html");
	}
});