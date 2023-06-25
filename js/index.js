document.addEventListener("DOMContentLoaded",function() {

// .________________________.
// ||			           ||
// ||      Save Post       ||
// ||______________________||
// '			            '
	var saveButtons = document.querySelectorAll(".save-button");

	saveButtons.forEach(function (saveButton) {
		var saveImage = saveButton.querySelector(".save");
		saveButton.addEventListener("click", savePost);

		function savePost() {
			if (saveImage.src.includes("save.png")) {
				saveImage.src = "images/post/clicked/c-saved.png";
			} else {
				saveImage.src = "images/post/save.png";
			}
		}
	});

// .________________________.
// ||			           ||
// ||     Vote Buttons     ||
// ||______________________||
// '			            '

	var upvoteButtons = document.querySelectorAll(".upvote-button");
	var downvoteButtons = document.querySelectorAll(".downvote-button");
	var numVotesList = document.querySelectorAll(".num-votes");

	upvoteButtons.forEach(function (upvoteButton, index) {
		var downvoteButton = downvoteButtons[index];
		var numVotes = numVotesList[index];

		var upvoteImage = upvoteButton.querySelector(".upvote");
		var downvoteImage = downvoteButton.querySelector(".downvote");

		upvoteButton.addEventListener("click", upvotePost);
		downvoteButton.addEventListener("click", downvotePost);

		function upvotePost() {
			if (upvoteImage.src.includes("upvote.png")  && downvoteImage.src.includes("downvote.png")) {
				upvoteImage.src = "images/post/clicked/c-upvoted.png";
				numVotes.textContent++;
			} 
			else if (downvoteImage.src.includes("c-downvoted.png")) {
				upvoteImage.src = "images/post/clicked/c-upvoted.png";
				downvoteImage.src = "images/post/downvote.png"
				numVotes.textContent++;
				numVotes.textContent++;
			} else {
				upvoteImage.src = "images/post/upvote.png";
				numVotes.textContent--;
			}
		}

		function downvotePost() {
			if (downvoteImage.src.includes("downvote.png") && upvoteImage.src.includes("upvote.png")) {
				downvoteImage.src = "images/post/clicked/c-downvoted.png";
				upvoteImage.src = "images/post/upvote.png";
				numVotes.textContent--;
			}
			else if (upvoteImage.src.includes("c-upvoted.png")) {
				downvoteImage.src = "images/post/clicked/c-downvoted.png";
				upvoteImage.src = "images/post/upvote.png";
				numVotes.textContent--;
				numVotes.textContent--;
			}
			else {
				downvoteImage.src = "images/post/downvote.png";
				numVotes.textContent++;
			}
		}
	});
});
