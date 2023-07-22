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

// .________________________.
// ||			           ||
// ||      User Info       ||
// ||______________________||
// '			            '

const User = function(name) {
    this.name = name;
    this.lname = this.name.toLowerCase();
    this.uname = this.name.toUpperCase();
    this.nav = "#nav-" + this.lname;
    this.img = "../static/images/profile/" + name + ".png";
}

const Comment = function(user, content){
    this.user = user;
    this.content = content;
}

// Connect the comment array from posts.json
let comments = [];

// Get the length of comment array
let comCtr = 0;

// Has to be whoever is logged in
let currentUser = new User("cinnamoroll");

// .___________________________.
// ||			              ||
// ||      Create Comment     ||
// ||_________________________||
// '			               '

document.addEventListener("DOMContentLoaded",function() {

    document.querySelector(".submit-button")?.addEventListener("click", async e => {
        e.preventDefault();

        const content = document.querySelector(".comment-area").value;
        const author = currentUser.name;
        const profpic = "../static/images/profile/" + currentUser.name + ".png"; 
        const post_id = document.querySelector(".post_id").innerText;

        const jString = JSON.stringify({ content, author, profpic, post_id });

        const response = await fetch("/comment", {
            method: 'POST',
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        });

		let comment = new Comment(currentUser, content);
        comments.push(comment);
        comCtr++;

        if (response.status === 200) {
            const newCommentData = await response.json();
            const newComment = {
                comID: newCommentData.comID, 
                author: newCommentData.author,
                content: newCommentData.content,
                profpic: newCommentData.profpic,
                replies: [] 
            };  
			displayComment(newComment);
        } else {
            console.error("Bad request");
        }

		refreshDisplay(comments);
		resetCreateComment();
		document.querySelector(".comment-area").value = "Write a Comment...";
    });

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
            scDown.querySelector("img").src =
                "images/post/clicked/c-downvoted.png";
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
});