var drupalgap_page_node_harbor;
var drupalgap_page_node_harbor_nid;
var drupalgap_page_node_harbor_back;

$('#drupalgap_page_node_harbor').live('pagebeforeshow',function(){
	try {
		// Clear the list.
		$("#sejlnet_harbor_facilities_list").html("");
	}
	catch (error) {
		alert("drupalgap_page_node_harbor - pagebeforeshow " + error);
	}
});

$('#drupalgap_page_node_harbor').live('pageshow',function(){
	try {
		// Load node via services call and then display it.
		options = {
			"path":"sejlnet/node/harbor/" + drupalgap_page_node_harbor_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
			},
			"success":function(harbor){
				
				if (harbor.nodes.length == 0) {
					alert("Failed to load harbor! (" + drupalgap_page_node_harbor_nid + ")");
					return false;
				}
				
				// Extract harbor node from JSON.
				harbor = harbor.nodes[0].node;
				
				// Populate template place holders...
				
				// Title.
				title = harbor.title;
				if (title == null) {
					title = harbor.titel; // the live site uses 'titel' for the field name
				}
				harbor.title = title;
				$('#drupalgap_page_node_harbor h2').html(harbor.title);
				
				// After we've saved the language barrier title above, let's save a copy
				// of this harbor node so others can use it.
				drupalgap_page_node_harbor = harbor;
				
				// Image (harbor map)
				if (harbor.map) {
					image = "";
					if (harbor.map_full_size) {
						image += "<a href='" + harbor.map_full_size + "'>";
					}
					image += "<img src='" + harbor.map + "' />";
					if (harbor.map_full_size) {
						image += "</a>";
					}		
					$('#harbor_map').html(image);
				}
				
				// Phone number.
				phone = harbor.phone;
				if (!phone) {
					phone = "N/A";
				}
				$('#harbor_phone span').html(phone);
				
				// Address.
				address = harbor.street + "<br />" + harbor.city + " " + harbor.postal_code + "<br />" + harbor.country;
				$('#harbor_address').html(address);
				
				// Coordinates.
				$('#harbor_coordinates').html(harbor.coordinates);
				
				// Fees.
				fees = harbor.fees;
				if (!fees) {
					fees = "N/A";
				}
				$('#harbor_fees span').html(fees);
				
				// Spaces.
				spaces = harbor.spaces;
				if (!spaces) {
					spaces = "N/A";
				}
				$('#harbor_spaces span').html(spaces);
				
				// Free member.
				free_member = harbor.free_member;
				if (!free_member) {
					free_member = "N/A";
				}
				$('#harbor_free_member span').html(free_member);
				
				// Blue flag.
				blue_flag = harbor.blue_flag;
				if (!blue_flag) {
					blue_flag = "N/A";
				}
				$('#harbor_free_blue_flag span').html(blue_flag);
				
				// Facilities.
				facilities = "";
				if ($(harbor.facilities).length > 0) {
					$.each(harbor.facilities,function(facility_index, facility_object){
						facilities += '<div>' + facility_object +'</div>';
					});
				}
				else {
					facilities = "Sorry, there are no facilities here.";
				}
				$('#sejlnet_harbor_facilities').html(facilities);
				
				// Conditions.
				conditions = harbor.conditions;
				if (!conditions) {
					conditions = "N/A";
				}
				$('#harbor_conditions').html(conditions);
				
				// Body.
				body = harbor.body;
				if (!body) {
					body = harbor.indhold; // indhold = body in danish
				}
				$('#drupalgap_page_node_harbor .content').html(body);
			},
		};
		drupalgap_views_datasource_retrieve.resource_call(options);
	}
	catch (error) {
		alert("drupalgap_page_node_harbor - pageshow " + error);
	}
});

$('#drupalgap_page_node_harbor_back').live("click",function(){
	node_harbor_go_back();
});

function node_harbor_go_back() {
	go_back = "sejlnet_harbor_guide.html";
	switch (drupalgap_page_node_harbor_back) {
		case "nearby":
			go_back = "sejlnet_harbor_guide_nearby.html";
			break;
		case "all":
			go_back = "sejlnet_harbor_guide.html";
			break;
		case "map":
			go_back = "sejlnet_harbor_guide_map.html";
			break;
	}
	$.mobile.changePage(go_back);
}