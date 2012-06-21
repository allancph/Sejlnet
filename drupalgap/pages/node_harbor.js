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
				
				// Image (harbor map)
				//img_src = drupalgap_settings.site_path + drupalgap_settings.base_path + harbor.map;
				img_src = drupalgap_settings.site_path + drupalgap_settings.base_path + harbor.map;
				$('#harbor_map').attr('src', img_src);
				
				// Phone number.
				$('#harbor_phone span').html(harbor.phone);
				
				// Address.
				address = harbor.street + "<br />" + harbor.city + " " + harbor.postal_code + "<br />" + harbor.country;
				$('#harbor_address').html(address);
				
				// Coordinates.
				$('#harbor_coordinates').html(harbor.coordinates);
				
				// Fees.
				$('#harbor_fees span').html(harbor.fees);
				
				// Spaces.
				$('#harbor_spaces span').html(harbor.spaces);
				
				// Free member.
				$('#harbor_free_member span').html(harbor.free_member);
				
				// Blue flag.
				$('#harbor_free_blue_flag span').html(harbor.blue_flag);
				
				// Facilities.
				if ($(harbor.facilities).length > 0) {
					$.each(harbor.facilities,function(facility_index, facility_object){
						$("#sejlnet_harbor_facilities_list").append($("<li></li>",{"html":facility_object}));
					});
				}
				else {
					html = "Sorry, there are no facilities here.";
					$("#sejlnet_harbor_facilities_list").append($("<li></li>",{"html":html}));
				}
				$("#sejlnet_harbor_facilities_list").listview("destroy").listview();
				
				// Conditions.
				$('#harbor_conditions').html(harbor.conditions);
				
				// Body.
				$('#drupalgap_page_node_harbor .content').html(harbor.body);
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
