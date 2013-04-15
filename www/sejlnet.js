var sejlnet_location_timeout = 15000;
var sejlnet_kilometer_range = 200;

// Denmark Default
var sejlnet_location_latitude = 56.139428693863266;
var sejlnet_location_longitude = 12.4365234375;

// Near Allan...
//var sejlnet_location_latitude = 55.5998232;
//var sejlnet_location_longitude = 12.6553198;

// Dragor Lystbadehav
//var sejlnet_location_latitude = 55.590775;
//var sejlnet_location_longitude = 12.679051;

// Hirksholm Havn
//var sejlnet_location_latitude = 57.484228;
//var sejlnet_location_longitude = 10.622709;

// Ann Arbor
//var sejlnet_location_latitude = 42.177000;
//var sejlnet_location_longitude = -83.652000;

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

function sejlnet_render_geo_location_info (position) {
	return position.coords.latitude.toFixed(4) + ", " 
            + position.coords.longitude.toFixed(4) + " +/- " 
            + position.coords.accuracy.toFixed(1) + "m";
}

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKey, false);
}

function onBackKey(e) {
    switch($.mobile.activePage.attr('id')) {
      case "drupalgap_page_dashboard":
    	  navigator.app.exitApp();
    	break;
      case "drupalgap_page_user":
    	  $.mobile.changePage(dg_page_user_back_button_destination);
    	  break;
      default:
    	  history.back(1);
      	break;
    }
}

function js_yyyy_mm_dd_hh_mm_ss () {
  now = new Date();
  year = "" + now.getFullYear();
  month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
