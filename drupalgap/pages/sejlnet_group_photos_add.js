var sejlnet_group_photos_source;   // picture source
var sejlnet_group_photos_destination_type; // sets the format of returned value 

$('#sejlnet_group_photos_add').live('pagebeforeshow',function(){
	try {
	}
	catch (error) {
		alert("sejlnet_group_photos_add - pagebeforeshow " + error);
	}
});

$('#sejlnet_group_photos_add').live('pageshow',function(){
	try {
		// Set the group title.
		$('#sejlnet_group_photos h2').html(sejlnet_group_node.title);
		
		document.addEventListener("deviceready",sejlnet_group_photos_ready,false);
	}
	catch (error) {
		alert("sejlnet_group_photos_add - pageshow " + error);
	}
});

$('#sejlnet_group_photos_capture').live("click",function(){
	sejlnet_group_photos_capture();
});

$('#sejlnet_group_photos_add_from_library').live("click",function(){
	sejlnet_group_photos_get(sejlnet_group_photos_source.PHOTOLIBRARY);
});

$('#sejlnet_group_photos_add_from_album').live("click",function(){
	sejlnet_group_photos_get(sejlnet_group_photos_source.SAVEDPHOTOALBUM);
});

function sejlnet_group_photos_ready() {
	sejlnet_group_photos_source = navigator.camera.PictureSourceType;
	sejlnet_group_photos_destination_type = navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
function sejlnet_group_photos_data_success(imageData) {
  // Uncomment to view the base64 encoded image data
  // console.log(imageData);

  // Get image handle
  //
  /*var smallImage = document.getElementById('smallImage');

  // Unhide image elements
  //
  smallImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  smallImage.src = "data:image/jpeg;base64," + imageData;*/
}

// Called when a photo is successfully retrieved
function sejlnet_group_photos_uri_success(imageURI) {
  // Uncomment to view the image file URI 
  // console.log(imageURI);

  // Get image handle
  //
  /*var largeImage = document.getElementById('largeImage');

  // Unhide image elements
  //
  largeImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  largeImage.src = imageURI;*/
}

// A button will call this function
//
function sejlnet_group_photos_capture() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(sejlnet_group_photos_data_success, sejlnet_group_photos_fail, { quality: 50,
    destinationType: sejlnet_group_photos_destination_type.DATA_URL });
}

// A button will call this function
//
function sejlnet_group_photos_edit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
  navigator.camera.getPicture(sejlnet_group_photos_data_success, sejlnet_group_photos_fail, { quality: 20, allowEdit: true,
    destinationType: sejlnet_group_photos_destination_type.DATA_URL });
}

// A button will call this function
//
function sejlnet_group_photos_get(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(sejlnet_group_photos_uri_success, sejlnet_group_photos_fail, { quality: 50, 
    destinationType: sejlnet_group_photos_destination_type.FILE_URI,
    sourceType: source });
}

// Called if something bad happens.
// 
function sejlnet_group_photos_fail(message) {
	if (message != "") {
		console.log(message);
	}
}