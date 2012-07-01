var node_group_image;
var node_group_image_nid; // other's set this nid so this page knows which node to load
var node_group_image_destination = "sejlnet_gallery.html";
$('#node_group_image').live('pagebeforeshow',function(){
	try {
		
		// Clear any previous node edit id reference.
		node_group_image_edit_nid = null;
		
		// Clear any previous node comment nid reference.
		drupalgap_page_comment_edit_nid = null;
		
		// Build service call options to load the node.
		views_options = {
			"path":"sejlnet/node/group_image/" + node_group_image_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert(node_group_image.errorThrown);
				alert("node_group_image - failed to load node (" + node_group_image_nid + ")");
			},
			"success":node_group_image_success,
		};
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		console.log("node_group_image");
		console.log(error);
	}
});

$('#node_group_image_button_comments').live("click",function(){
	// Set the comment nid.
	drupalgap_page_comments_nid = node_group_image_nid;
});

$('#node_group_image_button_comment_edit').live("click",function(){
	// Set the comment nid.
	drupalgap_page_comment_edit_nid = node_group_image_nid;
});

function node_group_image_success(json) {
	try {
		// Extract the node json from the views datasource.
		node_group_image = json.nodes[0].node;
		
		// Node title.
		title = "";
		if (node_group_image.title) {
			title = node_group_image.title;
		}
		else if (node_group_image.titel) {
			title = node_group_image.titel;
		}
		node_group_image.title = title;
		$('#node_group_image h1').html(title);
		
		// Show image.
		img = sejlnet_gallery_photo_list_item_render(node_group_image);
		$('#node_group_image .content').html(img);
		
		// Set comments and comment button visibility.
		switch (node_group_image.comment_status) {
			case "0": // comments hidden
				$('#node_group_image_comments').hide();
				$('#node_group_image_button_comment_edit').hide();
				$('#node_group_image_button_comments').hide();
				break;
			case "1": // comments closed
				$('#node_group_image_comments').show();
				$('#node_group_image_button_comment_edit').hide();
				$('#node_group_image_button_comments').show();
				break;
			case "Read / write": // comments open
			case "Læse/skrive":
			case "L\u00e6se/skrive":
				// @todo - check user's permissions for comments before showing buttons
				$('#node_group_image_comments').show();
				$('#node_group_image_button_comment_edit').show();
				$('#node_group_image_button_comments').show();
				break;
		}
		
		// If there are any comments, show the comment count on the view comments button.
		// Otherwise, hide the view comments button
		if (node_group_image.comment_count) {
			count = parseInt(node_group_image.comment_count);
			if (count > 0) {
				text = "View " + count + " Comments";
				if (count == 1) { text = "View " + count + " Comment" }
				$('#node_group_image_button_comments span').html(text);
			}
			else {
				$('#node_group_image_button_comments').hide();
			}
		}
		else {
			$('#node_group_image_button_comments').hide();
		}
		
		// As a last resort, check the user's access permissions for comments.
		// Check to make sure the user has permission view comments.
		if (!drupalgap_services_user_access({"permission":"access comments"})) {
			$('#node_group_image_button_comments').hide();
		}
		// Check to make sure the user has permission to post comments.
		if (!drupalgap_services_user_access({"permission":"post comments"})) {
			$('#node_group_image_button_comment_edit').hide();
		}
	}
	catch (error) {
		alert("node_group_image_success - " + error);
	}
}

$('#node_group_image_back_button').live("click",function(){
	$.mobile.changePage(node_group_image_destination);
});