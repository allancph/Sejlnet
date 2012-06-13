$('#sejlent_harbor_guide').live('pageshow',function(){
	try {
		
		// Clear the list.
		$("#sejlent_harbor_guide_content_list").html("");
		
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
				$("#sejlent_harbor_guide_content_list").listview("destroy").listview();
			},
			"success":function(content) {
				// If there is any content, add each to the list, otherwise show an
				// empty message.
				if ($(content.nodes).length > 0) {
					$.each(content.nodes,function(index,obj){
						// sejlnet - we must access Nid and 'titel' because views won't let us
						// change the var name.
						html = "<a href='node.html' id='" + obj.node.Nid + "'>" + obj.node.titel + "</a>";
						$("#sejlent_harbor_guide_content_list").append($("<li></li>",{"html":html}));
					});
				}
				else {
					html = "Sorry, there are no published harbors.";
					$("#sejlent_harbor_guide_content_list").append($("<li></li>",{"html":html}));
				}
				
				// Refresh the list.
				$("#sejlent_harbor_guide_content_list").listview("destroy").listview();
			},
		};
		// Make the service call to retrieve content.
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		console.log("sejlent_harbor_guide");
		console.log(error);
	}
});

// When a content list item is clicked...
$('#sejlent_harbor_guide_content_list a').live("click",function(){
	// Save a reference to the node id.
	drupalgap_page_node_nid = $(this).attr('id');
});