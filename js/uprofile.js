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

// .________________________.
// ||			           ||
// ||    Change Profile    ||
// ||______________________||
// '			            '

var changeButton = document.querySelector("#change-image-btn");
changeButton.addEventListener("click", changeProfile);

function changeProfile() {
	var mediaInput = document.createElement("input");
	mediaInput.type = "file";
	mediaInput.accept = "image/*";
	mediaInput.style.display = "none";
  
	mediaInput.addEventListener("change", function (event) {
	  var file = event.target.files[0];
	  var reader = new FileReader();
  
	  reader.onload = function (e) {
		var newProfilePic = document.getElementById("profile-pic");
		newProfilePic.src = e.target.result;
		var newProfile = document.getElementById("profile");
		newProfile.src = e.target.result;
	  };
  
	  reader.readAsDataURL(file);
	});
  
	mediaInput.click();
  }


// .________________________.
// ||			           ||
// ||     Click Filter     ||
// ||______________________||
// '			            '

	var filterButtons = document.querySelectorAll(".filter");
	
	filterButtons.forEach(function(button) {
		button.addEventListener("click", clickFilter);
	});

	var overviewButton = document.querySelector(".filter[data-filter='overview']");
	overviewButton.classList.add("clicked");

	var containers = document.querySelectorAll("#overview-container > div[id$='-view']");

	containers.forEach(function(container) {
		container.style.display = "none";
	});

	var overviewContainer = document.getElementById("overview-view");
	overviewContainer.style.display = "block";

	function clickFilter() {
	var filterType = this.getAttribute("data-filter");

	filterButtons.forEach(function(button) {
		button.classList.remove("clicked");
	});

	this.classList.add("clicked");

	containers.forEach(function(container) {
		container.style.display = "none";
	});

	var selectedContainer = document.getElementById(filterType + "-view");
	selectedContainer.style.display = "block";
	}

});