var trip_tracker_watch_id = null;
var trip_tracker_data = [];
var trip_tracker_map = null;
var trip_tracker_map_initialized = false;
var trip_tracker_map_markers = [];

$('#drupalgap_trip_tracker').live('pageshow', function(){
    
});

function trip_tracker_start() {
  $('#trip_tracker_start').hide();
  $('#trip_tracker_stop').show();
  trip_tracker_watch_id = navigator.geolocation.watchPosition(
    trip_tracker_success,
    trip_tracker_error,
    {enableHighAccuracy:true}
  );
  $('#trip_tracker_message').prepend('<p>Tracking trip...</p>');
  return false;
}

function trip_tracker_stop() {
  navigator.geolocation.clearWatch(trip_tracker_watch_id);
  $('#trip_tracker_stop').hide();
  $('#trip_tracker_reset').show();
  $('#trip_tracker_inputs').show();
  $('#trip_tracker_message').html('');
  var sailingPathCoordinates = [];
  $.each(trip_tracker_data, function(index, data){
      sailingPathCoordinates.push(new google.maps.LatLng(data.latitude, data.longitude));
      $('#trip_tracker_message').append('<p>' +
        data.date + '<br >' +
        'Latitude: '  + data.latitude + '<br />' +
        'Longitude: ' + data.longitude + '<hr />' +
      '</p>');
  });
  var sailingPath = new google.maps.Polyline({
    path: sailingPathCoordinates,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  sailingPath.setMap(trip_tracker_map);
  return false;
}

function trip_tracker_reset() {
  $('#trip_tracker_start').show();
  $('#trip_tracker_reset').hide();
  $('#trip_tracker_message').html('');
  $('#trip_tracker_inputs').hide();
  $('#trip_tracker_title').val('');
  $('#trip_tracker_body').val('');
  trip_tracker_data = [];
  trip_tracker_map_markers = [];
  trip_tracker_map_initialize();
}

function trip_tracker_success(position) {
  // Add the date and position info to the trip data.
  trip_tracker_data.push({
      'date':js_yyyy_mm_dd_hh_mm_ss(),
      'latitude':position.coords.latitude,
      'longitude':position.coords.longitude,
  });
  // Initialize the map if it hasn't been initialized.
  if (!trip_tracker_map_initialized) {
    trip_tracker_map_initialize();
  }
  // Update the map.
  trip_tracker_add_position_to_map(position.coords.latitude, position.coords.longitude);
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
  // Create new marker from lat/lng, add it to the map, center the map to the
  // marker and save the marker.
  var myLatLng = new google.maps.LatLng(lat, lng);
  var myMarkerOptions = {
    position: myLatLng,
    map: trip_tracker_map
  };
  var marker = new google.maps.Marker(myMarkerOptions);
  trip_tracker_map.setCenter(myLatLng);
  trip_tracker_map_markers.push(marker);
}

