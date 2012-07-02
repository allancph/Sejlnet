var sejlnet_image; // once the node is retrieved, this variable is set automatically so
// others can use it.
var sejlnet_image_nid; // other's set this nid so this page knows which node to load
var sejlnet_image_type;
var sejlnet_image_destination = "sejlnet_gallery.html";
$('#sejlnet_image').live('pagebeforeshow',function(){
	try {
		
		// Clear any previous node edit id reference.
		sejlnet_image_edit_nid = null;
		
		// Clear any previous node comment nid reference.
		drupalgap_page_comment_edit_nid = null;
	}
	catch (error) {
		alert("sejlnet_image - pagebeforeshow - " + error);
	}
});

$('#sejlnet_image').live('pageshow',function(){
	try {
		
		// Build service call options to load the node.
		views_options = {
			"path":"sejlnet/node/" + sejlnet_image_type + "/" + sejlnet_image_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert(sejlnet_image.errorThrown);
				alert("sejlnet_image - failed to load node (" + sejlnet_image_nid + ")");
			},
			"success":sejlnet_image_success,
		};
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		alert("sejlnet_image - pageshow - " + error);
	}
});

$('#sejlnet_image_button_comment_edit').live("click",function(){
	
	if (drupalgap_user.uid == 0) {
		if (confirm("You must be logged in to add a comment.")) {
			$.mobile.changePage("user_login.html");
		}
		else {
			return false;
		}
	}
	else {
		// Set the comment nid.
		drupalgap_page_comment_edit_nid = sejlnet_image_nid;
		$.mobile.changePage("comment_edit.html");
	}
	
});

function sejlnet_image_success(json) {
	try {
		// Extract the node json from the views datasource.
		sejlnet_image = json.nodes[0].node;
		
		// Node title.
		title = "";
		if (sejlnet_image.title) {
			title = sejlnet_image.title;
		}
		else if (sejlnet_image.titel) {
			title = sejlnet_image.titel;
		}
		sejlnet_image.title = title;
		$('#sejlnet_image h1').html(title);
		
		// Show image.
		img = sejlnet_gallery_photo_list_item_render(sejlnet_image);
		$('#sejlnet_image .content').html(img);
		
		// Image location.
		// Show the harbor google map.
		if (sejlnet_image.latitude && sejlnet_image.longitude) {
			$('#sejlnet_image_map').show();
			sejlnet_image_map_initialize(sejlnet_image.latitude, sejlnet_image.longitude);
		}
		else {
			$('#sejlnet_image_map_wrapper span').html("N/A");
		}
		
		// Set comments and comment button visibility.
		switch (sejlnet_image.comment_status) {
			case "0": // comments hidden
				$('#sejlnet_image_comments').hide();
				$('#sejlnet_image_button_comment_edit').hide();
				break;
			case "1": // comments closed
				$('#sejlnet_image_comments').show();
				$('#sejlnet_image_button_comment_edit').hide();
				break;
			case "Read / write": // comments open
			case "Læse/skrive":
			case "L\u00e6se/skrive":
				// @todo - check user's permissions for comments before showing buttons
				$('#sejlnet_image_comments').show();
				$('#sejlnet_image_button_comment_edit').show();
				break;
		}
		
		// If there are any comments, retrieve and display them.
		if (sejlnet_image.comment_count) {
			count = parseInt(sejlnet_image.comment_count);
			if (count > 0) {
				// Retrieve comments.
				comment_options = {
					"nid":sejlnet_image_nid,
					"error":function(jqXHR, textStatus, errorThrown) {
					},
					"success":function(results) {
						
						// If there are any comments, add each to the container, otherwise show an empty message.
						$.each(results.comments,function(index,obj){
							
							// Build comment html.
							html = drupalgap_services_comment_render(obj.comment);
							
							// Add comment html to comment container.
							$("#sejlnet_image_comments_list").append(html);
						});
					},
				}
				drupalgap_services_comment_node_comments.resource_call(comment_options);
			}
		}
	}
	catch (error) {
		alert("sejlnet_image_success - " + error);
	}
}

$('#sejlnet_image_back').live("click",function(){
	$.mobile.changePage(sejlnet_image_destination);
});

//This function renders photo list items generated from the json
//data returned by the following views:
//		drupalgap_sejlnet_gallery
//		drupalgap_sejlnet_group_photos
//The views labels need to be consistent so this function can
//handle multiple views.
function sejlnet_gallery_photo_list_item_render(node) {
	//console.log(JSON.stringify(node));
	// Extract the image source. Since we are dealing with
	// two different content types, and two different image
	// fields, check both fields for an image source. And
	// watch out for the auto danish translation on field names.
	img_src = "";
	if (node.sailing_image) {
		img_src = node.sailing_image;
	}
	else if (node.group_image) {
		img_src = node.group_image;
	}
	else if (node.image) {
		img_src = node.image;
	}
	else if (node.billede) {
		img_src = node.billede;
	}
	
	if (img_src != "") {
		
		// Extract the title.
		title = node.title;
		if (!title) {
			title = node.titel;
		}
		
		// Build link to author.
		author = "";
		if (node.name && node.uid) {
			author_link = "<a href='#' uid='" + node.uid + "' class='sejlnet_photo_author'>" + node.name + "</a>";
			author = "Posted by: " + author_link + "<br />"; 
		}
		
		// Build comment count.
		comments = " | ";
		if (node.comment_count && node.comment_count > 0) {
			comments += node.comment_count;
			if (node.comment_count == 1) {
				comments += " Comment";
			}
			else {
				comments += " Comments";
			}
			
		}
		else {
			comments += "0 Comments";
		}
		comments += "<br />";
		
		// Build link to image node. If a full size image path was provided in the
		// JSON use it, otherwise link to the app node type page.
		link = "";
		if (node.image_full_size) {
			link = node.image_full_size;
		}
		else {
			link = "sejlnet_image.html";
		}
		link_attributes = "class='sejlnet_photo_item' nid='" + node.nid + "' node_type='" + node.type + "'";
		
		// Render picture.
		return "<p style='text-align: center;'>" + 
		"<strong>" + title + "</strong><br />" +
		author + node.created + comments +
		"<a href='" + link + "' " + link_attributes + "><img src='" + img_src + "' /></a>" +
		"</p><hr />";
	}
}

$('.sejlnet_photo_author').live("click",function(){
	// Extract the user id.
	drupalgap_page_user_uid = $(this).attr('uid');
	
	// Set the user page back button based on what page we are currently on.
	current_page = $.mobile.activePage.data('url');
	if (current_page.indexOf("sejlnet_group_photos.html") != -1) {
		dg_page_user_back_button_destination = "sejlnet_group_photos.html";
	}
	else if (current_page.indexOf("sejlnet_gallery.html") != -1) {
		dg_page_user_back_button_destination = "sejlnet_gallery.html";
	}
	
	// Go to the user page.
	$.mobile.changePage("user.html");
});

$(".sejlnet_photo_item").live("click",function(){
	
	sejlnet_image_nid = $(this).attr('nid');
	sejlnet_image_type = $(this).attr('node_type');
	
	// Set the image page back button based on what page we are currently on.
	current_page = $.mobile.activePage.data('url');
	if (current_page.indexOf("sejlnet_group_photos.html") != -1) {
		sejlnet_image_destination = "sejlnet_group_photos.html";
	}
	else if (current_page.indexOf("sejlnet_gallery.html") != -1) {
		sejlnet_image_destination = "sejlnet_gallery.html";
	}

});

function sejlnet_image_map_initialize(lat,lng) {
	var myOptions = {
		zoom: 8,
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("sejlnet_image_map"),myOptions);
    
    var myLatLng = new google.maps.LatLng(lat, lng);
    var myMarkerOptions = {
      position: myLatLng,
      map: map
    }
    var marker = new google.maps.Marker(myMarkerOptions);
}