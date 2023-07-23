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

document.addEventListener("visibilitychange", function () {
  var activeElement = document.activeElement;
  if (activeElement && activeElement.tagName === "INPUT") {
    activeElement.blur();
  }
});


document.addEventListener("DOMContentLoaded", function () {

  // .________________________.
  // ||			           ||
  // ||      Save Post       ||
  // ||______________________||
  // '			            '

  var saveButton = document.querySelector(".save-button");
  var saveImage = saveButton.querySelector(".save");

  saveButton.addEventListener("click", savePost);

  function savePost() {
    if (saveImage.src.includes("save.png")) {
      saveImage.src = "/static/images/post/clicked/c-saved.png";
    } else {
      saveImage.src = "/static/images/post/save.png";
    }
  }

  // .________________________.
  // ||			           ||
  // ||       Vote Post      ||
  // ||______________________||
  // '			            '

  var upvoteButtons = document.querySelectorAll(".upvote-button");

  upvoteButtons.forEach(function (upvoteButton, index) {
    var parentPost = upvoteButton.closest(".view-post-container"); // Get the closest parent post container
    var downvoteButton = parentPost.querySelector(".downvote-button");
    var numVotes = parentPost.querySelector(".num-votes");
    var post_id = parentPost.post_id;

    var upvoteImage = upvoteButton.querySelector(".upvote");
    var downvoteImage = downvoteButton.querySelector(".downvote");

    upvoteButton.addEventListener("click", upvotePost);
    downvoteButton.addEventListener("click", downvotePost);

    async function upvotePost() {
      if (upvoteImage.src.includes("upvote.png") && downvoteImage.src.includes("downvote.png")) {
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
      const jString = JSON.stringify({ votes: parseInt(numVotes.textContent), post_id });
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
      const jString = JSON.stringify({ votes: parseInt(numVotes.textContent), post_id });
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

  // .________________________.
  // ||			           ||
  // ||     Vote Comment     ||
  // ||______________________||
  // '			            '

  var upvoteComButtons = document.querySelectorAll(".sc-upvote-button");

  upvoteComButtons.forEach(function (upvoteComButton, index) {
    var parentCom = upvoteComButton.closest(".single-comment-main"); // Get the closest parent post container
    var downvoteComButton = parentCom.querySelector(".sc-downvote-button");
    var numVotesCom = parentCom.querySelector(".sc-num-votes");
    var comment_id = parentCom.comment_id;

    var upvoteComImage = upvoteComButton.querySelector(".sc-upvote");
    var downvoteComImage = downvoteComButton.querySelector(".sc-downvote");

    upvoteComButton.addEventListener("click", upvoteComment);
    downvoteComButton.addEventListener("click", downvoteComment);

    async function upvoteComment() {
      if (upvoteComImage.src.includes("upvote.png") && downvoteComImage.src.includes("downvote.png")) {
        upvoteComImage.src = "/static/images/post/clicked/c-upvoted.png";
        numVotesCom.textContent++;
      }
      else if (downvoteComImage.src.includes("c-downvoted.png")) {
        upvoteComImage.src = "/static/images/post/clicked/c-upvoted.png";
        downvoteComImage.src = "/static/images/post/downvote.png"
        numVotesCom.textContent++;
        numVotesCom.textContent++;
      } else {
        upvoteComImage.src = "/static/images/post/upvote.png";
        numVotesCom.textContent--;
      }
      const jString = JSON.stringify({ votes: parseInt(numVotesCom.textContent), comment_id });
      const response = await fetch("/vote-comment", {
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

    async function downvoteComment() {
      if (downvoteComImage.src.includes("downvote.png") && upvoteComImage.src.includes("upvote.png")) {
        downvoteComImage.src = "/static/images/post/clicked/c-downvoted.png";
        upvoteComImage.src = "/static/images/post/upvote.png";
        numVotesCom.textContent--;
      }
      else if (upvoteComImage.src.includes("c-upvoted.png")) {
        downvoteComImage.src = "/static/images/post/clicked/c-downvoted.png";
        upvoteComImage.src = "/static/images/post/upvote.png";
        numVotesCom.textContent--;
        numVotesCom.textContent--;
      }
      else {
        downvoteComImage.src = "/static/images/post/downvote.png";
        numVotesCom.textContent++;
      }
      const jString = JSON.stringify({ votes: parseInt(numVotesCom.textContent), comment_id });
      const response = await fetch("/vote-comment", {
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