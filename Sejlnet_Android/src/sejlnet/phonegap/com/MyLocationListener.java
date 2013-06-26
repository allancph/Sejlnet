package sejlnet.phonegap.com;

import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;
import android.util.Log;

public class MyLocationListener implements LocationListener

{

@Override

public void onLocationChanged(Location loc)

{

loc.getLatitude();

loc.getLongitude();

String Text = "My current location is: " +

"Latitud = " + loc.getLatitude() +

"Longitud = " + loc.getLongitude();

Log.d("SEJLNET", Text);

}


@Override

public void onProviderDisabled(String provider)

{


}


@Override

public void onProviderEnabled(String provider)

{


}


@Override

public void onStatusChanged(String provider, int status, Bundle extras)

{


}

}/* End of Class MyLocationListener */