document.addEventListener("DOMContentLoaded",function() {

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
// ||     Follow Button    ||
// ||______________________||
// '			            '

	var followButton = document.getElementById("follow-button");
	var isFollowed = false;

	updateButtonText();

	followButton.addEventListener("click", function() {
		isFollowed = !isFollowed;
		updateButtonText();
	});

	function updateButtonText() {
		if (isFollowed) {
			followButton.value = "Unfollow";
			followButton.classList.remove("clicked");
		} else {
			followButton.value = "Follow";
			followButton.classList.add("clicked");
		}
	}
});