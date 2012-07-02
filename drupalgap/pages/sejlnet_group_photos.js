var sejlnet_group_photos_page = 0;
var sejlnet_group_photos_empty = false;

$('#sejlnet_group_photos').live('pagebeforeshow',function(){
	try {
		
		// Set the group title.
		$('#sejlnet_group_photos h1').html(sejlnet_group_node.title);
		
		// Append the page count to the title.
		page_display_number = sejlnet_group_photos_page + 1;
		$('#sejlnet_group_photos h2').append("Page " + page_display_number);
	}
	catch (error) {
		alert("sejlnet_group_photos - pagebeforeshow " + error);
	}
});

$('#sejlnet_group_photos').live('pageshow',function(){
	try {
		
		
		// Retrieve the group photos and display them.
		views_options = {
			"path":"sejlnet/group/photos/" + sejlnet_group_nid +"?page=" + sejlnet_group_photos_page,
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
					sejlnet_group_photos_empty = true;
				}
				$("#sejlnet_group_photos_container").html(html);
				
				// Show the pager buttons.
				$('#sejlnet_group_photos_prev').show();
				$('#sejlnet_group_photos_next').show();
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
		$.mobile.changePage("sejlnet_image_add.html");
	}
});

$('#sejlnet_group_photos_next').live("click",function(){
	try {
		// If the gallery is empty, don't go to the next page.
		if (sejlnet_group_photos_empty) {
			return false;
		}
		if (sejlnet_group_photos_page >= 0) {
			sejlnet_group_photos_page++;
			$.mobile.changePage(
				"sejlnet_group_photos.html",
				{allowSamePageTransition:true, reloadPage:true}
			);
		}
	}
	catch (error) {
		alert('sejlnet_group_photos_next - ' + error);
	}
});

$('#sejlnet_group_photos_prev').live("click",function(){
	try {
		// If we're not on the first page, then go back.
		if (sejlnet_group_photos_page > 0) {
			sejlnet_group_photos_page--;
			$.mobile.changePage(
				"sejlnet_group_photos.html",
				{allowSamePageTransition:true, reloadPage:true}
			);
		}
	}
	catch (error) {
		alert('sejlnet_group_photos_prev - ' + error);
	}
	return false;
});