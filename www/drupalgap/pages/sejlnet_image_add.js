var sejlnet_image_add_source;   // picture source
var sejlnet_image_add_destination_type; // sets the format of returned value

var sejlnet_image_add_img_width;
var sejlnet_image_add_img_height;
var sejlnet_image_add_img_data = null;

$('#sejlnet_image_add').live('pagebeforeshow',function(){
	try {
	}
	catch (error) {
		alert("sejlnet_image_add - pagebeforeshow " + error);
	}
});

$('#sejlnet_image_add').live('pageshow',function(){
	try {
		document.addEventListener("deviceready",sejlnet_image_add_ready,false);
		sejlnet_image_add_get_location();
		//sejlnet_image_add_map_init(sejlnet_location_latitude, sejlnet_location_longitude);
	}
	catch (error) {
		alert("sejlnet_image_add - pageshow " + error);
	}
});

$('#sejlnet_image_add_capture').live("click",function(){
	sejlnet_image_add_capture();
});

$('#sejlnet_image_add_from_library').live("click",function(){
	sejlnet_image_add_get(sejlnet_image_add_source.PHOTOLIBRARY);
});

$('#sejlnet_image_add_get_current_location').live("click",function(){
	sejlnet_image_add_get_location();
});

function sejlnet_image_add_ready() {
	sejlnet_image_add_source = navigator.camera.PictureSourceType;
	sejlnet_image_add_destination_type = navigator.camera.DestinationType;
}

function sejlnet_image_add_capture() {
	// Take picture using device camera and retrieve image as base64-encoded string
	photo_options = {
		quality: 50,
		destinationType: sejlnet_image_add_destination_type.DATA_URL,
		correctOrientation: true
	}
	navigator.camera.getPicture(sejlnet_image_add_data_success, sejlnet_image_add_fail, photo_options);
}

function sejlnet_image_add_get(source) {
	$('#largeImage_msg').html("Loading image...");
	// Retrieve image file location from specified source
	photo_options = {
		quality: 50,
		destinationType: sejlnet_image_add_destination_type.DATA_URL,
		sourceType: source,
		correctOrientation: true
	}
	navigator.camera.getPicture(sejlnet_image_add_data_success, sejlnet_image_add_fail, photo_options);
}

// Called if something bad happens.
// 
function sejlnet_image_add_fail(message) {
	if (message != "") {
		console.log(message);
	}
	$('#largeImage_msg').html("");
}

// Called when a photo is successfully retrieved
//function sejlnet_image_add_uri_success(imageURI) {
function sejlnet_image_add_data_success(imageData) {
	
	// Save a copy of the image data so we can upload it later.
	sejlnet_image_add_img_data = imageData;

  // Get image handle
  var largeImage = document.getElementById('largeImage');
  
  $('#largeImage_msg').html("");

  // Show the captured photo  
  //largeImage.src = imageURI;
  largeImage.src = "data:image/jpeg;base64," + imageData;
  
  // When the photo is shown...
  largeImage.onload = function () {
	  
	  // Resize it to fit a 320px display.
	  sejlnet_image_add_img_width = this.width;
	  sejlnet_image_add_img_height = this.height;
	  ratio = sejlnet_image_add_img_width/280;
	  new_width = sejlnet_image_add_img_width/ratio;
	  new_height = sejlnet_image_add_img_height/ratio;
	  largeImage.width = new_width;
	  largeImage.height = new_height;
	  
	  // Hide the two photo buttons.
	  $('#sejlnet_image_add_capture').hide();
	  $('#sejlnet_image_add_from_library').hide();
	  
	  // Show the photo upload button.
	  //$('#sejlnet_image_add_upload').show();
  };
  
}

$('#sejlnet_image_add_upload').live("click", function(){
	
	// If they didn't enter a title notify them.
	title = $('#sejlnet_image_add_title').val();
	if (!title) {
		alert("Tilføj billede titel.");
		return false;
	}
	
	// Try to extract the image body.
	body = $('#sejlnet_image_add_body').val();
	
	// If they didn't select a photo, notify them.
	if (!sejlnet_image_add_img_data) {
		alert("Du skal vælge et billede.");
		return false;
	}
	
	// If they entered a lat/lng, make sure they entered both.
	lat = $('#sejlnet_image_add_latitude').val();
	lng = $('#sejlnet_image_add_longitude').val();
	if ((lat && !lng) || (lng && !lat)) {
		alert("Indtast længde- og breddegrad.");
		return false;
	}
	
	// Hide the upload button.
	$('#sejlnet_image_add_upload').hide();
	
	// Get image.
	var largeImage = document.getElementById('largeImage');
	
	// Create a unique file name using the UTC integer value.
	var d = new Date();
	var image_file_name = "" + d.valueOf() + ".jpg";
	
	// Clear the image gallery from local storage.
	window.localStorage.removeItem("get.sejlnet/gallery?page=0");
	if (sejlnet_group_nid) {
		window.localStorage.removeItem("get.sejlnet/group/photos/" + sejlnet_group_nid + "?page=0");
	}
	
	data = {"file":{
		"file":sejlnet_image_add_img_data,
		"filename":image_file_name,
		"filepath":"sites/default/files/" + image_file_name
	}};
	options = {
		"data":data,
		"error":function(jqXHR, textStatus, errorThrown) {
			alert(textStatus + " - " + errorThrown);
			if (jqXHR.responseText) {
				alert(jqXHR.responseText);
			}
		},
		"success":function(result){
			
			console.log(JSON.stringify(result));
			
			// Extract the newly created file id.
			file_id = result.fid;
			
			// Determine the node type.
			node_type = "";
			if (sejlnet_group_nid) {
				node_type = "group_image";
			}
			else {
				node_type = "user_image";
			}
			
			// Build the data string.
			data = "type=" + node_type +
			"&title=" + encodeURIComponent(title) +
			"&field_image[0][fid]=" + file_id;
			
			// Attach the image body if they provided one.
			if (body != "") {
				data += "&body=" + encodeURIComponent(body);
			}
			
			// If we are attaching the image node to a group, set the og data argument.
			if (sejlnet_group_nid) {
				data += "&og_groups[" + sejlnet_group_nid + "]=" + sejlnet_group_nid;
			}
			
			// Append the location module parameters if we have a lat and lng.
			if (lat && lng) {
				data += "&locations[0][locpick][user_latitude]=" + lat +
				"&locations[0][locpick][user_longitude]=" + lng; 
			}
			
			// Now that we have the new file id, let's create a new node
			// with the new file id on the node's image field.
			node_create_options = {
				"resource_path":"node.json",
				"type":"post",
				"load_from_local_storage":false,
				"save_to_local_storage":false,
				"data":data,
				"async":true,
				"error":function(jqXHR, textStatus, errorThrown) {
					alert(textStatus + " - " + errorThrown);
					if (jqXHR.responseText) {
						alert(jqXHR.responseText);
					}
				},
				"success":function(node_create_result){
					if (sejlnet_group_nid) {
						$.mobile.changePage("sejlnet_group_photos.html");
					}
					else {
						$.mobile.changePage("sejlnet_gallery.html");
					}
				}
			};
			drupalgap_services.resource_call(node_create_options);
			
		}
	};
	console.log(JSON.stringify(data));
	drupalgap_services_file_create.resource_call(options);
	
	
});

function sejlnet_image_add_get_location() {
	// Now let's get the user's current location and show it on the google map.
	$('#geo_location_msg').html("Venter på position...");
	navigator.geolocation.getCurrentPosition(sejlnet_image_add_onSuccess, sejlnet_image_add_onError, { timeout: sejlnet_location_timeout, enableHighAccuracy: true });
}

function sejlnet_image_add_onSuccess(position) {
	
    $('#geo_location_msg').html(sejlnet_render_geo_location_info(position));
    
    // Fill in the form with the lat/lng and start the search.
    $('#sejlnet_image_add_latitude').val(position.coords.latitude);
    $('#sejlnet_image_add_longitude').val(position.coords.longitude);
	
    sejlnet_image_add_map_init(position.coords.latitude, position.coords.longitude);
}

// onError Callback receives a PositionError object
//
function sejlnet_image_add_onError(error) {
	// Unable to determine location, try again?
	confirm_msg = "Vi kan ikke fastslå din position, vil du prøve igen ?.";
	if (confirm(confirm_msg)) {
		sejlnet_image_add_get_location();
	}
	else {
	}    
}

function sejlnet_image_add_map_init(lat,lng) {
	$('#sejlnet_image_add_map_canvas').show();
	var myOptions = {
		zoom: 5,
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("sejlnet_image_add_map_canvas"),myOptions);
    
    var myLatLng = new google.maps.LatLng(lat, lng);
    var myMarkerOptions = {
      position: myLatLng,
      map: map
    }
    var marker = new google.maps.Marker(myMarkerOptions);
}

$('#sejlnet_image_add_back').live("click", function(){
	if (sejlnet_group_nid) {
		$.mobile.changePage("sejlnet_group_photos.html");
	}
	else {
		$.mobile.changePage("sejlnet_gallery.html");
	}
});