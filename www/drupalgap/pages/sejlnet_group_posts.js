var sejlnet_group_posts_page = 0;
var sejlnet_group_posts_empty = false;

$('#sejlnet_group_posts').live('pagebeforeshow',function(){
	try {
		// Set the group title.
		$('#sejlnet_group_posts h1').html(sejlnet_group_node.title);
		// Append the page count to the title.
		page_display_number = sejlnet_group_posts_page + 1;
		$('#sejlnet_group_posts h2').append("Side " + page_display_number);
	}
	catch (error) {
		alert("sejlnet_group_posts - pagebeforeshow " + error);
	}
});

$('#sejlnet_group_posts').live('pageshow',function(){
	try {
		
		// Retrieve the group members and display them in a list.
		views_options = {
			"path":"sejlnet/group/posts/" + sejlnet_group_nid + "?page=" + sejlnet_group_posts_page,
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
					sejlnet_group_posts_empty = true;
					// No posts in group.
					html = "Beklager, der er ingen indlæg i denne gruppe.";
					$("#sejlnet_group_posts_list").append($("<li></li>",{"html":html}));
				}
				
				// Show the pager buttons.
				$('#sejlnet_group_posts_prev').show();
				$('#sejlnet_group_posts_next').show();
				
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

$('#sejlnet_group_posts_next').live("click",function(){
	try {
		// If the gallery is empty, don't go to the next page.
		if (sejlnet_group_posts_empty) {
			return false;
		}
		if (sejlnet_group_posts_page >= 0) {
			sejlnet_group_posts_page++;
			$.mobile.changePage(
				"sejlnet_group_posts.html",
				{allowSamePageTransition:true, reloadPage:true}
			);
		}
	}
	catch (error) {
		alert('sejlnet_group_posts_next - ' + error);
	}
});

$('#sejlnet_group_posts_prev').live("click",function(){
	try {
		// If we're not on the first page, then go back.
		if (sejlnet_group_posts_page > 0) {
			sejlnet_group_posts_page--;
			$.mobile.changePage(
				"sejlnet_group_posts.html",
				{allowSamePageTransition:true, reloadPage:true}
			);
		}
	}
	catch (error) {
		alert('sejlnet_group_posts_prev - ' + error);
	}
	return false;
});

$('#sejlnet_group_posts_add').live("click", function(){
	if (drupalgap_user.uid == 0) {
		if (confirm("Du skal være logged på for at skrive indlæg.")) {
			$.mobile.changePage("user_login.html");
		}
		else {
			return false;
		}
	}
	else {
		// Make sure the user is a member of the group.
		views_options = {
			"path":"sejlnet/group/members/" + sejlnet_group_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				if (errorThrown) {
					alert(errorThrown);
				}
				else {
					alert(textStatus);
				}
			},
			"success":function(members) {
				is_a_member = false;
				if ($(members.users).length > 0) {
					$.each(members.users,function(index,obj){
						if (obj.user.uid == drupalgap_user.uid) {
							is_a_member = true;
							return false;
						}
					});
				}
				if (is_a_member) {
					// They are a member, send them to the group post add page.
					drupalgap_page_node_edit_type = "group_post";
					drupalgap_page_node_edit_og = "og_groups[" + sejlnet_group_nid + "]=" + sejlnet_group_nid;
					$.mobile.changePage("node_edit.html");
				}
				else {
					// Tell the user they are not a member of this group.
					navigator.notification.alert(
					    'You must be a member of this group to add a post, please join the group online at sejlnet.dk',
					    function(){},
					    'Not a Member',
					    'OK'
					);
				}
			},
		};
		drupalgap_views_datasource_retrieve.resource_call(views_options);
	}
});