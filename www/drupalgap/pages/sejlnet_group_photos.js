var sejlnet_group_photos_page = 0;
var sejlnet_group_photos_empty = false;

$('#sejlnet_group_photos').live('pagebeforeshow',function(){
	try {
		
		// Set the group title.
		$('#sejlnet_group_photos h1').html(sejlnet_group_node.title);
		
		// Append the page count to the title.
		page_display_number = sejlnet_group_photos_page + 1;
		$('#sejlnet_group_photos h2').append("Side " + page_display_number);
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
				console.log(JSON.stringify(errorThrown));
				console.log(JSON.stringify(textStatus));
			},
			"success":function(images) {
				html = "";
				if ($(images.nodes).length > 0) {
					$.each(images.nodes,function(index,obj){
						html += sejlnet_gallery_photo_list_item_render(obj.node);
					});
				}
				else {
					// No photos for group.
					html = "Beklager, der er ingen foto i denne gruppe.";
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
		if (confirm("Du skal være logget ind for at tilføje foto.")) {
			$.mobile.changePage("user_login.html");
		}
		else {
			return false;
		}
	}
	else {
		// Make sure the user is a member of the group.
		views_options = {
			"path":"sejlnet/group/members/" + sejlnet_group_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				if (errorThrown) {
					alert(errorThrown);
				}
				else {
					alert(textStatus);
				}
			},
			"success":function(members) {
				is_a_member = false;
				if ($(members.users).length > 0) {
					$.each(members.users,function(index,obj){
						if (obj.user.uid == drupalgap_user.uid) {
							is_a_member = true;
							return false;
						}
					});
				}
				if (is_a_member) {
					// They are a member, send them to the image add page.
					$.mobile.changePage("sejlnet_image_add.html");
				}
				else {
					// Tell the user they are not a member of this group.
					navigator.notification.alert(
					    'Du skal være medlem af denne gruppe for at kunne tilføje et billede. Bliv medlem af gruppen ved at besøge sejlnet.dk',
					    function(){},
					    'Du er ikke medlem',
					    'OK'
					);
				}
			},
		};
		drupalgap_views_datasource_retrieve.resource_call(views_options);
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