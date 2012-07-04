$('#sejlnet_harbor_guide').live('pagebeforeshow',function(){
	try {
		// Clear the list.
		$("#sejlnet_harbor_guide_content_list").html("");
	}
	catch (error) {
		alert("sejlnet_harbor_guide - pagebeforeshow - " + error);
	}
});

$('#sejlnet_harbor_guide').live('pageshow',function(){
	try {
		// Build content retrieve resource call options.
		views_options = {
			"path":"views_datasource/harbor_guide",
			"error":function(jqXHR, textStatus, errorThrown) {
				if (errorThrown) {
					alert(errorThrown);
				}
				else {
					alert(textStatus);
				}
				// Refresh the list.
				$("#sejlnet_harbor_guide_content_list").listview("destroy").listview();
			},
			"success":function(content) {
				// If there is any content, add each to the list, otherwise show an
				// empty message.
				if ($(content.nodes).length > 0) {
					$.each(content.nodes,function(index,obj){
						title = obj.node.title;
						if (title == null) {
							title = obj.node.titel; // the live site uses 'titel' for the field name
						}
						html = "<a href='node_harbor.html' id='" + obj.node.nid + "'>" + title + "</a>";
						$("#sejlnet_harbor_guide_content_list").append($("<li></li>",{"html":html}));
					});
				}
				else {
					// No harbors.
					html = "Beklager, der er ingen havne.";
					$("#sejlnet_harbor_guide_content_list").append($("<li></li>",{"html":html}));
				}
				
				// Refresh the list.
				$("#sejlnet_harbor_guide_content_list").listview("destroy").listview();
			},
		};
		// Make the service call to retrieve content.
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		alert("sejlnet_harbor_guide - pageshow - " + error);
	}
});

// When a content list item is clicked...
$('#sejlnet_harbor_guide_content_list a').live("click",function(){
	// Save a reference to the node id.
	drupalgap_page_node_harbor_nid = $(this).attr('id');
	drupalgap_page_node_harbor_back = "all";
});