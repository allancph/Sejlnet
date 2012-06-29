$('#sejlnet_gallery').live('pagebeforeshow',function(){
	try {
	}
	catch (error) {
		alert("sejlnet_gallery - pagebeforeshow - " + error);
	}
});

$('#sejlnet_gallery').live('pageshow',function(){
	try {
		// Retrieve the photos and display them.
		views_options = {
			"path":"sejlnet/gallery",
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
					html = "Sorry, there are photos in the gallery.";
				}
				$("#sejlnet_gallery_container").html(html);
			},
		};
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		alert("sejlnet_gallery - pageshow - " + error);
	}
});

$("#sejlnet_gallery_photo_add_button").live("click",function(){
	if (drupalgap_user.uid == 0) {
		if (confirm("You must be logged in to add a photo.")) {
			$.mobile.changePage("user_login.html");
		}
		else {
			return false;
		}
	}
	else {
		$.mobile.changePage("sejlnet_gallery_photo_add.html");
	}
});
