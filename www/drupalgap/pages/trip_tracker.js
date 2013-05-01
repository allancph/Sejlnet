var trip_tracker_watch_id = null;
var trip_tracker_data = [];
var trip_tracker_map = null;
var trip_tracker_map_initialized = false;
var trip_tracker_map_markers = [];
var trip_tracker_started = false;

$('#drupalgap_trip_tracker').on('pagebeforeshow', function(){
    // Is there any trip tracker data saved in local strage?
    var data = window.localStorage.getItem('trip_tracker_data');
    console.log(JSON.stringify(data));
    if (data != null) {
      $('#trip_tracker_start').hide();
      $('#trip_tracker_resume').show();
      $('#trip_tracker_reset').show();
      trip_tracker_data = JSON.parse(data);
    }
});

function trip_tracker_start() {
  $('#trip_tracker_start').hide();
  $('#trip_tracker_resume').hide();
  $('#trip_tracker_reset').hide();
  $('#trip_tracker_stop').show();
  trip_tracker_watch_id = navigator.geolocation.watchPosition(
    trip_tracker_success,
    trip_tracker_error,
    {enableHighAccuracy:true}
  );
  // Tracking trip...
  $('#trip_tracker_message').prepend('<p>Logger tur...</p>');
  trip_tracker_started = true;
  return false;
}

function trip_tracker_stop() {
  navigator.geolocation.clearWatch(trip_tracker_watch_id);
  $('#trip_tracker_stop').hide();
  $('#trip_tracker_reset').show();
  $('#trip_tracker_inputs').show();
  $('#trip_tracker_message').html('');
  trip_tracker_started = false;
  var sailingPathCoordinates = [];
  $.each(trip_tracker_data, function(index, data){
      var date = new Date(data.date);
      sailingPathCoordinates.push(new google.maps.LatLng(data.latitude, data.longitude));
      $('#trip_tracker_message').append('<p>' +
         date.toString() + '<br >' +
        'Latitude: '  + data.latitude + '<br />' +
        'Longitude: ' + data.longitude + '<hr />' +
      '</p>');
  });
  // Initialize the map if it hasn't been initialized.
  if (!trip_tracker_map_initialized) {
    trip_tracker_map_initialize();
  }
  // Add the start and end points to the map, and set the map center to the
  // start point.
  if (trip_tracker_data.length > 0) {
    trip_tracker_map.setCenter(sailingPathCoordinates[0]);
    trip_tracker_add_position_to_map(
      trip_tracker_data[0].latitude,
      trip_tracker_data[0].longitude
    );
    if (trip_tracker_data.length > 1) {
      trip_tracker_add_position_to_map(
        trip_tracker_data[trip_tracker_data.length-1].latitude,
        trip_tracker_data[trip_tracker_data.length-1].longitude
      );
    }
  }
  // Draw the trip line(s).
  var sailingPath = new google.maps.Polyline({
    path: sailingPathCoordinates,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  // Add the lines to the map.
  sailingPath.setMap(trip_tracker_map);
  return false;
}

function trip_tracker_reset() {
  $('#trip_tracker_start').show();
  $('#trip_tracker_resume').hide();
  $('#trip_tracker_reset').hide();
  $('#trip_tracker_message').html('');
  $('#trip_tracker_inputs').hide();
  $('#trip_tracker_title').val('');
  $('#trip_tracker_body').val('');
  trip_tracker_started = false;
  trip_tracker_data = [];
  trip_tracker_map_markers = [];
  trip_tracker_map_initialize();
}

function trip_tracker_success(position) {
  // Add the date and position info to the trip data.
  var now = new Date();
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  var speed = position.coords.speed; if (speed == null) { speed = 0; }
  var heading = position.coords.heading; if (heading == null) { heading = 'N/A'; }
  var created = now.getTime();
  trip_tracker_data.push({
      'date':created,
      'latitude':lat,
      'longitude':lng,
  });
  $('#trip_tracker_message').html(
    'Breddegrad: ' + lat +
    '<br />Længdegrad: ' + lng + 
    '<br />Hastighed: ' + speed +
    '<br />Kurs: ' + heading +
    '<br />Last Updated: ' + js_yyyy_mm_dd_hh_mm_ss()
  );
  /*
  // Initialize the map if it hasn't been initialized.
  if (!trip_tracker_map_initialized) {
    trip_tracker_map_initialize();
  }
  // Update the map.
  trip_tracker_add_position_to_map(position.coords.latitude, position.coords.longitude);
  */
}

function trip_tracker_error(error) {
  alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

function trip_tracker_map_initialize() {
	var myOptions = {
		zoom: 13,
		center: new google.maps.LatLng(sejlnet_location_latitude, sejlnet_location_longitude),
		mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  trip_tracker_map = new google.maps.Map(document.getElementById("trip_tracker_map"), myOptions);
  trip_tracker_map_initialized = true;
}

function trip_tracker_add_position_to_map(lat, lng) {
  // If there is already a marker on the map, remove it.
  if (trip_tracker_map_markers.length > 0) {
    trip_tracker_map_markers[0].setMap(null);
    delete(trip_tracker_map_markers[0]);
  }
  // Create new marker from lat/lng, add it to the map and save the marker.
  var myLatLng = new google.maps.LatLng(lat, lng);
  var myMarkerOptions = {
    position: myLatLng,
    map: trip_tracker_map
  };
  var marker = new google.maps.Marker(myMarkerOptions);
  trip_tracker_map_markers.push(marker);
}

function trip_tracker_submit() {
  var trip_tracker_title = $('#trip_tracker_title').val();
  if (trip_tracker_title == '') {
    alert('Giv dit log indlæg en titel.');
    return false;
  }
  var trip_tracker_body = $('#trip_tracker_body').val();
  if (drupalgap_user.uid == 0) {
		if (confirm("Du skal logge ind for at gennem dit log indlæg.")) {
		  // Save the trip data to local storage.
      window.localStorage.setItem("trip_tracker_data", JSON.stringify(trip_tracker_data));
		  user_login_destination = 'trip_tracker.html';
			$.mobile.changePage("user_login.html");
		}
	}
	else {
	  // Build up the trip log into a text string.
	  var field_blog_trip = '';
	  var data = '';
	  if (trip_tracker_data && trip_tracker_data.length > 0) {
	    $.each(trip_tracker_data, function(index, object){
	        // Save the first latitude longitude as the location of the node.
	        if (index == 0) {
	          data +=
	            "locations[0][locpick][user_latitude]=" + object.latitude +
	            "&locations[0][locpick][user_longitude]=" + object.longitude; 
	        }
	        // Append the data, lat and lng to the field_blog_trip.
          field_blog_trip +=
            object.date + ':' +
            object.latitude + ':'+
            object.longitude + ',';
      });
      // Remove the last comma.
      field_blog_trip = field_blog_trip.substring(0,field_blog_trip.length-1);
      data += '&field_blog_trip[0][value]=' + encodeURIComponent(field_blog_trip)
	  }
		// Create a blog post node with the trip information and attach it to
		// field_blog_trip.
		var trip = {
		  'type':'blog',
		  'title':trip_tracker_title,
		  'body':trip_tracker_body
		};
		drupalgap_services_node_create.resource_call({
		    'node':trip,
		    'data':data,
		    'success':function(result){
		      // Trip Saved online.
		      alert('Logindlæg gemt på sejlnet.dk');
		      $.mobile.changePage("dashboard.html");
		    },
		});
	}
}

function trip_tracker_home_click() {
  // If the trip tracker is started, or if there is any trip data, warn them
  // about leaving the tracker.
  if (trip_tracker_started || trip_tracker_data.length > 0) {
    if (!confirm('Are you sure you want to leave the trip tracker? Your trip data will be saved locally.')) {
      return false;
    }
    else {
      // If the trip tracker is started, stop it.
      if (trip_tracker_started) {
        navigator.geolocation.clearWatch(trip_tracker_watch_id);
        trip_tracker_started = false;
      }
      // Save the trip data to local storage.
      window.localStorage.setItem("trip_tracker_data", JSON.stringify(trip_tracker_data));
    }
  }
  $.mobile.changePage('dashboard.html');
}

