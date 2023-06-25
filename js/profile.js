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


// .________________________.
// ||			           ||
// ||    Follow Button     ||
// ||______________________||
// '			            '

	var followButton = document.getElementById("follow-button");
	var isFollowed = true; // Set the initial state to followed

	// Initial state of the button
	updateButtonText();

	// Attach click event listener to the button
	followButton.addEventListener("click", function() {
		isFollowed = !isFollowed; // Toggle the follow state
		updateButtonText();
	});

	// Function to update the button text based on the follow state
	function updateButtonText() {
		if (isFollowed) {
			followButton.value = "Follow";
			followButton.classList.add("clicked");
		} else {
			followButton.value = "Unfollow";
			followButton.classList.remove("clicked");
		}
	}
});