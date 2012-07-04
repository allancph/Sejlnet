var sejlnet_gallery_page = 0;
var sejlnet_gallery_empty = false;

$('#sejlnet_gallery').live('pagebeforeshow',function(){
	try {
		// Append the page count to the title.
		page_display_number = sejlnet_gallery_page + 1;
		$('#sejlnet_gallery h2').append(" - Side " + page_display_number);
	}
	catch (error) {
		alert("sejlnet_gallery - pagebeforeshow - " + error);
	}
});

$('#sejlnet_gallery').live('pageshow',function(){
	try {
		// Retrieve the photos and display them.
		views_options = {
			"path":"sejlnet/gallery?page=" + sejlnet_gallery_page,
			"error":function(jqXHR, textStatus, errorThrown) {
				if (errorThrown) {
					alert(errorThrown);
				}
				else {
					alert(textStatus);
				}
			},
			"success":function(images) {
				// Render the images.
				html = "";
				if ($(images.nodes).length > 0) {
					$.each(images.nodes,function(index,obj){
						html += sejlnet_gallery_photo_list_item_render(obj.node);
					});
				}
				else {
					// No photos in gallery.
					html = "Beklager, der er ingen foto i denne gruppe.";
					sejlnet_gallery_empty = true;
				}
				$("#sejlnet_gallery_container").html(html);
				
				// Show the pager buttons.
				$('#sejlnet_gallery_prev').show();
				$('#sejlnet_gallery_next').show();
			},
		};
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		alert("sejlnet_gallery - pageshow - " + error);
	}
});

$("#sejlnet_image_add_button").live("click",function(){
	if (drupalgap_user.uid == 0) {
		if (confirm("Du skal være logget ind for at tilføje foto.")) {
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

$('#sejlnet_gallery_next').live("click",function(){
	try {
		// If the gallery is empty, don't go to the next page.
		if (sejlnet_gallery_empty) {
			return false;
		}
		if (sejlnet_gallery_page >= 0) {
			sejlnet_gallery_page++;
			$.mobile.changePage(
				"sejlnet_gallery.html",
				{allowSamePageTransition:true, reloadPage:true}
			);
		}
	}
	catch (error) {
		alert('sejlnet_gallery_next - ' + error);
	}
});

$('#sejlnet_gallery_prev').live("click",function(){
	try {
		// If we're not on the first page, then go back.
		if (sejlnet_gallery_page > 0) {
			sejlnet_gallery_page--;
			$.mobile.changePage(
				"sejlnet_gallery.html",
				{allowSamePageTransition:true, reloadPage:true}
			);
		}
	}
	catch (error) {
		alert('sejlnet_gallery_prev - ' + error);
	}
	return false;
});

