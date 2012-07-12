/**
 * Handles the login page show event.
 *
 */
$('#drupalgap_page_user_login').live('pageshow',function(){
  try {
	  	// if user is already logged in, send them to the dashboard
	    if (drupalgap_user.uid != 0) {
          alert("Du er allerede logget ind!");
          $.mobile.changePage("dashboard.html", "slideup");
          return;
        }
  }
  catch (error) {
	  console.log("drupalgap_page_user_login");
	  console.log(error);
  }
});

/**
 * Handles the submission of the user login form.
 *
 */
$('#drupalgap_user_login_submit').live('click',function() {
	
	try {
	  
	  // grab name and validate it
	  var name = $('#drupalgap_user_login_name').val();
	  if (!name) { alert('Skriv dit brugernavn.'); return false; }
	  
	  // grab pass and validate it
	  var pass = $('#drupalgap_user_login_pass').val();
	  if (!pass) { alert('Skriv dit kodeord.'); return false; }
	  
	  // Make call to the bundled user login service resource.
	  options = {
		"name":name,
		"pass":pass,
		"error":function (jqXHR, textStatus, errorThrown) {
		  	console.log(JSON.stringify(errorThrown));
			console.log(JSON.stringify(textStatus));
			$('#drupalgap_page_user_login_messages').html(drupalgap_services_resource_call_result.errorThrown).show(); // show user result error msg
			$('#drupalgap_user_login_pass').val(""); // clear password field
		},
		"success":function () {
			$.mobile.changePage("dashboard.html", "slideup");
		}
	  };
	  //drupalgap_services_user_login.resource_call(options);
	  drupalgap_services_drupalgap_user_login.resource_call(options);

	}
	catch (error) {
	  console.log("drupalgap_user_login_submit - " + error);
	}
	
  return false; // stop the click from executing any further
  
});