document.addEventListener("DOMContentLoaded",function() {

// .________________________.
// ||			           ||
// ||        Sign In       ||
// ||______________________||
// '			            '

	var signedIn = true;
	var userDropdown = document.getElementById("user-dropdown");
	var profilePic = document.getElementById("profile");
	var signinLink = document.getElementById("signin-link");

	if (signedIn) {
		userDropdown.style.display = "block";
		profilePic.style.display = "block";
		signinLink.style.display = "none";
	} else {
		userDropdown.style.display = "none";
		profilePic.style.display = "none";
		signinLink.style.display = "block";
	}

});