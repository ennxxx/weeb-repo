  // Open popup
  function openPopup() {
      document.getElementById("overlay").style.display = "";
      document.getElementById("popup").style.display = "";
  }

  // Close popup
  function closePopup() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
  }

  // Check title length
  function checkTitleLength() {
    var title = document.getElementById("title").value;
    document.getElementById("title-count").textContent = title.length + "/50";
  }
  
  // Make text bold
  function makeBold() {
    document.execCommand("bold", false, null);
  }
  
  // Make text underline
  function makeUnderline() {
    document.execCommand("underline", false, null);
  }
  
  // Make text italic
  function makeItalic() {
    document.execCommand("italic", false, null);
  }
  
  // Make text bullet list
  function makeBullet() {
    document.execCommand("insertUnorderedList", false, null);
  }
  
  // Insert image
  function insertImage() {
    var url = prompt("Enter the URL of the image:");
    if (url) {
      document.execCommand("insertImage", false, url);
    }
  }
  
  // Submit button

const User = function(name) {
  this.name = name;
  this.lname = this.name.toLowerCase();
  this.uname = this.name.toUpperCase();
  this.nav = "#nav-" + this.lname;
  this.img = "./images/" + name + ".png";
}

const Post = function(user, content, title, text, url){
  this.user = user;
  this.content = content;
  this.title = title;
  this.text = text;
  this.img = url;
}

let posts = [];
let postCtr = 0;
let currentUser = new User("profile");

document.addEventListener("DOMContentLoaded",function() {
  document.querySelector("#popup-submit")?.addEventListener("click", function(e){
    e.preventDefault();

    const content = document.querySelector("#content").innerHTML;
    const title = document.getElementById("title").value;
    const text= document.getElementById("content").value;
    const url = document.getElementById("url").value;
    let post = new Post(currentUser, content, title, text, url);
    posts.push(post);
    postCtr++;
    
    refreshDisplay(post);
    resetCreatePost();
    document.getElementById("submit-message").innerHTML = "Post Submitted!";
    document.getElementById("submit-message").style.color = "green";
    voteBtns();
    saveBtn();
    
  })


  function refreshDisplay(displayedPosts) {
  const postsContainer = document.querySelector(".posts-container")
  //commentsContainer.innerHTML = ""; // Clear post-container
  displayPosts(displayedPosts);

  }
  function displayPosts(newPost) {
    
  // Clear post-container and add each post inside newPosts inside it instead
  
    displayComment(newPost);

  }
  function displayComment(newPost) {
    const postContainer = document.querySelector(".posts-container");
  
    const postMain = document.createElement("div");
    const spVote = document.createElement("div");
    const spUp = document.createElement("button");
    const spNumVote = document.createElement("p");
    const spDown = document.createElement("button");
    const spContent = document.createElement("div");
    const spPostContent = document.createElement("div");
    const spclickable1 = document.createElement("a");
    const spclickable2 = document.createElement("a");
    const spclickable3 = document.createElement("a");
    const spTitle = document.createElement("h4");
    const spAuthor = document.createElement("p");
    // const spUserProf = document.createElement("a");
    const spText = document.createElement("p");
    const spSample = document.createElement("img");
    const spPostAction = document.createElement("div");
    const spCommentBtn = document.createElement("button");
    const spCommentNum = document.createElement("p");
    const spShareBtn = document.createElement("button");
    const spShare = document.createElement("p");
    const spSaveBtn = document.createElement("button");

  
    postMain.className = "post-container";
    spVote.className = "vote";
    spUp.className = "upvote-button";
    spNumVote .className = "num-votes";
    spDown.className = "downvote-button";
    spContent.className = "content";
    spPostContent.className = "post-content";
    spclickable1.className = "post-post-clickable";
    spclickable2.className = "post-post-clickable";
    spclickable3.className = "post-post-clickable";
    spTitle.className = "title";
    spAuthor.className = "author";
    spText.className = "text";
    spSample.className = "postsample";
    spPostAction.className = "post-actions";
    spCommentBtn.className = "comment-button";
    spCommentNum.className = "comment-num";
    spShareBtn.className = "share-button";
    spShare.className = "share";
    spSaveBtn.className = "save-button";


    postMain.appendChild(spVote);
    postMain.appendChild(spContent);
    spVote.appendChild(spUp);
    spVote.appendChild(spNumVote);
    spVote.appendChild(spDown);
    spContent.appendChild(spPostContent);
    spContent.appendChild(spPostAction);
    spPostContent.appendChild(spclickable1);
    spPostContent.appendChild(spAuthor);
    spPostContent.appendChild(spclickable2);
    spclickable1.appendChild(spTitle);
    spclickable2.appendChild(spText);
    spclickable2.appendChild(spSample);
    spPostAction.appendChild(spclickable3);
    spPostAction.appendChild(spCommentNum);
    spPostAction.appendChild(spShareBtn);
    spPostAction.appendChild(spShare);
    spPostAction.appendChild(spSaveBtn);
    
    spNumVote.innerText = 0;
    spUp.innerHTML = `<img src="images/post/upvote.png" class="upvote">`;
    spDown.innerHTML = `<img src="images/post/downvote.png" class="downvote">`;
    spTitle.innerText = newPost.title;
    spText.innerHTML = newPost.content;
    spSample.src = newPost.img;
    spAuthor.innerText = "by " + newPost.user.name;
    spCommentBtn.innerHTML = `<img src="images/post/comment.png" class="comment"></img>`;
    spCommentNum.innerText = "12 Comments";
    spShareBtn.innerHTML=`<img src="images/post/share.png" class="share">`;
    spShare.innerText = "Share";
    spSaveBtn.innerHTML=`<img src="images/post/save.png" class="save">`;
    
    postContainer.appendChild(postMain);
  }
  function resetCreatePost() {
    const content = document.querySelector('#content');
    const title = document.querySelector('#title');
    const url = document.querySelector('#url');
    const titleCtr = document.querySelector('#title-count');

    content.innerHTML = "";
    title.value = "";
    url.value = "";
    titleCtr.innerText = "0/50";
  }

// ._______________________________.
// ||			                        ||
// ||    Copy of Vote Buttons     ||
// ||_____________________________||
// '			                         '
function voteBtns(){
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
}
// .______________________________.
// ||			                       ||
// ||     Copy of Save Post      ||
// ||____________________________||
// '			                        '
function saveBtn(){
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
}
});
