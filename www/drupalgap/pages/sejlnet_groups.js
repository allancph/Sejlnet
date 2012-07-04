$('#sejlnet_groups').live('pagebeforeshow',function(){
	try {
		// Clear the list.
		$("#sejlnet_groups_list").html("");
	}
	catch (error) {
		alert("sejlnet_groups - pagebeforeshow - " + error);
	}
});

$('#sejlnet_groups').live('pageshow',function(){
	try {
		// Build content retrieve resource call options.
		views_options = {
			"path":"views_datasource/sejlnet/groups",
			"error":function(jqXHR, textStatus, errorThrown) {
				if (errorThrown) {
					alert(errorThrown);
				}
				else {
					alert(textStatus);
				}
				// Refresh the list.
				$("#sejlnet_groups_list").listview("destroy").listview();
			},
			"success":function(content) {
				if ($(content.groups).length > 0) {
					$.each(content.groups,function(index,obj){
						title = obj.group.title;
						if (title == null) {
							title = obj.group.titel; // the live site uses 'titel' for the field name
						}
						html = "<a href='sejlnet_group.html' id='" + obj.group.nid + "'>(" + obj.group.member_count + ") " + title + "</a>";
						$("#sejlnet_groups_list").append($("<li></li>",{"html":html}));
					});
				}
				else {
					html = "Sorry, there are no published groups.";
					$("#sejlnet_groups_list").append($("<li></li>",{"html":html}));
				}
				
				// Refresh the list.
				$("#sejlnet_groups_list").listview("destroy").listview();
			},
		};
		// Make the service call to retrieve content.
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		alert("sejlnet_groups - pageshow - " + error);
	}
});

// When a content list item is clicked...
$('#sejlnet_groups_list a').live("click",function(){
	// Set the group node id.
	sejlnet_group_nid = $(this).attr('id');
	// Clear out group paging variables.
	sejlnet_group_posts_page = 0;
	sejlnet_group_photos_page = 0;
});