package sejlnet.phonegap.com;

import android.app.Activity;
import android.content.Context;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

public class ShowLocationActivity extends Activity implements LocationListener {
  //private TextView latituteField;
  //private TextView longitudeField;
  private LocationManager locationManager;
  private String provider;

  
/** Called when the activity is first created. */

  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);
    //latituteField = (TextView) findViewById(R.id.TextView02);
    //longitudeField = (TextView) findViewById(R.id.TextView04);

    // Get the location manager
    Log.d("SEJLNET", "Creating locaction manager...");
    locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
    Log.d("SEJLNET", "Created locaction manager.");
    // Define the criteria how to select the locatioin provider -> use
    // default
    Log.d("SEJLNET", "Creating criteria...");
    Criteria criteria = new Criteria();
    Log.d("SEJLNET", "Created criteria.");
    Log.d("SEJLNET", "Creating provider...");
    provider = locationManager.getBestProvider(criteria, false);
    Log.d("SEJLNET", "Created provider.");
    Log.d("SEJLNET", "Creating locaction...");
    Location location = locationManager.getLastKnownLocation(provider);
    Log.d("SEJLNET", "Created locaction.");

    // Initialize the location fields
    if (location != null) {
      Log.d("SEJLNET", "Provider " + provider + " has been selected.");
      System.out.println("Provider " + provider + " has been selected.");
      onLocationChanged(location);
    } else {
      Log.d("SEJLNET", "Location not available!");
      //latituteField.setText("Location not available");
      //longitudeField.setText("Location not available");
    }
  }

  /* Request updates at startup */
  /*@Override
  protected void onResume() {
    super.onResume();
    locationManager.requestLocationUpdates(provider, 400, 1, this);
  }*/

  /* Remove the locationlistener updates when Activity is paused */
  /*@Override
  protected void onPause() {
    super.onPause();
    locationManager.removeUpdates(this);
  }*/

  @Override
  public void onLocationChanged(Location location) {
    int lat = (int) (location.getLatitude());
    int lng = (int) (location.getLongitude());
    //latituteField.setText(String.valueOf(lat));
    //longitudeField.setText(String.valueOf(lng));
  }

  @Override
  public void onStatusChanged(String provider, int status, Bundle extras) {
    // TODO Auto-generated method stub

  }

  @Override
  public void onProviderEnabled(String provider) {
    Toast.makeText(this, "Enabled new provider " + provider,
        Toast.LENGTH_SHORT).show();

  }

  @Override
  public void onProviderDisabled(String provider) {
    Toast.makeText(this, "Disabled provider " + provider,
        Toast.LENGTH_SHORT).show();
  }
}

