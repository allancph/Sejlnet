$('#sejlnet_group_posts').live('pagebeforeshow',function(){
	try {
	}
	catch (error) {
		alert("sejlnet_group_posts - pagebeforeshow " + error);
	}
});

$('#sejlnet_group_posts').live('pageshow',function(){
	try {
		
		// Set the group title.
		$('#sejlnet_group_posts h2').html(sejlnet_group_node.title);
		
		// Retrieve the group members and display them in a list.
		views_options = {
			"path":"sejlnet/group/posts/" + sejlnet_group_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				if (errorThrown) {
					alert(errorThrown);
				}
				else {
					alert(textStatus);
				}
				// Refresh the list.
				$("#sejlnet_group_posts_list").listview("destroy").listview();
			},
			"success":function(posts) {
				if ($(posts.nodes).length > 0) {
					$.each(posts.nodes,function(index,obj){
						title = obj.node.title;
						if (!title) {
							title = obj.node.titel;
						}
						html = "<a href='node_group_post.html' nid='" + obj.node.nid + "'>" + title + "</a>";
						$("#sejlnet_group_posts_list").append($("<li></li>",{"html":html}));
					});
				}
				else {
					html = "Sorry, there are no posts in this group.";
					$("#sejlnet_group_posts_list").append($("<li></li>",{"html":html}));
				}
				
				// Refresh the list.
				$("#sejlnet_group_posts_list").listview("destroy").listview();
			},
		};
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		alert("sejlnet_group_posts - pageshow " + error);
	}
});

$('#sejlnet_group_posts_list a').live("click",function(){
	node_group_post_nid = $(this).attr('nid');
});