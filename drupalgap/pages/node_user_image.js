var node_user_image;
var node_user_image_nid; // other's set this nid so this page knows which node to load
$('#node_user_image').live('pagebeforeshow',function(){
	try {
		
		// Clear any previous node edit id reference.
		node_user_image_edit_nid = null;
		
		// Clear any previous node comment nid reference.
		drupalgap_page_comment_edit_nid = null;
		
		// Build service call options to load the node.
		views_options = {
			"path":"sejlnet/node/user_image/" + node_user_image_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert(node_user_image.errorThrown);
				alert("node_user_image - failed to load node (" + node_user_image_nid + ")");
			},
			"success":node_user_image_success,
		};
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		console.log("node_user_image");
		console.log(error);
	}
});

$('#node_user_image_button_comments').live("click",function(){
	// Set the comment nid.
	drupalgap_page_comments_nid = node_user_image_nid;
});

$('#node_user_image_button_comment_edit').live("click",function(){
	// Set the comment nid.
	drupalgap_page_comment_edit_nid = node_user_image_nid;
});

function node_user_image_success(json) {
	
	// Extract the node json from the views datasource.
	node_user_image = json.nodes[0].node;
	
	// Node title.
	title = "";
	if (node_user_image.title) {
		title = node_user_image.title;
	}
	else if (node_user_image.titel) {
		title = node_user_image.titel;
	}
	node_user_image.title = title;
	$('#node_user_image h1').html(title);
	
	// Show image.
	img = sejlnet_gallery_photo_list_item_render(node_user_image);
	$('#node_user_image .content').html(img);
	
	// Set comments and comment button visibility.
	switch (node_user_image.comment_status) {
		case "0": // comments hidden
			$('#node_user_image_comments').hide();
			$('#node_user_image_button_comment_edit').hide();
			$('#node_user_image_button_comments').hide();
			break;
		case "1": // comments closed
			$('#node_user_image_comments').show();
			$('#node_user_image_button_comment_edit').hide();
			$('#node_user_image_button_comments').show();
			break;
		case "Read / write": // comments open
		case "Læse/skrive":
		case "L\u00e6se/skrive":
			// @todo - check user's permissions for comments before showing buttons
			$('#node_user_image_comments').show();
			$('#node_user_image_button_comment_edit').show();
			$('#node_user_image_button_comments').show();
			break;
	}
	
	// If there are any comments, show the comment count on the view comments button.
	// Otherwise, hide the view comments button
	if (node_user_image.comment_count) {
		count = parseInt(node_user_image.comment_count);
		if (count > 0) {
			text = "View " + count + " Comments";
			if (count == 1) { text = "View " + count + " Comment" }
			$('#node_user_image_button_comments span').html(text);
		}
		else {
			$('#node_user_image_button_comments').hide();
		}
	}
	else {
		$('#node_user_image_button_comments').hide();
	}
	
	// As a last resort, check the user's access permissions for comments.
	// Check to make sure the user has permission view comments.
	if (!drupalgap_services_user_access({"permission":"access comments"})) {
		$('#node_user_image_button_comments').hide();
	}
	// Check to make sure the user has permission to post comments.
	if (!drupalgap_services_user_access({"permission":"post comments"})) {
		$('#node_user_image_button_comment_edit').hide();
	}
}