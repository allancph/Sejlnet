var sejlnet_gallery_photo_add_source;   // picture source
var sejlnet_gallery_photo_add_destination_type; // sets the format of returned value

var sejlnet_gallery_photo_add_img_width;
var sejlnet_gallery_photo_add_img_height;

$('#sejlnet_gallery_photo_add').live('pagebeforeshow',function(){
	try {
	}
	catch (error) {
		alert("sejlnet_gallery_photo_add - pagebeforeshow " + error);
	}
});

$('#sejlnet_gallery_photo_add').live('pageshow',function(){
	try {
		document.addEventListener("deviceready",sejlnet_gallery_photo_add_ready,false);
	}
	catch (error) {
		alert("sejlnet_gallery_photo_add - pageshow " + error);
	}
});

$('#sejlnet_gallery_photo_add_capture').live("click",function(){
	sejlnet_gallery_photo_add_capture();
});

$('#sejlnet_gallery_photo_add_from_library').live("click",function(){
	sejlnet_gallery_photo_add_get(sejlnet_gallery_photo_add_source.PHOTOLIBRARY);
});

function sejlnet_gallery_photo_add_ready() {
	sejlnet_gallery_photo_add_source = navigator.camera.PictureSourceType;
	sejlnet_gallery_photo_add_destination_type = navigator.camera.DestinationType;
	sejlnet_gallery_photo_add_get_location();
}

//A button will call this function
//
function sejlnet_gallery_photo_add_capture() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(sejlnet_gallery_photo_add_data_success, sejlnet_gallery_photo_add_fail, { quality: 50,
    destinationType: sejlnet_gallery_photo_add_destination_type.DATA_URL });
}

// A button will call this function
//
/*function sejlnet_gallery_photo_add_edit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
  navigator.camera.getPicture(sejlnet_gallery_photo_add_data_success, sejlnet_gallery_photo_add_fail, { quality: 20, allowEdit: true,
    destinationType: sejlnet_gallery_photo_add_destination_type.DATA_URL });
}*/

// A button will call this function
//
function sejlnet_gallery_photo_add_get(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(sejlnet_gallery_photo_add_uri_success, sejlnet_gallery_photo_add_fail, { quality: 50, 
    destinationType: sejlnet_gallery_photo_add_destination_type.FILE_URI,
    sourceType: source });
}

// Called if something bad happens.
// 
function sejlnet_gallery_photo_add_fail(message) {
	if (message != "") {
		console.log(message);
	}
}

// Called when a photo is successfully retrieved
function sejlnet_gallery_photo_add_data_success(imageData) {
  // Uncomment to view the base64 encoded image data
  // console.log(imageData);

  // Get image handle
  //
  var smallImage = document.getElementById('smallImage');

  // Unhide image elements
  //
  smallImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
function sejlnet_gallery_photo_add_uri_success(imageURI) {
  // Uncomment to view the image file URI 
  // console.log(imageURI);

  // Get image handle
  var largeImage = document.getElementById('largeImage');

  // Unhide image elements
  largeImage.style.display = 'block';

  // Show the captured photo  
  largeImage.src = imageURI;
  
  // When the photo is shown...
  largeImage.onload = function () {
	  
	  // Resize it to fit a 320px display.
	  sejlnet_gallery_photo_add_img_width = this.width;
	  sejlnet_gallery_photo_add_img_height = this.height;
	  ratio = sejlnet_gallery_photo_add_img_width/280;
	  new_width = sejlnet_gallery_photo_add_img_width/ratio;
	  new_height = sejlnet_gallery_photo_add_img_height/ratio;
	  largeImage.width = new_width;
	  largeImage.height = new_height;
	  
	  // Hide the two photo buttons.
	  $('#sejlnet_gallery_photo_add_capture').hide();
	  $('#sejlnet_gallery_photo_add_from_library').hide();
	  
	  // Show the photo upload button.
	  $('#sejlnet_gallery_photo_add_upload').show();
  };
  
}

$('#sejlnet_gallery_photo_add_upload').live("click", function(){
	// If they didn't enter a latitude and longitude, notify them.
	lat = $('#sejlnet_gallery_photo_add_latitude').val();
	lng = $('#sejlnet_gallery_photo_add_longitude').val();
	
	if (!lat || !lng) {
		alert("Please enter your latitude and longitude.");
		return false;
	}
	
	alert("Uploading photo...");
	
	// Get image.
	var largeImage = document.getElementById('largeImage');
	
	// Get image file name.
	var image_file_name_index = largeImage.src.lastIndexOf("/") + 1;
	var image_file_name = largeImage.src.substr(image_file_name_index);
	
	data = {"file":{
		"file":"",
		"filename":image_file_name,
		"filepath":"sites/default/files/" + image_file_name
	}};
	options = {
		"data":data,
		"error":function(jqXHR, textStatus, errorThrown) {
		
		},
		"success":function(result){
			console.log(JSON.stringify(result));
		}
	};
	console.log(JSON.stringify(data));
	//drupalgap_services_file_create.resource_call(options);
});

function sejlnet_gallery_photo_add_get_location() {
	// Now let's get the user's current location and show it on the google map.
	$('#geo_location_msg').html("Waiting for location...");
	navigator.geolocation.getCurrentPosition(sejlnet_gallery_photo_add_onSuccess, sejlnet_gallery_photo_add_onError, { timeout: sejlnet_location_timeout, enableHighAccuracy: true });
}

function sejlnet_gallery_photo_add_onSuccess(position) {
    location_message = 'Latitude: '           + position.coords.latitude              + '<br />' +
                        'Longitude: '          + position.coords.longitude             + '<br />' +
                        'Altitude: '           + position.coords.altitude              + '<br />' +
                        'Accuracy: '           + position.coords.accuracy              + '<br />' +
                        'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                        'Heading: '            + position.coords.heading               + '<br />' +
                        'Speed: '              + position.coords.speed                 + '<br />' +
                        'Timestamp: '          + position.timestamp          + '<br />';
    
    $('#geo_location_msg').html(location_message);
    
    $('#sejlnet_gallery_photo_add_location_wrapper').show();
    
    // Fill in the form with the lat/lng and start the search.
    $('#sejlnet_gallery_photo_add_latitude').val(position.coords.latitude);
    $('#sejlnet_gallery_photo_add_longitude').val(position.coords.longitude);
	
    sejlnet_gallery_photo_add_map_init(position.coords.latitude, position.coords.longitude);
}

// onError Callback receives a PositionError object
//
function sejlnet_gallery_photo_add_onError(error) {
	//alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
	confirm_msg = "We were unable to determine your current location. " + 
	"Would you like to try again?";
	if (confirm(confirm_msg)) {
		sejlnet_gallery_photo_add_get_location();
	}
	else {
		$('#geo_location_msg').html("If you know your current latitude and longitude you may enter it in the text fields provided.");
		$('#sejlnet_gallery_photo_add_location_wrapper').show();
	}    
}

function sejlnet_gallery_photo_add_map_init(lat,lng) {
	var myOptions = {
		zoom: 8,
		center: new google.maps.LatLng(lat, lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("sejlnet_gallery_photo_add_map_canvas"),myOptions);
    
    var myLatLng = new google.maps.LatLng(lat, lng);
    var myMarkerOptions = {
      position: myLatLng,
      map: map
    }
    var marker = new google.maps.Marker(myMarkerOptions);
}

$('#sejlnet_gallery_photo_add_set').live("click", function(){
	lat = $('#sejlnet_gallery_photo_add_latitude').val();
	lng = $('#sejlnet_gallery_photo_add_longitude').val();
	sejlnet_gallery_photo_add_map_init(lat, lng);
});