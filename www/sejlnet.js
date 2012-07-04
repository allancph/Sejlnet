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