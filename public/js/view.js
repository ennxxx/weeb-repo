/* For comment text area */
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


    // ._____________________________________.
    // ||			                        ||
    // ||   code for updating comment page  ||
    // ||___________________________________||
    // '			                         '


const User = function(name) {
    this.name = name;
    this.lname = this.name.toLowerCase();
    this.uname = this.name.toUpperCase();
    this.nav = "#nav-" + this.lname;
    this.img = "/static/images" + name + ".png";
}

const Comment = function(user, content){
    this.user = user;
    this.content = content;
}



let currentUser = new User("cinnamoroll");

document.addEventListener("DOMContentLoaded",function() {

    document.querySelector(".submit-button")?.addEventListener("click", async e => {
        e.preventDefault();

        const content = document.querySelector(".comment-area").value;
        const author = currentUser.name;
        const profpic = currentUser.name + ".png";
        const id = document.querySelector(".postID").innerText;
    
        const jString = JSON.stringify({content, author, profpic, id});
        
        const response = await fetch("/comment", {
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

        resetCreateComment();
        document.querySelector(".comment-area").value = "    Write a Comment...";
    })


    // Reply button click event listener(not complete)
    const buttonVisibility = {};
    const replyButtons = document.querySelectorAll('.sc-reply-button');

    replyButtons.forEach(replyButton => {
        // Generate a unique ID for each button
        const buttonId = replyButton.dataset.buttonId;

        // Initialize the visibility state for each button
        buttonVisibility[buttonId] = true;

        replyButton.addEventListener('click', async e => {
            e.preventDefault();
            console.log('hi');
            const singleComment = replyButton.closest('.single-comment');
            const replyForm = singleComment.querySelector('.reply-form');
            
            const isVisible = buttonVisibility[buttonId];

            // Toggle the visibility state for the specific button
            buttonVisibility[buttonId] = !isVisible;

            if (buttonVisibility[buttonId]) {
                replyForm.style.display = 'block';
                console.log('Reply form displayed');
            } else {
                replyForm.style.display = 'none';
                console.log('Reply form hidden');
            }
        });
    });
    

    const submitReplyButton = document.querySelector('.submit-reply');
    submitReplyButton.addEventListener('click', async e => {
        const replyContent = "   " + document.querySelector('.reply-area').value;
        const author = currentUser.name;
        const profpic = currentUser.name + ".png";
        const comID = document.querySelector(".comID").innerText;

        const jString = JSON.stringify({replyContent, author, profpic, comID});
        
        const response = await fetch("/reply", {
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

        document.querySelector(".reply-area").value = "    Write a Reply...";
        document.querySelector(".reply-form").style.display = "none";
    });
    

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
  // ||			             ||
  // ||     Vote Buttons     ||
  // ||______________________||
  // '			              '
  
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
    }

    function downvotePost() {
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
    }
  });
});
