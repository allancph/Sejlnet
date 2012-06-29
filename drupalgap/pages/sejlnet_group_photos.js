$('#sejlnet_group_photos').live('pagebeforeshow',function(){
	try {
	}
	catch (error) {
		alert("sejlnet_group_photos - pagebeforeshow " + error);
	}
});

$('#sejlnet_group_photos').live('pageshow',function(){
	try {
		// Set the group title.
		$('#sejlnet_group_photos h2').html(sejlnet_group_node.title);
		
		// Retrieve the group photos and display them.
		views_options = {
			"path":"sejlnet/group/photos/" + sejlnet_group_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				if (errorThrown) {
					alert(errorThrown);
				}
				else {
					alert(textStatus);
				}
			},
			"success":function(images) {
				html = "";
				if ($(images.nodes).length > 0) {
					$.each(images.nodes,function(index,obj){
						html += sejlnet_gallery_photo_list_item_render(obj.node);
					});
				}
				else {
					html = "Sorry, there are no photos for this group.";
				}
				$("#sejlnet_group_photos_container").html(html);
			},
		};
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		alert("sejlnet_group_photos - pageshow " + error);
	}
});

$('#sejlnet_group_photos_add_button').live("click", function(){
	if (drupalgap_user.uid == 0) {
		if (confirm("You must be logged in to add a photo.")) {
			$.mobile.changePage("user_login.html");
		}
		else {
			return false;
		}
	}
	else {
		$.mobile.changePage("sejlnet_group_photos_add.html");
	}
});