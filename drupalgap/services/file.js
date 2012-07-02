var drupalgap_services_file_create = {
	"resource_path":"file.json",
	"resource_type":"post",
	"resource_call":function (caller_options) {
		try {
			
			// Build options for service call.
			options = {
				"resource_path":this.resource_path,
				"type":this.resource_type,
				"data":caller_options.data,
				"async":true,
				"load_from_local_storage":false,
				"save_to_local_storage":false,
				"success":this.success,
				"error":this.error
			};
			
			// Attach error/success hooks if provided.
			if (caller_options.error) {
				options.hook_error = caller_options.error;
			}
			if (caller_options.success) {
				options.hook_success = caller_options.success;
			}
			
			// Make the service call to the node create resource.
			drupalgap_services.resource_call(options);
		}
		catch (error) {
			console.log("drupalgap_services_file_create - " + error);
		}
	},
	"error":function (jqXHR, textStatus, errorThrown) {
		console.log("drupalgap_services_file_create - " + textStatus + " - " + errorThrown);
	},
	
	"success":function (data) {
		console.log(JSON.stringify(data));
	},
}; 