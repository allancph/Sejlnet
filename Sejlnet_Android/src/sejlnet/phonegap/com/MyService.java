package sejlnet.phonegap.com;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONException;
import org.json.JSONObject;

import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Looper;
import android.util.Log;

import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;

public class MyService extends BackgroundService {
	
	//private final static String TAG = MyService.class.getSimpleName();
	private final static String TAG = "SEJLNET";
	
	private String mHelloTo = "World";
	
	private ShowLocationActivity locationActivity;

	@Override
	protected JSONObject doWork() {
		JSONObject result = new JSONObject();
		
		try {
			SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss"); 
			String now = df.format(new Date(System.currentTimeMillis())); 

			String msg = "Hello " + this.mHelloTo + " - its currently " + now;
			result.put("Message", msg);

			Log.d(TAG, msg);
		} catch (JSONException e) {
		}
		
		return result;	
	}

	@Override
	protected JSONObject getConfig() {
		JSONObject result = new JSONObject();
		
		try {
			result.put("HelloTo", this.mHelloTo);
		} catch (JSONException e) {
		}
		
		return result;
	}

	@Override
	protected void setConfig(JSONObject config) {
		try {
			if (config.has("HelloTo"))
				this.mHelloTo = config.getString("HelloTo");
		} catch (JSONException e) {
		}
		
	}     

	@Override
	protected JSONObject initialiseLatestResult() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected void onTimerEnabled() {
		// TODO Auto-generated method stub
		runOnUiThread(new Runnable() {
        public void run() {
            Log.d("SEJLNET", "creating LocationManager");
            LocationManager mlocManager = (LocationManager)getSystemService(Sejlnet.this.LOCATION_SERVICE);
            LocationListener mlocListener = new MyLocationListener();
            mlocManager.requestLocationUpdates( LocationManager.GPS_PROVIDER, 0, 0, mlocListener);
            //locationActivity = new ShowLocationActivity(this);
            /*Intent intent = new Intent(this, ShowLocationActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);*/
            Log.d("SEJLNET", "created LocationManager");
        }
    });
	}

	@Override
	protected void onTimerDisabled() {
		// TODO Auto-generated method stub
		
	}


}

