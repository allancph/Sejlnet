var trip_tracker_watch_id = null;

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
  return false;
}

function trip_tracker_stop() {
  navigator.geolocation.clearWatch(trip_tracker_watch_id);
  $('#trip_tracker_stop').hide();
  $('#trip_tracker_start').show();
  return false;
}

function trip_tracker_success(position) {
  $('#trip_tracker_message').prepend('<p>' +
    js_yyyy_mm_dd_hh_mm_ss() + '<br >' +
    'Latitude: '  + position.coords.latitude + '<br />' +
    'Longitude: ' + position.coords.longitude + '<hr />' +
  '</p>');
}

function trip_tracker_error(error) {
  alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

