$('#sejlent_harbor_guide_nearby').live('pagebeforeshow',function(){
	try {
		// Clear the list.
		$("#sejlent_harbor_guide_nearby_content_list").html("");
	}
	catch (error) {
		alert("sejlent_harbor_guide_nearby - pagebeforeshow - " + error);
	}
});

$('#sejlent_harbor_guide_nearby').live('pageshow',function(){
	try {
		
	}
	catch (error) {
		alert("sejlent_harbor_guide_nearby - pageshow - " + error);
	}
});

// When a content list item is clicked...
$('#sejlent_harbor_guide_nearby_content_list a').live("click",function(){
	// Save a reference to the node id.
	drupalgap_page_node_harbor_nid = $(this).attr('id');
	$.mobile.changePage("node_harbor.html");
});