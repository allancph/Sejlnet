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

$('#node_group_post_button_comment_edit').live("click",function(){
	
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
		drupalgap_page_comment_edit_nid = node_group_post_nid;
		$.mobile.changePage("comment_edit.html");
	}
	
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
			break;
		case "1": // comments closed
			$('#node_group_post_comments').show();
			$('#node_group_post_button_comment_edit').hide();
			break;
		case "Read / write": // comments open
		case "Læse/skrive":
		case "L\u00e6se/skrive":
		case "2":
			// @todo - check user's permissions for comments before showing buttons
			$('#node_group_post_comments').show();
			$('#node_group_post_button_comment_edit').show();
			break;
	}
	
	// If there are any comments, retrieve and display them.
	if (node_group_post.comment_count) {
		count = parseInt(node_group_post.comment_count);
		if (count > 0) {
			// Retrieve comments.
			comment_options = {
				"nid":node_group_post_nid,
				"error":function(jqXHR, textStatus, errorThrown) {
				},
				"success":function(results) {
					
					// If there are any comments, add each to the container, otherwise show an empty message.
					$.each(results.comments,function(index,obj){
						
						// Build comment html.
						html = drupalgap_services_comment_render(obj.comment);
						
						// Add comment html to comment container.
						$("#node_group_post_comments_list").append(html);
					});
				},
			}
			drupalgap_services_comment_node_comments.resource_call(comment_options);
		}
	}
}