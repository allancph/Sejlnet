var node_group_post;
var node_group_post_nid; // other's set this nid so this page knows which node to load
$('#node_group_post').live('pagebeforeshow',function(){
	try {
		
		// Clear any previous node edit id reference.
		node_group_post_edit_nid = null;
		
		// Clear any previous node comment nid reference.
		drupalgap_page_comment_edit_nid = null;
		
		// Build service call options to load the node.
		options = {
			"nid":node_group_post_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert(node_group_post.errorThrown);
				alert("node_group_post - failed to load node (" + node_group_post_nid + ")");
			},
			"success":node_group_post_success,
		};
		
		// Load node via services call.
		drupalgap_services_node_retrieve.resource_call(options);
	}
	catch (error) {
		console.log("node_group_post");
		console.log(error);
	}
});

$('#node_group_post_button_comments').live("click",function(){
	// Set the comment nid.
	drupalgap_page_comments_nid = node_group_post_nid;
});

$('#node_group_post_button_comment_edit').live("click",function(){
	// Set the comment nid.
	drupalgap_page_comment_edit_nid = node_group_post_nid;
});

function node_group_post_success(node_group_post) {
	
	// Node title.
	$('#node_group_post h1').html(node_group_post.title);
	
	// Show body.
	$('#node_group_post .content').html(node_group_post.body);
	
	// Set comments and comment button visibility.
	switch (node_group_post.comment) {
		case "0": // comments hidden
			$('#node_group_post_comments').hide();
			$('#node_group_post_button_comment_edit').hide();
			$('#node_group_post_button_comments').hide();
			break;
		case "1": // comments closed
			$('#node_group_post_comments').show();
			$('#node_group_post_button_comment_edit').hide();
			$('#node_group_post_button_comments').show();
			break;
		case "2": // comments open
			// @todo - check user's permissions for comments before showing buttons
			$('#node_group_post_comments').show();
			$('#node_group_post_button_comment_edit').show();
			$('#node_group_post_button_comments').show();
			break;
	}
	
	// If there are any comments, show the comment count on the view comments button.
	// Otherwise, hide the view comments button
	if (node_group_post.comment_count) {
		count = parseInt(node_group_post.comment_count);
		if (count > 0) {
			text = "View " + count + " Comments";
			if (count == 1) { text = "View " + count + " Comment" }
			$('#node_group_post_button_comments span').html(text);
		}
		else {
			$('#node_group_post_button_comments').hide();
		}
	}
	else {
		$('#node_group_post_button_comments').hide();
	}
	
	// As a last resort, check the user's access permissions for comments.
	// Check to make sure the user has permission view comments.
	if (!drupalgap_services_user_access({"permission":"access comments"})) {
		$('#node_group_post_button_comments').hide();
	}
	// Check to make sure the user has permission to post comments.
	if (!drupalgap_services_user_access({"permission":"post comments"})) {
		$('#node_group_post_button_comment_edit').hide();
	}
}