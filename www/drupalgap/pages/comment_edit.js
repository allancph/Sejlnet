var drupalgap_page_comment_edit_nid; // other's set this nid so this page knows which node to load
var drupalgap_page_comment_edit_content_type;
var drupalgap_page_comment_edit_cid; // other's set this cid so this page knows which comment to load (if any)
$('#drupalgap_page_comment_edit').live('pagebeforeshow',function(){
	try {
		
	}
	catch (error) {
		alert("drupalgap_page_comment_edit - pagebeforeshow - " + error);
	}
});

$('#drupalgap_page_comment_edit').live('pageshow',function(){
	try {
		// Load node.
		nid = drupalgap_page_comment_edit_nid;
		options = {
			"nid":nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert("drupalgap_page_comment_edit - failed to load node (" + nid + ")");
			},
			"success":function(drupalgap_page_comment_edit_node) {
				
				// Set the page nid in case it wasn't set.
				drupalgap_page_node_nid = nid;
				
				// Check the status of this node's comments.
				switch (drupalgap_page_comment_edit_node.comment) {
					case "0": // Comments hidden.
						alert("Kommentarer er gemt.");
						$.mobile.changePage("dashboard.html");
						return false;
						break;
					case "1": // Comments closed.
						alert("Kommentarer er lukket.");
						$.mobile.changePage("dashboard.html");
						return false;
						break;
					case "2": // Comments open.
						break;
				}
				
				// Clear and load this node's content type.
				drupalgap_page_comment_edit_content_type = null;
				drupalgap_page_comment_edit_content_type = drupalgap_services_content_type_load(drupalgap_page_comment_edit_node.type);
				
				// Set node title header text.
				$('#drupalgap_page_comment_edit h3').html(drupalgap_page_comment_edit_node.title);
				
				if (drupalgap_page_comment_edit_cid) {
					// Existing comment.
					
					// Load the comment.
					options = {
						"cid":drupalgap_page_comment_edit_cid,
						"error":function(jqXHR, textStatus, errorThrown) {
							alert("drupalgap_page_comment_edit - Kan ikke indlæse kommentarer! (" + drupalgap_page_comment_edit_cid + ")");
						},
						"success":function(comment) {
							// Set header text.
							$('#drupalgap_page_comment_edit h1').html("Rediger kommentar");
							
							// Comment body.
							var body;
							if (drupalgap_site_settings.variable.drupal_core == "6") {
								body = comment.comment;
							}
							else if (drupalgap_site_settings.variable.drupal_core == "7") {
								body = comment.comment_body.und[0].value;
							}
							$('#drupalgap_page_comment_edit_body').val(body);
							
							// If the user can administer the comment, show the delete button.
							if (drupalgap_services_user_access({"permission":"administer comments"})) {
								$('#drupalgap_page_comment_edit_delete').show();
							}
						},
					};
					drupalgap_services_comment_retrieve.resource_call(options);
				}
				else {
					// New comment.
					
					// Set header text.
					$('#drupalgap_page_comment_edit h1').html("Tilføj kommentar");
				}
			},
		};
		drupalgap_services_node_retrieve.resource_call(options);
	}
	catch (error) {
		console.log("drupalgap_page_comment_edit");
		console.log(error);
	}
});

$('#drupalgap_page_comment_edit_submit').live('click',function(){
	try {
		
		// Grab input.
	  	var body = $('#drupalgap_page_comment_edit_body').val();
	  	
	  	// Validate input.
	  	
	  	if (!body) {
	  		alert('Ingen kommentar indlæst.'); 
	  		return false; 
	  	}
	  	
	  	if (drupalgap_page_comment_edit_cid) {
			// Existing comment.
	  		
	  		// Retrieve the comment, update the values.
	  		options = {
	  			"cid":drupalgap_page_comment_edit_cid,
	  			"error":function(jqXHR, textStatus, errorThrown) {
	  				alert("drupalgap_page_comment_edit_submit - Kan ikke indlæse kommentarer (" + drupalgap_page_comment_edit_cid + ")");
		  		},
		  		"success":function(comment) {
		  			// Comment was retrieved, update its values.
				  	comment.body = body;
				  	comment_update_options = {
				  		"comment":comment,
				  		"error":function(jqXHR, textStatus, errorThrown) {
				  			alert(result.errorThrown);
					  	},
					  	"success":function(data) {
					  		// Comment was updated properly.
					  		drupalgap_page_comment_back();
					  	},
				  	};
				  	drupalgap_services_comment_update.resource_call(comment_update_options);
		  		},
	  		};
		  	drupalgap_services_comment_retrieve.resource_call(options);
		}
		else {
			// New comment.
			
			// Create the comment.
			options = {
				"comment":{
					"nid":drupalgap_page_comment_edit_nid,
					"body":body,
				},
				"error":function(jqXHR, textStatus, errorThrown) {
					alert(errorThrown);
				},
				"success":function(comment_create_result) {
					navigator.notification.alert(
					    'Kommentar postet!',  // message
					    function() {
					    	// If this was an image comment, clear out the local storage dependencies.
							switch (drupalgap_page_comment_edit_content_type.type) {
								case "user_image":
								case "group_image":
									// The image node.
									sejlnet_local_storage_key = 
										"get.sejlnet/node/" + drupalgap_page_comment_edit_content_type.type + 
										"/" + drupalgap_page_comment_edit_nid;
									window.localStorage.removeItem(sejlnet_local_storage_key);
									
									// The group's photos.
									if (sejlnet_group_nid) {
										sejlnet_local_storage_key = "get.sejlnet/group/photos/" + sejlnet_group_nid + "?page=0";
										window.localStorage.removeItem(sejlnet_local_storage_key);
									}
									else {
										// Gallery photos.
										window.localStorage.removeItem("get.sejlnet/gallery?page=0");
									}
									break;
								case "harbour":
									sejlnet_local_storage_key = "get.views_datasource/drupalgap_comments/" + drupalgap_page_node_harbor_nid + "?page=0";
									window.localStorage.removeItem(sejlnet_local_storage_key);
									break;
							}
							drupalgap_page_comment_back();
					    },
					    'Kommentar',
					    'OK'
					);
				},
			};
			drupalgap_services_comment_create.resource_call(options);
		}
	}
	catch (error) {
		console.log("drupalgap_page_comment_edit_submit");
		console.log(error);
	}
	
	return false;
});

// cancel button clicked...
$('#drupalgap_page_comment_edit_cancel').live('click',function(){
	try {
		drupalgap_page_comment_back();
	}
	catch (error) {
		console.log("drupalgap_page_comment_edit_cancel");
		console.log(error);
	}
	return false;
});

$('#drupalgap_page_comment_edit_delete').live('click',function(){
	try {
		options = {
			"cid":drupalgap_page_comment_edit_cid,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert("drupalgap_page_comment_edit_delete - failed to comment (" + drupalgap_page_comment_edit_cid + ")");
			},
			"success":function(comment) {
				if (confirm("Are you sure you want to delete this comment? This cannot be undone.")) {
					comment_delete_options = {
						"cid":comment.cid,
						"error":function(jqXHR, textStatus, errorThrown) {
							alert(result.errorThrown);
						},
						"success":function(data) {
							drupalgap_page_comment_back();
						},
					};
					drupalgap_services_comment_delete.resource_call(comment_delete_options);
				}
			},
		};
		drupalgap_services_comment_retrieve.resource_call(options);
	}
	catch (error) {
		console.log("drupalgap_page_comment_edit_delete");
		console.log(error);
	}
	return false;
});

function drupalgap_page_comment_back() {
	var page = "node.html";
	switch (drupalgap_page_comment_edit_content_type.type) {
		case "group_image":
			page = "sejlnet_image.html";
			break;
		case "group_post":
			page = "node_group_post.html";
			break;
		case "user_image":
			page = "sejlnet_image.html";
			break;
		case "harbour":
			page = "node_harbor_comments.html";
			break;
		case "anchorage":
			page = "node_anchorage_comments.html";
			break;
	}
	$.mobile.changePage(page);
}