var drupalgap_services_resource_call_result;

//function drupalgap_services_resource_call
var drupalgap_services = {
		
	/*"options":[],*/
	
	/** 
	 * Make a call to a Drupal Service Resource.
	 * 
	 * options.resource_path
	 * 		The path to the resource (required)
	 * options.site_path
	 * 		The full site path (default: drupalgap_settings.site_path)
	 * options.base_path
	 * 		The drupal base path (default: drupalgap_settings.base_path)
	 * options.endpoint
	 * 		The endpoint name (default : drupalgap_settings.services_endpoint_default),
	 *      Set to 'drupalgap_none' to not use any endpoint.
	 * options.type
	 * 		The method to use: get, post (default), put, delete
	 * options.dataType
	 * 		The data type to use in the ajax call (default: json)
	 * options.data
	 * 		The data string to send with the ajax call (optional)
	 * options.load_from_local_storage
	 * 		Load service resource call from local storage.
	 * 		"0" = force reload from service resource
	 * 		"1" = grab from local storage if possible
	 * options.save_to_local_storage
	 * 		Load service resource call from local storage.
	 * 		"0" = force reload from service resource
	 * 		"1" = grab from local storage if possible
	 * options.local_storage_key
	 * 		The key to use when storing the service resource call result
	 * 		in local storage. Default key formula: [options.type].[service_resource_call_url]
	 * 		For example, a POST on the system connect resource would have a default key of 
	 * 		post.http://www.drupalgap.org/?q=drupalgap/system/connect.json
	 * options.local_storage_expire
	 * 		An integer value indicating how many seconds the resource call result should
	 *      try to load from local storage. For example, pass in 86400 (60*60*24 = 1 day) and
	 *      the function will try to return the resource call result from local storage 
	 *      if it has not been 86400 seconds since the last time it retrieved the result from
	 *      the server.
	 * options.async
	 * 		Whether or not to make the service call asynchronously.
	 * 		false - make the call synchronously (default) - TODO default should be true
	 * 		true - make the call asynchronously
	 * options.error
	 * 		The error call back function.
	 * options.success
	 * 		The success call back function.
	 * options.hook_error
	 * 		The user's error call back function.
	 * options.hook_success
	 * 		The user's success call back function.
	 */
	"resource_call":function (options) {
		
		// Clear previous service call result stored in global variable.
		drupalgap_services_resource_call_result = null;
		result = null;
		
		try {
			
			// Validate options.
			// TODO - need to validate all other options and turn this into a function.
			if (!options.resource_path) {
				console.log("resource_call - no resource_path provided");
				return false;
			}
			
			// Get the default options (this does not override any options passed in).
			options = drupalgap_services_resource_get_default_options(options);
			
			// If this call is going to be asynchronous, we need to make sure a
			// success and failure call back function where included.
			if (options.async) {
				if (!options.success) {
					console.log("resource_call - no success callback provided");
					return false;
				}
				if (!options.error) {
					console.log("resource_call - no error callback provided");
					return false;
				}
			}
			
			// Build URL to service resource.
			service_resource_call_url = drupalgap_services_resource_url(options);
			
			// Set default data string if one wasn't provided.
			if (!options.data) {
				options.data = "";
			}
			
			// Attach caller options load-from/save-to local storage options if provided.
			if (options.caller_options != null && options.caller_options.load_from_local_storage != null) {
				options.load_from_local_storage = options.caller_options.load_from_local_storage;
			}
			if (options.caller_options != null && options.caller_options.save_to_local_storage != null) {
				options.save_to_local_storage = options.caller_options.save_to_local_storage;
			}
			
			// If no load_from_local_storage option was set, set the default.
			if (options.load_from_local_storage == null) {
				console.log("NOT instructed on load_from_local_storage (" + options.load_from_local_storage + ")");
				options = drupalgap_services_get_load_from_local_storage_default(options);
			}
			else {
				console.log("instructed on load_from_local_storage (" + options.load_from_local_storage + ")");
			}
			
			// If no save to local storage option has been set, set the default.
			// TODO - this doesn't work properly, if the user passes in false, there setting is
			// ignored and the default function is called below. This is probably true for
			// all variables set in this manner around here.
			// UPDATE - this might be fixed now, see the caller_options attachments above... it is a little sloppy though.
			if (options.save_to_local_storage == null) {
				console.log("NOT instructed on save_to_local_storage (" + options.save_to_local_storage + ")");
				options = drupalgap_services_get_save_to_local_storage_default(options);
			}
			else {
				console.log("instructed on save_to_local_storage (" + options.save_to_local_storage + ")");
			}
			
			// Set default local storage key if one wasn't provided and
			// we are saving to local storage.
			if (!options.local_storage_key && options.save_to_local_storage) {
				options.local_storage_key = drupalgap_services_default_local_storage_key(options.type,options.resource_path,options.data);
			}
			
			// Print service resource call debug info to console.
	    	console.log(JSON.stringify({"path":service_resource_call_url,"options":options}));
			
			// If we are attempting to load the service resource result call from
			// local storage, do it now, unless an expiration time was supplied then
			// turn off the load from local storage bit and continue with resource call.
			if (options.load_from_local_storage == "1" || options.load_from_local_storage == true) {
				if (options.local_storage_expire) {
					// TODO - there should be a default cache life time specified
					// in the drupal gap settings, that way stuff will eventually get 
					// loaded again by default.
					
					// What time is it now (in secconds)?
					var d = new Date();
					var time_now = Math.floor(d.getTime()/1000);
					// Load the expiration cache key from local storage so we
					// know what time this result was placed into local storage.
					var dg_cache_key = "dg_cache_" + options.local_storage_key;
					var dg_cache_local_storage_item = window.localStorage.getItem(dg_cache_key);
					if (dg_cache_local_storage_item != null) {
						var dg_cache_keycreated_time = JSON.parse(dg_cache_local_storage_item);
						// Compute how long the item should remain in local storage.
						var how_long = dg_cache_keycreated_time + options.local_storage_expire;
						// If that time has passed, then we'll overwrite the load from local
						// storage option and continue execution as normal.
						if (time_now > how_long) {
							console.log("local storage cache has expired on resource");
							options.load_from_local_storage = "0";
						}
						else {
							// It hasn't yet expired, load it from local storage.
							console.log("local storage cache has NOT expired on resource");
							result = window.localStorage.getItem(options.local_storage_key);
						}
					}
				}
				else {
					result = window.localStorage.getItem(options.local_storage_key);
				}
			}
			
			// Save the current options in drupalgap_services.options for backup.
			// (this is needed by the error/success async call backs)
			/*if (!this.options) {
				this.options = [];
			}
			this.options.push(options);*/
			
			// If we loaded the service resource result from local storage,
			// parse it out, otherwise make the service resource call.
			if (result) {
				console.log("loaded service resource from local storage (" + options.local_storage_key +")");
				result = JSON.parse(result);
				
				// If the call is async, then we need to send this result back
				// to the success call back function(s). If it wasn't async,
				// then return the result to the caller.
				if (options.async) {
					options.success(result);
					if (options.hook_success) {
						options.hook_success(result);
					}
				}
				// Return the result if the call was not async.
				else {
					return result;
				}
			}
			else {
				
				// Make the call, synchronously or asynchronously...
				
			    if (options.async == false) {
			    	
			    	// Synchronously.
				    $.ajax({
					      url: service_resource_call_url,
					      type: options.type,
					      data: options.data,
					      dataType: options.dataType,
					      contentType:options.contentType,
					      async: options.async,
					      error: function (jqXHR, textStatus, errorThrown) {
				    			result = {
				    				"jqXHR":jqXHR,
				    				"textStatus":textStatus,
				    				"errorThrown":errorThrown,
				    			};
					      },
					      success: function (data) {
					    	  result = data;
					      }
				    });
				    
				    // Print service resource call debug info to console.
				    console.log(JSON.stringify(result));
				    
				    // If there wasn't an error from the service call...
				    if (!result.errorThrown) {
				    	
				    	// Save the result to local storage, if necessary.
				    	if (options.save_to_local_storage == "1") {
				    		window.localStorage.setItem(options.local_storage_key, JSON.stringify(result));
				    		console.log("saving service resource to local storage (" + options.local_storage_key +")");
				    	}
				    	else {
				    		console.log("NOT saving service resource to local storage (" + options.local_storage_key +")");
				    	}
						
				    	// Clean up service resource result local storage dependencies.
				    	drupalgap_services_resource_clean_local_storage_dependencies(options);
				    	
				    }
				    
				    // Save a copy of the service resource call result in the
			    	// global variable in case anybody needs it.
			    	drupalgap_services_resource_call_result = result;
			    	
			    	return drupalgap_services_resource_call_result;
			    	
				}
				else {
					
					// Asynchronously...
					
					// Show the page loading message.
					$.mobile.showPageLoadingMsg();
					
					// Setup ajax options.
					ajax_options = {
				      url: service_resource_call_url,
				      type: options.type,
				      data: options.data,
				      dataType: options.dataType,
				      contentType:options.contentType,
				      async: options.async,
				      error: options.error,
				      success: options.success
				    };
					
					// If error/success call back hooks were provided, chain them
					// onto the error and success call back function options.
					if (options.hook_error) {
						ajax_options.error = [options.error,options.hook_error];
					}
					if (options.hook_success) {
						ajax_options.success = [options.success,options.hook_success];
					}
					
					// Add core error and success call backs to front of queue so
					// local storage can be taken care of properly. If the options
					// are already arrays, that means chaining has been setup,
					// otherwise setup an array of call back functions.
					if (ajax_options.error) {
						if (Object.prototype.toString.call(ajax_options.error) === '[object Array]') {
							//console.log("error option was an array, adding default error call back to front");
							ajax_options.error.unshift(this.resource_call_error);
						}
						else {
							//console.log("error option was NOT array, creating array and adding default error call back to front");
							ajax_options.error = [this.resource_call_error,options.error];
						}
					}
					if (ajax_options.success) {
						if (Object.prototype.toString.call(ajax_options.success) === '[object Array]') {
							//console.log("success option was an array, adding default success call back to front");
							ajax_options.success.unshift(this.resource_call_success);
						}
						else {
							//console.log("success option was NOT array, creating array and adding default error call back to front");
							ajax_options.success = [this.resource_call_success,options.success];
						}
					}
					//console.log(JSON.stringify(ajax_options.error));
					//console.log(JSON.stringify(ajax_options.success));
					
					// Append the current options onto the ajax options so they will be available
					// in the success callback (and not be overwritten by any other async calls)
					ajax_options.drupalgap_options = options;
					
					// Make the asynchronous service call.
					$.ajax(ajax_options);
				}
			    
			}
		}
		catch (error) {
			console.log("resource_call - " + error);
			console.log(JSON.stringify(options));
		}
	},
	
	/* Asynchronous ajax error call back function. */
	"resource_call_error":function (jqXHR, textStatus, errorThrown) {

		// Log the error to the console.
		result = {
			"jqXHR":jqXHR,
			"textStatus":textStatus,
			"errorThrown":errorThrown,
		};
		console.log(JSON.stringify(result));

		// Alert the user.
		if (errorThrown) { alert(errorThrown); }
		else { alert(textStatus); }

	},
	
	/* Asynchronous ajax success call back function. */
	"resource_call_success":function (data) {
		
		// Hide the page loading message.
		$.mobile.hidePageLoadingMsg(); 
		
		// Print data to console.
		//console.log(JSON.stringify($(this)));
		console.log(JSON.stringify(data));
		//console.log(JSON.stringify(options));
		
		// Extract the drupalgap options before the service call was made.
		drupalgap_options = $(this)[0].drupalgap_options;
		//console.log(JSON.stringify(drupalgap_options));
		
		// TODO - Understand why the options variable is available here,
		// and why the this.options approach didn't work as expected earlier.
		// TODO - Update, see note below about drupalgap_options being overwritten
		// before due to more than one async call happening.
		
		// Save the result to local storage, if necessary.
		if (drupalgap_options.save_to_local_storage == "1") {
			window.localStorage.setItem(drupalgap_options.local_storage_key, JSON.stringify(data));
			console.log("saving service resource to local storage (" + drupalgap_options.local_storage_key +")");
			
			// Record the time (in seconds) at which this resource result was
			// placed into local storage.
			var d = new Date();
			var created = Math.floor(d.getTime()/1000);
			var dg_cache_key = "dg_cache_" + drupalgap_options.local_storage_key;
			window.localStorage.setItem(dg_cache_key,created);
			console.log("generated local storage cache creation data");
			console.log(JSON.stringify(JSON.parse(window.localStorage.getItem(dg_cache_key))));
		}
		else {
			console.log("NOT saving service resource to local storage (" + drupalgap_options.local_storage_key +")");
		}
		
		// Clean up service resource result local storage dependencies.
		drupalgap_services_resource_clean_local_storage_dependencies(drupalgap_options);
	}
};

/* 
 * Returns a URL to the service resource based on the incoming options.
 * 
 * options.resource_path
 * 		The path to the resource (required)
 * options.site_path
 * 		The full site path (default: drupalgap_settings.site_path)
 * options.base_path
 * 		The drupal base path (default: drupalgap_settings.base_path)
 * options.endpoint
 * 		The endpoint name (default : drupalgap_settings.services_endpoint_default)
*/
function drupalgap_services_resource_url(options) {
	// Set default values for options if none were provided.
	if (!options.site_path) {
		options.site_path = drupalgap_settings.site_path;
	}
	if (!options.base_path) {
		options.base_path = drupalgap_settings.base_path;
	}
	// Set the default endpoint if one wasn't provided, except if
	// explicitly leaving out endpoint with 'drupalgap_none' flag.
	if (!options.endpoint) {
		options.endpoint = drupalgap_settings.services_endpoint_default;
	}
	else if (options.endpoint == "drupalgap_none") {
		options.endpoint = "";
	}
	url = options.site_path + options.base_path + options.endpoint + "/" + options.resource_path;
	console.log(url);
	return url;
}

/*
 * Returns a string key for local storage of a service call result.
 * 
 * type
 * 		The method to use: get, post, put, delete
 * url
 * 		The full URL to the service resource. (e.g. system/connect.json)
 */
function drupalgap_services_default_local_storage_key(type,resource_path,data) {
	key = type + "." + resource_path;
	if (data) {
		key += "." + data;
	}
	return key;
}

function drupalgap_services_resource_get_default_options(options) {
	// Set default values for options if none were provided.
	if (!options.site_path) {
		options.site_path = drupalgap_settings.site_path;
	}
	if (!options.base_path) {
		options.base_path = drupalgap_settings.base_path;
	}
	if (!options.endpoint) {
		options.endpoint = drupalgap_settings.services_endpoint_default;
	}
	if (!options.type) {
		options.type = "post";
	}
	if (!options.data) {
		options.data = "";
	}
	if (!options.dataType) {
		options.dataType = "json";
	}
	// Only set this up if the user provided it.
	if (!options.contentType && options.caller_options != null && options.caller_options.contentType != null) {
		options.contentType = "application/json";
	}
	if (!options.async) {
		options.async = false;
	}
	return options;
}

function drupalgap_services_get_load_from_local_storage_default(options) {
	// If no load_from_local_storage option was set, set the default.
	// for best performance based on the service resource call.
	
	// TODO - Use regex here instead of indexOf to avoid collisions.
	// TODO - This needs to be smarter, for example this is getting set when the node
	// is saved or deleted, which isn't necessarily the best for performance. I think we
	// need to add some kind of 'op' parameter similar to what Drupal uses to handle
	// special cases like this.
	
	// Determine cases where we do not want to load from local
	// storage here.
	switch (options.type.toLowerCase()) {
		case "get":
			// Node retrieve resource.
			if (options.resource_path.indexOf("node/") != -1) {
				if ($.mobile.activePage.attr('id') == "drupalgap_page_node_edit") {
						options.load_from_local_storage = "0";
				}
			}
			// Comment retrieve resource.
			else if (options.resource_path.indexOf("comment/") != -1) {
				if ($.mobile.activePage.attr('id') == "drupalgap_page_comment_edit") {
						options.load_from_local_storage = "0";
				}
			}
			// User retrieve resource.
			else if (options.resource_path.indexOf("user/") != -1) {
				if ($.mobile.activePage.attr('id') == "drupalgap_page_user_edit") {
						options.load_from_local_storage = "0";
				}
			}
			break;
		case "post":
			// User login/logout/register resources.
			if (
				options.resource_path.indexOf("user/login") != -1 || 
				options.resource_path.indexOf("user/logout") != -1 ||
				options.resource_path.indexOf("user/register") != -1
			) {
			}
			// Node create resource.
			else if (options.resource_path.indexOf("node.json") != -1) {
			}
			// Comment create resource.
			else if (options.resource_path.indexOf("comment.json") != -1) {
			}
			break;
		case "put":
			// User update resource.
			if (options.resource_path.indexOf("user/") != -1) {
			}
			// Node update resource.
			else if (options.resource_path.indexOf("node/") != -1) {
			}
			// Comment update resource.
			else if (options.resource_path.indexOf("comment/") != -1) {
			}
			break;
		case "delete":
			// Node delete resource.
			if (options.resource_path.indexOf("node/") != -1) {
			}
			break;		
	}
	
	// If we still haven't made a decision on whether or not to
	// try and load from local storage, do it now.
	if (!options.load_from_local_storage) {
		// We assume we will try to load from local storage.
		options.load_from_local_storage = "1";
	}
	if (options.load_from_local_storage == "0") {
		console.log("services.js - decided NOT to load from local storage");
	}
	
	return options;
}

// Set the default save to local storage option.
// TODO - Regex needs to be used instead of indexOf here.
// TODO - The decision to save something into local storage
// here needs to be more intelligent. i.e. In offline mode
// we would want to store in local storage. Basically, we know
// 'put', 'delete' and some 'post' calls don't need local storage
// unless in offline mode. Right now the C.U.D. implementations
// decide this setting which is ok, but we could bring that decision into
// here so the C.U.D. implementations are cleaner.
function drupalgap_services_get_save_to_local_storage_default(options) {
	switch (options.type.toLowerCase()) {
		case "get":
			break;
		case "post":
			// User login/logout/register resources.
			if (
				options.resource_path.indexOf("user/login") != -1 || 
				options.resource_path.indexOf("user/logout") != -1 ||
				options.resource_path.indexOf("user/register") != -1
			) {
				options.save_to_local_storage = "0";
			}
			// Node create resource.
			else if (options.resource_path.indexOf("node.json") != -1) {
				options.save_to_local_storage = "0";
			}
			// Comment create resource.
			else if (options.resource_path.indexOf("comment.json") != -1) {
				options.save_to_local_storage = "0";
			}
			break;
		case "put":
			options.save_to_local_storage = "0";
			break;
		case "delete":
			options.save_to_local_storage = "0";
			break;
	}
	
	// If we didn't figure out whether or not to save the result to
	// local storage, we'll assume it is OK to save to local storage.
	if (!options.save_to_local_storage) {
		options.save_to_local_storage = "1";
	}
	if (options.save_to_local_storage == "0") {
		console.log("services.js - decided NOT to save in local storage");
	}
	
	return options;
}

function drupalgap_services_resource_clean_local_storage_dependencies(options) {
	// If this service resource call has local storage items dependent on
	// result, then remove those items from local storage.
	/* Stuff with dependents:
	 * 		user: create/update/delete/login/logout/registration
	 * 		node: create/update/delete
	 * 		comment: create/update/delete
	 */
	// TODO - Need to use regex here instead of indexOf...
	// TODO - Our JS implementation of these service resources
	// should include an array variable that allows us to stack
	// a list of local storage keys, that way this dependency
	// removal mechanism can be more dynamic/automated.
	console.log("drupalgap_services_resource_clean_local_storage_dependencies");
	console.log(JSON.stringify(options));
	switch (options.type.toLowerCase()) {
		case "get":
			break;
		case "post":
			// User login/logout/register resources.
			if (
				options.resource_path.indexOf("user/login") != -1 || 
				options.resource_path.indexOf("user/logout") != -1 ||
				options.resource_path.indexOf("user/register") != -1
			) {
				// system/connect.json
				drupalgap_services_system_connect.local_storage_remove();
				// drupalgap_system/connect.json
				drupalgap_services_resource_system_connect.local_storage_remove();
			}
			// Node create resource.
			else if (options.resource_path.indexOf("node.json") != -1) {
				// Remove views datasource content json.
				views_options = {"path":"views_datasource/drupalgap_content"};
				drupalgap_views_datasource_retrieve.local_storage_remove(views_options);
			}
			// Comment create resource.
			else if (options.resource_path.indexOf("comment.json") != -1) {
				// Remove views datasource comment json.
				views_options = {"path":"views_datasource/drupalgap_comments"};
				drupalgap_views_datasource_retrieve.local_storage_remove(views_options);
				// Remove the comment's node comment views json.
				views_options = {"path":"views_datasource/drupalgap_comments/" + options.nid};
				drupalgap_views_datasource_retrieve.local_storage_remove(views_options);
				// Remove the comment's node.
				drupalgap_services_node_retrieve.local_storage_remove({"nid":options.nid});
			}
			break;
		case "put":
			// User update resource.
			if (options.resource_path.indexOf("user/") != -1) {
				// Remove system/connect.json.
				drupalgap_services_system_connect.local_storage_remove();
				// Remove drupalgap_system/connect.json.
				drupalgap_services_resource_system_connect.local_storage_remove();
				// TODO - User id validation here.
				drupalgap_services_user_retrieve.local_storage_remove({"uid":options.uid});
			}
			// Node update resource.
			else if (options.resource_path.indexOf("node/") != -1) {
				// Remove the node from local storage.
				// TODO - Node id validation here.
				drupalgap_services_node_retrieve.local_storage_remove({"nid":options.nid});
				// Remove views datasource content json.
				views_options = {"path":"views_datasource/drupalgap_content"};
				drupalgap_views_datasource_retrieve.local_storage_remove(views_options);
			}
			// Comment update resource.
			else if (options.resource_path.indexOf("comment/") != -1) {
				// Remove the comment from local storage.
				// TODO - Comment id validation here.
				drupalgap_services_comment_retrieve.local_storage_remove({"cid":options.cid});
				// Remove views datasource comment json.
				views_options = {"path":"views_datasource/drupalgap_comments"};
				drupalgap_views_datasource_retrieve.local_storage_remove(views_options);
				// Remove the comment's node from local storage.
				// TODO - Node id validation here.
				drupalgap_services_node_retrieve.local_storage_remove({"nid":options.nid});
				// Remove views datasource comments json.
				views_options = {"path":"views_datasource/drupalgap_comments/" + options.nid};
				drupalgap_views_datasource_retrieve.local_storage_remove(views_options);
			}
			break;
		case "delete":
			// Node delete resource.
			if (options.resource_path.indexOf("node/") != -1) {
				// Remove the node from local storage.
				// TODO - Node id validation here.
				drupalgap_services_node_retrieve.local_storage_remove({"nid":options.nid});
				// Remove views datasource content json.
				views_options = {"path":"views_datasource/drupalgap_content"};
				drupalgap_views_datasource_retrieve.local_storage_remove(views_options);
				// Remove views datasource comment json.
				views_options = {"path":"views_datasource/drupalgap_comments"};
				drupalgap_views_datasource_retrieve.local_storage_remove(views_options);
				// TODO - remove any comments from this node from local storage.
			}
			// Comment delete resource.
			else if (options.resource_path.indexOf("comment/") != -1) {
				// Remove the comment from local storage.
				// TODO - Comment id validation here.
				drupalgap_services_comment_retrieve.local_storage_remove({"cid":options.cid});
				// Remove views datasource comment json.
				views_options = {"path":"views_datasource/drupalgap_comments"};
				drupalgap_views_datasource_retrieve.local_storage_remove(views_options);
				// Remove the comment's node from local storage.
				// TODO - Node id validation here.
				drupalgap_services_node_retrieve.local_storage_remove({"nid":options.nid});
				// Remove views datasource comments json.
				views_options = {"path":"views_datasource/drupalgap_comments/" + options.nid};
				drupalgap_views_datasource_retrieve.local_storage_remove(views_options);
			}
			break;
	}
}