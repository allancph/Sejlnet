/**
 * Handles the register page show event.
 *
 */
$('#drupalgap_page_user_register').live('pageshow',function(){
  try {
	    if (drupalgap_user.uid != 0) {
          alert("Du er allerede logget ind!");
          $.mobile.changePage("dashboard.html", "slideup");
        }
  }
  catch (error) {
	  console.log("drupalgap_page_user_register - " + error);
  }
});

/**
 * Handles the submission of the user registration form.
 *
 */
$('#drupalgap_user_register_submit').live('click',function() {
	
	try {
	  
	  // Grab name and validate it.
	  var name = $('#drupalgap_user_register_name').val();
	  if (!name) { alert('Skriv dit brugernavn.'); return false; }
	  
	  // Grab mail and validate it.
	  var mail = $('#drupalgap_user_register_mail').val();
	  if (!mail) { alert('Skriv din email.'); return false; }
	  
	  // Grab passwords, compare and validate. 
	  var pass = $('#drupalgap_user_register_pass').val();
	  if (!pass) { alert('Skriv dit kodeord.'); return false; }
	  var pass2 = $('#drupalgap_user_register_confirm_pass').val();
	  if (!pass2) { alert('Bekræft din kodeord.'); return false; }
	  if (pass != pass2) { alert("Kodeord er ikke ens."); return false; }
	  
	  // Build service call options.
	  //user_registration = drupalgap_services_user_register(name,mail,pass);
	  options = {
		"name":name,
		"mail":mail,
		"pass":pass,
		
		"error":function(jqXHR, textStatus, errorThrown) {
			if (errorThrown) {
				alert(errorThrown);
			}
			else {
				alert(textStatus);
			}
	  	},
	  	
		"success":function(data){
	  	  
	  	  if (data._user_resource_create.uid) {
	  		  
	  		  // User registration was successful...
	  		  
			  // Show message depending on site's user registration settings.
			  site_name = drupalgap_site_settings.variable.site_name;
			  
			  // Who can create accounts?
			  // TODO - take into account the 'require e-mail verification when a
			  // visitor creates an account' checkbox on the drupal site
			  switch (drupalgap_site_settings.variable.user_register) {
				case 1: // Visitors
				case "1":
					alert("Du er registreret. Check din email for aktiveret din konto..");
					break;
				case 2: // Visitors, but administrator approval is required
				case "2":
					alert("Registration complete! An administrator from " + site_name  + " must now approve your new account.");
					break;
				default:
					alert("Du er registreret!"); // TODO - this should be more informative, instruct user what's next.
					break;
			  }
			  
			  $.mobile.changePage("dashboard.html", "slideup");
			  
	  	  }
		  
	  	  else {
			// User registration was not successful...
			  
			// Clear any existing messages.
			$('#drupalgap_page_user_register_messages').html("");
			
			// Show error messages.
			$.each(user_registration.form_errors,function(field,message){
				$('#drupalgap_page_user_register_messages').append("<li>" + message + "</li>"); 
			});
			$('#drupalgap_page_user_register_messages').show();
			
		  }
	  	  
	  	},
	  };
	  
	  // Make the service call.
	  //drupalgap_services_user_register.resource_call(options);
	  drupalgap_services_drupalgap_user_register.resource_call(options);
	}
	catch (error) {
	  console.log("drupalgap_user_register_submit - " + error);
	  alert("drupalgap_user_register_submit - " + error);
	}
	
  return false; // stop the click from executing any further
  
});