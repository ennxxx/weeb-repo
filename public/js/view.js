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
// ||			              ||
// ||      Create Comment     ||
// ||_________________________||
// '			               '

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

document.addEventListener("DOMContentLoaded",function() {      

	function deleteComment(index) {
        comments.splice(index, 1);
        refreshDisplay(comments);
    }

    function editComment(display, element, index) {
        const comment = comments[index];
        element.contentEditable = true;
        element.focus();
    
        element.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                element.contentEditable = false;
                comment.content = element.innerText.trim();
                display.innerText = "Edited";
            }
        });
    }
    
    function refreshDisplay(displayedComments) {
        const commentsContainer = document.querySelector(".view-comments");
        commentsContainer.innerHTML = "";
        displayComments(displayedComments);
    }

    function displayComments(newComment) {
        for (let i = newComment.length - 1; i >= 0; i--) {
          displayComment(newComment[i], i); 
        }
    }

    function displayComment(newComment, index) {
		const commContainer = document.querySelector(".view-comments");
		const commMain = document.createElement("div");
		const singleComment = document.createElement("div");
		const scLeft = document.createElement("div");
		const scRight = document.createElement("div");
		const scPic = document.createElement("img");
		const scRightCont = document.createElement("div");
        const scTop = document.createElement("div");
        const scName = document.createElement("div");
        const scEdited = document.createElement("p");
		const scBody = document.createElement("div");
        const scFooter = document.createElement("div");
        const scVote = document.createElement("div");
        const scUp = document.createElement("button");
        const scNumVote = document.createElement("p");
        const scDown = document.createElement("button");
        const scReplyBtn = document.createElement("button");
        const scActions = document.createElement("div");
        const scEditBtn = document.createElement("button");
        const scDeleteBtn = document.createElement("button");
        
		commMain.className = "single-comment-main";
		singleComment.className = "single-comment";
		scLeft.className = "sc-left";
		scRight.className = "sc-right";
		scPic.className = "sc-picture";
		scRightCont.className = "sc-right-content";
        scTop.className = "sc-top";
        scName.className = "sc-name";
        scEdited.className = "sc-edited";
		scBody.className = "sc-body";
        scFooter.className = "sc-footer";
        scVote.className = "sc-vote";
        scUp.className = "sc-upvote-button";
        scNumVote.className = "sc-num-votes";
        scDown.className = "sc-downvote-button";
        scActions.className = "sc-actions";
        scReplyBtn.className = "sc-reply-button";
        scEditBtn.className ="sc-edit-button";
        scDeleteBtn.className ="sc-delete-button";
      
		commMain.appendChild(singleComment);
		singleComment.appendChild(scLeft);
		singleComment.appendChild(scRight);
		scLeft.appendChild(scPic);
        scTop.appendChild(scName);
        scTop.appendChild(scEdited);
		scRight.appendChild(scTop);
        scRight.appendChild(scRightCont);
        scRight.appendChild(scFooter)
        scRightCont.appendChild(scBody);
        scVote.appendChild(scUp);
        scVote.appendChild(scNumVote);
        scVote.appendChild(scDown);
        scVote.appendChild(scReplyBtn);
        scActions.appendChild(scEditBtn);
        scActions.appendChild(scDeleteBtn);
        scFooter.appendChild(scVote);
        scFooter.appendChild(scActions);
  
		scPic.src = newComment.user.img;
        scName.innerHTML = newComment.user.name;
		scBody.innerText = newComment.content;
        scUp.innerHTML = `<img src="../static/images/post/upvote.png" class="sc-upvote"></img>`;
        scDown.innerHTML = `<img src="../static/images/post/downvote.png" class="sc-downvote"></img>`;
        scNumVote.innerText = 0;
        scReplyBtn.innerText = "Reply";
        scEditBtn.innerText = "Edit";
        scDeleteBtn.innerText = "Delete";
        scEdited.innerText = "";

		commContainer.appendChild(commMain);

        scUp.addEventListener("click", upvoteComment);
        scDown.addEventListener("click", downvoteComment);

        scDeleteBtn.addEventListener("click", function () {
            deleteComment(index); 
            refreshDisplay(comments);
        });  

        scEditBtn.addEventListener("click", function () {
            editComment(scEdited, scBody, index);
        });

        function upvoteComment() {
            if (
            scUp.querySelector("img").src.includes("upvote.png") &&
            scDown.querySelector("img").src.includes("downvote.png")
            ) {
            scUp.querySelector("img").src = "../static/images/post/clicked/c-upvoted.png";
            scNumVote.textContent++;
            } else if (
            scDown.querySelector("img").src.includes("c-downvoted.png")
            ) {
            scUp.querySelector("img").src = "../static/images/post/clicked/c-upvoted.png";
            scDown.querySelector("img").src = "../static/images/post/downvote.png";
            scNumVote.textContent++;
            scNumVote.textContent++;
            } else {
            scUp.querySelector("img").src = "../static/images/post/upvote.png";
            scNumVote.textContent--;
            }
        }

        function downvoteComment() {
            if (
            scDown.querySelector("img").src.includes("downvote.png") &&
            scUp.querySelector("img").src.includes("upvote.png")
            ) {
            scDown.querySelector("img").src =
                "images/post/clicked/c-downvoted.png";
            scUp.querySelector("img").src = "../static/images/post/upvote.png";
            scNumVote.textContent--;
            } else if (
            scUp.querySelector("img").src.includes("c-upvoted.png")
            ) {
            scDown.querySelector("img").src = "../static/images/post/clicked/c-downvoted.png";
            scUp.querySelector("img").src = "../static/images/post/upvote.png";
            scNumVote.textContent--;
            scNumVote.textContent--;
            } else {
            scDown.querySelector("img").src = "../static/images/post/downvote.png";
            scNumVote.textContent++;
            }
        }
	}

	function resetCreateComment() {
        const content = document.querySelector('.comment-area');
        content.value = "";
	}

	document.addEventListener("visibilitychange", function() {
        var activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === "INPUT") {
          activeElement.blur();
        } 
      });


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
          saveImage.src = "/static/images/post/clicked/c-saved.png";
        } else {
          saveImage.src = "/static/images/post/save.png";
        }
      }
    });
    
    // .________________________.
    // ||			           ||
    // ||     Vote Buttons     ||
    // ||______________________||
    // '			            '
    
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
  });