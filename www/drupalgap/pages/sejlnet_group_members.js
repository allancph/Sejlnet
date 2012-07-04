$('#sejlnet_group_members').live('pagebeforeshow',function(){
	try {
	}
	catch (error) {
		alert("sejlnet_group_members - pagebeforeshow " + error);
	}
});

$('#sejlnet_group_members').live('pageshow',function(){
	try {
		
		// Set the group title.
		$('#sejlnet_group_members h2').html(sejlnet_group_node.title);
		
		// Retrieve the group members and display them in a list.
		views_options = {
			"path":"sejlnet/group/members/" + sejlnet_group_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				if (errorThrown) {
					alert(errorThrown);
				}
				else {
					alert(textStatus);
				}
				// Refresh the list.
				$("#sejlnet_group_members_list").listview("destroy").listview();
			},
			"success":function(members) {
				if ($(members.users).length > 0) {
					$.each(members.users,function(index,obj){
						html = "<a href='user.html' id='" + obj.user.uid + "'>" + obj.user.name + "</a>";
						$("#sejlnet_group_members_list").append($("<li></li>",{"html":html}));
					});
				}
				else {
					// No members.
					html = "Beklager, ingen medlemmer i denne gruppe.";
					$("#sejlnet_group_members_list").append($("<li></li>",{"html":html}));
				}
				
				// Refresh the list.
				$("#sejlnet_group_members_list").listview("destroy").listview();
			},
		};
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
	catch (error) {
		alert("sejlnet_group_members - pageshow " + error);
	}
});

$('#sejlnet_group_members_list a').live("click",function(){
	dg_page_user_back_button_destination = "sejlnet_group_members.html";
	drupalgap_page_user_uid = $(this).attr('id');
});