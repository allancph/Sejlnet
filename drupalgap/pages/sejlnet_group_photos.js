$('#sejlnet_group_photos').live('pagebeforeshow',function(){
	try {
	}
	catch (error) {
		alert("sejlnet_group_photos - pagebeforeshow " + error);
	}
});

$('#sejlnet_group_photos').live('pageshow',function(){
	try {
		// Set the group title.
		$('#sejlnet_group_photos h2').html(sejlnet_group_node.title);
		
		// Retrieve the group photos and display them.
		views_options = {
			"path":"sejlnet/group/photos/" + sejlnet_group_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				if (errorThrown) {
					alert(errorThrown);
				}
				else {
					alert(textStatus);
				}
			},
			"success":function(images) {
				html = "";
				if ($(images.nodes).length > 0) {
					$.each(images.nodes,function(index,obj){
						if (obj.node.image || obj.node.billede) {
							img_src = drupalgap_settings.site_path + drupalgap_settings.base_path;
							if (obj.node.image) {
								img_src += obj.node.image;
							}
							else if (obj.node.billede) { // the live site defaults to 'billede' for image
								img_src += obj.node.billede;
							}
							html += "<p style='text-align: center;'><img src='" + img_src + "'/></p>";
						}
					});
				}
				else {
					html = "Sorry, there are no photos for this group.";
				}
				$("#sejlnet_group_photos_container").html(html);
			},
		};
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		alert("sejlnet_group_photos - pageshow " + error);
	}
});