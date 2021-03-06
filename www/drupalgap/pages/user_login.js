var user_login_destination = '';
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
        var message = '';
        if (jqXHR.responseText) { message += jqXHR.responseText; }
        else if (textStatus) { message += textStatus; }
        $('#drupalgap_page_user_login_messages').html(message).show(); // show user result error msg
        $('#drupalgap_user_login_pass').val(""); // clear password field
      },
      "success":function () {
        if (user_login_destination != '') {
          var where_to = user_login_destination;
          user_login_destination = '';
          $.mobile.changePage(where_to, "slideup");  
        }
        else {
          $.mobile.changePage("dashboard.html", "slideup");
        }
      }
	  };
	  drupalgap_services_drupalgap_user_login.resource_call(options);
	}
	catch (error) {
	  console.log("drupalgap_user_login_submit - " + error);
	}
	
  return false; // stop the click from executing any further
  
});