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

// .________________________.
// ||			           ||
// ||      Write Post      ||
// ||______________________||
// '			            '

	document.getElementById('openPopup').addEventListener('click', function(event) {
		event.preventDefault(); // Prevent the default link behavior

		// Create the overlay element
		var popupOverlay = document.createElement('div');
		popupOverlay.className = 'popup-overlay';

		// Create the popup container
		var popup = document.createElement('div');
		popup.className = 'popup';

		// Create the close button
		var closeButton = document.createElement('closebutton');
		closeButton.innerHTML = '&#x2715;'; // Close icon (unicode character)
		closeButton.className = 'close-button';

		// Add event listener to close the popup when the close button is clicked
		closeButton.addEventListener('click', function() {
			document.body.removeChild(popup);
		});

		// Create the title heading 
		var titleHeading = document.createElement('h2');
		titleHeading.textContent = 'Create a post'; // Set the heading text

		// Create a spacer element for spacing between title input and close button
		var spacer = document.createElement('div');
		spacer.className = 'spacer';
		popup.appendChild(spacer);

		// Create the input field for the title
		var titleInput = document.createElement('input');
		titleInput.type = 'text';
		titleInput.placeholder = 'Title';
		titleInput.className = 'title-input';

		// Create the container for content elements
		var contentWrapper = document.createElement('div');
		contentWrapper.className = 'content-wrapper';

		// Create the format toolbar
		var formatToolbar = document.createElement('div');
		formatToolbar.className = 'format-toolbar';
		formatToolbar.innerHTML = `
			<div class="format-group">
				<input type="checkbox" id="boldCheckbox">
				<label for="boldCheckbox"><b>B</b></label>
			</div>
			<div class="format-group">
				<input type="checkbox" id="italicCheckbox">
				<label for="italicCheckbox"><i>I</i></label>
			</div>
			<div class="format-group">
				<input type="checkbox" id="underlineCheckbox">
				<label for="underlineCheckbox"><u>U</u></label>
			</div>
		`;

		// Create the content textarea
		var contentTextarea = document.createElement('textarea');
		contentTextarea.className = 'content-textarea';

		// Add event listener to update the toolbar buttons when the content changes
		contentTextarea.addEventListener('input', function() {
			updateToolbarButtons();
		});

		// Create the input field for media files
		var mediaInput = document.createElement('input');
		mediaInput.type = 'file';
		mediaInput.accept = 'image/*, video/*';
		mediaInput.style.display = 'none'; // Hide the default file input

		// Create the button for inserting media files
		var mediaButton = document.createElement('button');
		mediaButton.textContent = 'Insert Media';
		mediaButton.className = 'media-button';

		// Add event listener to trigger the file input when the button is clicked
		mediaButton.addEventListener('click', function() {
			mediaInput.click();
		});

		// Create a container for the media button
		var mediaContainer = document.createElement('div');
		mediaContainer.className = 'media-container';
		mediaContainer.appendChild(mediaButton);

		// Append the content elements to the content wrapper
		contentWrapper.appendChild(formatToolbar);
		contentWrapper.appendChild(contentTextarea);
		contentWrapper.appendChild(mediaContainer);

		// Create the input field for URLs
		var urlInput = document.createElement('input');
		urlInput.type = 'text';
		urlInput.placeholder = 'Enter URL';

		// Add event listener to handle entered URLs
		urlInput.addEventListener('keydown', function(event) {
			if (event.key === 'Enter') {
			var url = urlInput.value;
			// Handle the entered URL here
			console.log('Entered URL:', url);
			event.preventDefault();
			}
		});

		// Create the input field for poll questions
		var pollInput = document.createElement('input');
		pollInput.type = 'text';
		pollInput.placeholder = 'Enter poll question';

		// Add event listener to handle entered poll questions
		pollInput.addEventListener('keydown', function(event) {
			if (event.key === 'Enter') {
			var question = pollInput.value;
			// Handle the entered poll question here
			console.log('Entered poll question:', question);
			event.preventDefault();
			}
		});

		// Create the submit button
		var submitButton = document.createElement('button');
		submitButton.textContent = 'Submit';

		// Add event listener to handle submission
		submitButton.addEventListener('click', function() {
			var title = titleInput.value;
			var content = contentTextarea.value;
			// Do something with the title and content, like sending it to a server or processing it further
			console.log('Title:', title);
			console.log('Content:', content);
			document.body.removeChild(popup);
		});

		// Append the content elements to the content wrapper
		contentWrapper.appendChild(formatToolbar);
		contentWrapper.appendChild(contentTextarea);
		contentWrapper.appendChild(mediaContainer);
		contentWrapper.appendChild(urlInput);
		contentWrapper.appendChild(pollInput);

		// Append the title input, content wrapper, submit button, and overlay to the popup container
		popup.insertBefore(titleHeading, popup.firstChild);
		popup.appendChild(closeButton);
		popup.appendChild(titleInput);
		popup.appendChild(contentWrapper);
		popup.appendChild(submitButton);
		popup.appendChild(popupOverlay);

		// Append the popup container to the body
		document.body.appendChild(popup);

		// Add event listener to close the popup when the closePopup element is clicked
		document.getElementById('closePopup').addEventListener('click', function() {
			document.body.removeChild(popup);
		});

		// Function to handle updating the toolbar buttons based on the current selection
		function updateToolbarButtons() {
			var buttons = [...document.getElementsByClassName('format-group')];
			var selection = document.getSelection();

			buttons.forEach(function(button) {
			var checkbox = button.getElementsByTagName('input')[0];
			var command = checkbox.getAttribute('id').replace('Checkbox', '');

			if (command === 'bold') {
				checkbox.checked = document.queryCommandState('bold');
			} else if (command === 'italic') {
				checkbox.checked = document.queryCommandState('italic');
			} else if (command === 'underline') {
				checkbox.checked = document.queryCommandState('underline');
			} else {
				checkbox.checked = document.queryCommandState(command);
			}
			});
		}

		// Add event listener to format the selected text when a toolbar button is clicked
		formatToolbar.addEventListener('click', function(event) {
			var target = event.target;
			if (target.tagName === 'INPUT') {
			var command = target.getAttribute('id').replace('Checkbox', '');

			if (command === 'bullet') {
				document.execCommand('insertUnorderedList', false, null);
			} else {
				document.execCommand(command, false, null);
			}

			updateToolbarButtons();
			contentTextarea.focus(); // Ensure the textarea maintains focus after formatting
			}
		});
	});
});
