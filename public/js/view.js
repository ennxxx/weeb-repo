function clearDefaultText(element) {
    if (element.value.trim() === element.getAttribute('data-default-value')) {
        element.value = '';
    }
}

function restoreDefaultText(element) {
    if (element.value.trim() === '') {
        element.value = element.getAttribute('data-default-value');
    }
}

// .___________________________.
// ||			                    ||
// ||      Create Comment     ||
// ||_________________________||
// '			                     '

// Define a named function to handle comment creation
async function handleCommentCreation() {
    try {
      const content = document.querySelector(".comment-area").value;
      const post_id = document.querySelector(".post_id").innerText;
      console.log("Button clicked");
  
      const jString = JSON.stringify({ content, post_id });
  
      const response = await fetch("/comment", {
        method: 'POST',
        body: jString,
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (response.status === 200) {
        console.log("Comment created");
        location.reload(); // This will reload the page after successful comment creation
      } else {
        console.error("Bad request");
      }
  
      resetCreateComment();
      document.querySelector(".comment-area").value = "Write a Comment...";
    } catch (error) {
      console.error("Error during comment creation:", error);
    }
  }

	document.addEventListener("visibilitychange", function() {
        var activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === "INPUT") {
          activeElement.blur();
        } 
      });

// .________________________.
// ||			                 ||
// ||      Save Post       ||
// ||______________________||
// '			                  '
    var saveButtons = document.querySelectorAll(".save-button");
    
    saveButtons.forEach(function (saveButton) {
      var saveImage = saveButton.querySelector(".save");
      saveButton.addEventListener("click", savePost);
  
      function savePost() {
        if (saveImage.src.includes("save.png")) {
          saveImage.src = "/static/images/post/clicked/c-saved.png";
        } else {
          saveImage.src = "/static/images/post/save.png";
        }
      }
    });
    
// .________________________.
// ||			                 ||
// ||     Vote Buttons     ||
// ||______________________||
// '			                  '
    
    var upvoteButtons = document.querySelectorAll(".upvote-button");
  
    upvoteButtons.forEach(function (upvoteButton, index) {
      var parentPost = upvoteButton.closest(".view-post-container");
      var downvoteButton = parentPost.querySelector(".downvote-button");
      var numVotes = parentPost.querySelector(".num-votes");
      var post_id = parentPost.post_id;
  
      var upvoteImage = upvoteButton.querySelector(".upvote");
      var downvoteImage = downvoteButton.querySelector(".downvote");
  
      upvoteButton.addEventListener("click", upvotePost);
      downvoteButton.addEventListener("click", downvotePost);
  
      async function upvotePost() {
        if (upvoteImage.src.includes("upvote.png")  && downvoteImage.src.includes("downvote.png")) {
          upvoteImage.src = "/static/images/post/clicked/c-upvoted.png";
          numVotes.textContent++;
        } 
        else if (downvoteImage.src.includes("c-downvoted.png")) {
          upvoteImage.src = "/static/images/post/clicked/c-upvoted.png";
          downvoteImage.src = "/static/images/post/downvote.png"
          numVotes.textContent++;
          numVotes.textContent++;
        } else {
          upvoteImage.src = "/static/images/post/upvote.png";
          numVotes.textContent--;
        }
        const jString = JSON.stringify({votes: parseInt(numVotes.textContent), post_id});
        const response = await fetch("/vote", {
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
      }
  
      async function downvotePost() {
        if (downvoteImage.src.includes("downvote.png") && upvoteImage.src.includes("upvote.png")) {
          downvoteImage.src = "/static/images/post/clicked/c-downvoted.png";
          upvoteImage.src = "/static/images/post/upvote.png";
          numVotes.textContent--;
        }
        else if (upvoteImage.src.includes("c-upvoted.png")) {
          downvoteImage.src = "/static/images/post/clicked/c-downvoted.png";
          upvoteImage.src = "/static/images/post/upvote.png";
          numVotes.textContent--;
          numVotes.textContent--;
        }
        else {
          downvoteImage.src = "/static/images/post/downvote.png";
          numVotes.textContent++;
        }
        const jString = JSON.stringify({votes: parseInt(numVotes.textContent), post_id});
        const response = await fetch("/vote", {
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
      }
    });