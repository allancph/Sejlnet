var drupalgap_page_node_anchorage;
var drupalgap_page_node_anchorage_nid;
var drupalgap_page_node_anchorage_back;

$('#drupalgap_page_node_anchorage').live('pagebeforeshow',function(){
	try {
		// Clear the list.
		$("#sejlnet_anchorage_facilities_list").html("");
	}
	catch (error) {
		alert("drupalgap_page_node_anchorage - pagebeforeshow " + error);
	}
});

$('#drupalgap_page_node_anchorage').live('pageshow',function(){
	try {
		// Load node via services call and then display it.
		options = {
			"path":"sejlnet/node/anchorage/" + drupalgap_page_node_anchorage_nid,
			"error":function(jqXHR, textStatus, errorThrown) {
				console.log(JSON.stringify(errorThrown));
				console.log(JSON.stringify(textStatus));
			},
			"success":function(anchorage){
				
				if (anchorage.nodes.length == 0) {
					alert("Kan ikke indlæse havn! (" + drupalgap_page_node_anchorage_nid + ")");
					return false;
				}
				
				// Extract anchorage node from JSON.
				anchorage = anchorage.nodes[0].node;
				
				// Populate template place holders...
				
				// Title.
				title = anchorage.title;
				if (title == null) {
					title = anchorage.titel; // the live site uses 'titel' for the field name
				}
				anchorage.title = title;
				$('#drupalgap_page_node_anchorage h2').html(anchorage.title);
				
				// After we've saved the language barrier title above, let's save a copy
				// of this anchorage node so others can use it.
				drupalgap_page_node_anchorage = anchorage;
				
				// Image (anchorage map)
				if (anchorage.map) {
					image = "";
					if (anchorage.map_full_size) {
						image += "<a href='" + anchorage.map_full_size + "' target='_blank'>";
					}
					image += "<img src='" + anchorage.map + "' />";
					if (anchorage.map_full_size) {
						image += "</a>";
					}		
					$('#anchorage_map').html(image);
				}
				
				// Phone number.
				phone = anchorage.phone;
				if (!phone) {
					phone = "N/A";
				}
				$('#anchorage_phone span').html(phone);
				
				// Address.
				address = anchorage.street + "<br />" + anchorage.city + " " + anchorage.postal_code + "<br />" + anchorage.country;
				$('#anchorage_address').html(address);
				
				// Coordinates.
				$('#anchorage_coordinates').html(anchorage.coordinates);
				
				// Fees.
				fees = anchorage.fees;
				if (!fees) {
					fees = "N/A";
				}
				$('#anchorage_fees span').html(fees);
				
				// Spaces.
				spaces = anchorage.spaces;
				if (!spaces) {
					spaces = "N/A";
				}
				$('#anchorage_spaces span').html(spaces);
				
				// Free member.
				free_member = anchorage.free_member;
				if (!free_member) {
					free_member = "N/A";
				}
				$('#anchorage_free_member span').html(free_member);
				
				// Blue flag.
				blue_flag = anchorage.blue_flag;
				if (!blue_flag) {
					blue_flag = "N/A";
				}
				$('#anchorage_free_blue_flag span').html(blue_flag);
				
				// Facilities.
				facilities = "";
				if ($(anchorage.facilities).length > 0) {
					$.each(anchorage.facilities,function(facility_index, facility_object){
						facilities += '<div>' + facility_object +'</div>';
					});
				}
				else {
					// No facilities.
					facilities = "Beklager, der er ingen faciliteter her";
				}
				$('#sejlnet_anchorage_facilities').html(facilities);
				
				// Conditions.
				conditions = anchorage.conditions;
				if (!conditions) {
					conditions = "N/A";
				}
				$('#anchorage_conditions').html(conditions);
				
				// Body.
				body = anchorage.body;
				if (!body) {
					body = anchorage.indhold; // indhold = body in danish
				}
				$('#drupalgap_page_node_anchorage .content').html(body);
			},
		};
		drupalgap_views_datasource_retrieve.resource_call(options);
	}
	catch (error) {
		alert("drupalgap_page_node_anchorage - pageshow " + error);
	}
});

$('#drupalgap_page_node_anchorage_back').live("click",function(){
	node_anchorage_go_back();
});

function node_anchorage_go_back() {
	var go_back = "sejlnet_anchorage_all.html";
	switch (drupalgap_page_node_anchorage_back) {
		case "nearby":
			go_back = "sejlnet_anchorage_nearby.html";
			break;
		case "all":
			go_back = "sejlnet_anchorage_all.html";
			break;
		case "map":
			go_back = "sejlnet_anchorage_map.html";
			break;
	}
	$.mobile.changePage(go_back);
}