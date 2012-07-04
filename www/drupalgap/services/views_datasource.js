var drupalgap_views_datasource_retrieve = {
		
	"resource_path":"",
	"resource_type":"get",
	"resource_result":"",
	
	/** 
	 * Retrieves a Drupal Views JSON result.
	 * 
	 * views_options.path
	 * 		The path to the views json display.
	 */
	"resource_call":function(caller_options){
		try {
			// TODO - Validate views json display path.
			this.resource_result = null;
			this.resource_path = caller_options.path;
			options = {
				"resource_path":this.resource_path,
				"type":this.resource_type,
				"async":true,
				"error":this.error,
				"success":this.success,
			};
			
			// Attach error/success hooks if provided.
			// TODO - this little snippet is being repeated throughout the
			// service call implementations, this can be improved.
			if (caller_options.error) {
				options.hook_error = caller_options.error;
			}
			if (caller_options.success) {
				options.hook_success = caller_options.success;
			}
			
			// Attach load from local storage option if it was provided.
			if (caller_options.load_from_local_storage != null) {
				options.load_from_local_storage = caller_options.load_from_local_storage;
			}
			
			// Make the call.
			drupalgap_services.resource_call(options);
		}
		catch (error) {
			console.log("drupalgap_views_datasource_retrieve");
			console.log(error);
		}
	},
	
	"error":function (jqXHR, textStatus, errorThrown) {
		console.log("drupalgap_views_datasource_retrieve - " + textStatus + " - " + errorThrown);
	},
	
	"success":function (data) {
	},
	
	/**
	 * Removes a views datasource JSON from local storage.
	 * 
	 * views_options.path
	 * 		The path to the views json display.
	 */
	"local_storage_remove":function(views_options){
		type = this.resource_type;
		resource_path = views_options.path;
		key = drupalgap_services_default_local_storage_key(type,resource_path);
		window.localStorage.removeItem(key);
		console.log("Removed from local storage (" + key + ")");
	},
};