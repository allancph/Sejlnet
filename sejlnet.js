var sejlnet_location_timeout = 15000;
// Denmark Default
var sejlnet_location_latitude = 55.9492;
var sejlnet_location_longitude = 10.986328;

// Hirksholm Havn
//var sejlnet_location_latitude = 57.484228;
//var sejlnet_location_longitude = 10.622709;

// Ann Arbor
//var sejlnet_location_latitude = 42.177000;
//var sejlnet_location_longitude = -83.652000;

// This function renders photo list items generated from the json
// data returned by the following views:
// 		drupalgap_sejlnet_gallery
//		drupalgap_sejlnet_group_photos
// The views labels need to be consistent so this function can
// handle multiple views.
function sejlnet_gallery_photo_list_item_render(node) {
	console.log(JSON.stringify(node));
	// Extract the image source. Since we are dealing with
	// two different content types, and two different image
	// fields, check both fields for an image source. And
	// watch out for the auto danish translation on field names.
	img_src = "";
	if (node.sailing_image) {
		img_src = node.sailing_image;
	}
	else if (node.group_image) {
		img_src = node.group_image;
	}
	else if (node.image) {
		img_src = node.image;
	}
	else if (node.billede) {
		img_src = node.billede;
	}
	
	if (img_src != "") {
		
		// Extract the title.
		title = node.title;
		if (!title) {
			title = node.titel;
		}
		
		// Build link to author.
		author = "";
		if (node.name && node.uid) {
			author_link = "<a href='#' uid='" + node.uid + "' class='sejlnet_photo_author'>" + node.name + "</a>";
			author = "Posted by: " + author_link + "<br />"; 
		}
		
		// Build comment count, if there is any.
		comments = "";
		if (node.comment_count && node.comment_count > 0) {
			comments = " | " + node.comment_count;
			if (node.comment_count == 1) {
				comments += " Comment";
			}
			else {
				comments += " Comments";
			}
			comments += "<br />";
		}
		
		// Build link to image node. If a full size image path was provided in the
		// JSON use it, otherwise link to the app node type page.
		link = "";
		if (node.image_full_size) {
			link = node.image_full_size;
		}
		else {
			switch (node.type) {
				// (Group Image)
				case "group_image":
					link = "node_group_image.html";
					break;
				// (Sailing Image)
				case "user_image":
					link = "node_user_image.html";
					break;
			}
		}
		
		// Render picture.
		return "<p style='text-align: center;'>" + 
		"<strong>" + title + "</strong><br />" +
		author + node.created + comments +
		"<a href='" + link + "' class='sejlnet_photo_item' nid='" + node.nid + "'><img src='" + img_src + "' /></a>" +
		"</p><hr />";
	}
}

$('.sejlnet_photo_author').live("click",function(){
	// Extract the user id.
	drupalgap_page_user_uid = $(this).attr('uid');
	
	// Set the user page back button based on what page we are currently on.
	current_page = $.mobile.activePage.data('url');
	if (current_page.indexOf("sejlnet_group_photos.html") != -1) {
		dg_page_user_back_button_destination = "sejlnet_group_photos.html";
	}
	else if (current_page.indexOf("sejlnet_gallery.html") != -1) {
		dg_page_user_back_button_destination = "sejlnet_gallery.html";
	}
	
	// Go to the user page.
	$.mobile.changePage("user.html");
});

$(".sejlnet_photo_item").live("click",function(){
	node_group_image_nid = $(this).attr('nid');
	node_user_image_nid = $(this).attr('nid');
	// Set the image page back button based on what page we are currently on.
	current_page = $.mobile.activePage.data('url');
	if (current_page.indexOf("sejlnet_group_photos.html") != -1) {
		node_group_image_destination = "sejlnet_group_photos.html";
	}
	else if (current_page.indexOf("sejlnet_gallery.html") != -1) {
		node_group_image_destination = "sejlnet_gallery.html";
	}
});

function CalcDistanceBetween(lat1, lon1, lat2, lon2) {
    //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
    //var R = 3958.7558657440545; // Radius of earth in Miles
	var R = 6371; // Radius of the earth in km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    //return d;
    return d.toFixed(2);
}

function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}