var sejlnet_group_node;
var sejlnet_group_nid;

$('#sejlnet_group').live('pagebeforeshow',function(){
	try {
	}
	catch (error) {
		alert("sejlnet_group - pagebeforeshow " + error);
	}
});

$('#sejlnet_group').live('pageshow',function(){
	try {
		// Load node via services call and then display it.
		options = {
			"path":"sejlnet/node/group/" + sejlnet_group_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
			},
			"success":function(group){
				
				if (group.nodes.length == 0) {
					alert("Failed to load group! (" + sejlnet_group_nid + ")");
					return false;
				}
				
				// Extract harbor node from JSON.
				group = group.nodes[0].node;
				sejlnet_group_node = group;
				
				// Populate template place holders...
				
				// Title.
				title = group.title;
				if (title == null) {
					title = group.titel; // the live site uses 'titel' for the field name
				}
				group.title = title;
				$('#sejlnet_group h2').html(group.title);
				
				// Body and Image.
				body = "";
				if (group.body) {
					body = "<p>" + group.body + "</p>";
				}
				else if (group.indhold) { // the live site defaults to 'indhold' for body
					body = "<p>" + group.indhold + "</p>";
				}
				if (group.image || group.billede) {
					img_src = drupalgap_settings.site_path + drupalgap_settings.base_path;
					if (group.image) {
						img_src += group.image;
					}
					else if (group.billede) { // the live site defaults to 'billede' for image
						img_src += group.billede;
					}
					body = "<p style='text-align: center;'><img src='" + img_src + "'/></p>" + body;
				}
				$('#sejlnet_group_body').html(body);
			},
		};
		drupalgap_views_datasource_retrieve.resource_call(options);
	}
	catch (error) {
		alert("drupalgap_page_node_harbor - pageshow " + error);
	}
});

$('#drupalgap_page_node_harbor_back').live("click",function(){
	switch (drupalgap_page_node_harbor_back) {
		case "nearby":
			$.mobile.changePage("sejlnet_harbor_guide_nearby.html");
			break;
		case "all":
			$.mobile.changePage("sejlnet_harbor_guide.html");
			break;
		default:
			$.mobile.changePage("sejlnet_harbor_guide.html");
			break;
	}
});