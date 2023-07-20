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

	var overviewButton = document.querySelector(".filter[data-filter='Overview']");
	overviewButton.classList.add("clicked");

	var containers = document.querySelectorAll("#overview-container > div[id$='-view']");

	containers.forEach(function(container) {
		container.style.display = "none";
	});

	var overviewContainer = document.getElementById("Overview-view");
	overviewContainer.style.display = "block";

	async function clickFilter() {
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

	// Add logic to load posts with user's comments (currently not working)
    if (filterType === "comments") {
        // Assume you have access to a variable `posts` containing the posts data from the server
		currentUser='Nigel'
		const jString = JSON.stringify({currentUser});
        
        const response = await fetch("/profile/comments", {
            method: 'POST',
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
          });

          console.log(response);
          if (response.status == 200)
              location.reload();
          else
              console.error("Bad request");

        // Filter posts that have comments from the user
        var userPosts = posts.filter(function(post) {
            return post.comments.some(function(comment) {
                return comment.user === "Nigel"; // Replace "user123" with the actual user ID
            });
        });

        // Render userPosts in the comments view container
        var commentsViewContainer = document.getElementById("Comments-view");
        commentsViewContainer.innerHTML = ""; // Clear previous content

        userPosts.forEach(function(post) {
            var postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.textContent = post.title; // Customize the content as needed
            commentsViewContainer.appendChild(postElement);
        });
    }
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