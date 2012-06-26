$('#sejlnet_gallery').live('pagebeforeshow',function(){
	try {
	}
	catch (error) {
		alert("sejlnet_gallery - pagebeforeshow - " + error);
	}
});

$('#sejlnet_gallery').live('pageshow',function(){
	try {
		// Retrieve the photos and display them.
		views_options = {
			"path":"sejlnet/gallery",
			"load_from_local_storage":false,
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
						console.log(JSON.stringify(obj));
						// Extract the image source. Since we are dealing with
						// two different content types, and two different image
						// fields, check both fields for an image source.
						img_src = "";
						if (obj.node.sailing_image) {
							img_src = obj.node.sailing_image;
						}
						else if (obj.node.group_image) {
							img_src = obj.node.group_image;
						}
						if (img_src != "") {
							// Extract the title.
							title = obj.node.title;
							if (!title) {
								title = obj.node.titel;
							}
							// Build comment count, if there is any.
							comments = "";
							if (obj.node.comment_count && obj.node.comment_count > 0) {
								comments = " | " + obj.node.comment_count;
								if (obj.node.comment_count == 1) {
									comments += " comment";
								}
								else {
									comments += " comments";
								}
							}
							// Build link to image node.
							link = "";
							switch (obj.node.type) {
								// (Group Image)
								case "group_image":
									link = "node_group_image.html";
									break;
								// (Sailing Image)
								case "user_image":
									link = "node_user_image.html";
									break;
							}
							
							// Render picture.
							html += "<p style='text-align: center;'>" + 
							"<strong>" + title + "</strong><br />" +
							obj.node.created + comments + 
							"<a href='" + link + "' class='sejlnet_gallery_item' nid='" + obj.node.nid + "'><img src='" + img_src + "' /></a>" +
							"</p><hr />";
						}
					});
				}
				else {
					html = "Sorry, there are photos in the gallery.";
				}
				$("#sejlnet_gallery_container").html(html);
			},
		};
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		alert("sejlnet_gallery - pageshow - " + error);
	}
});

$(".sejlnet_gallery_item").live("click",function(){
	node_group_image_nid = $(this).attr('nid');
	node_user_image_nid = $(this).attr('nid');
});