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

// .________________________.
// ||                      ||
// ||      User Info       ||
// ||______________________||
// '            

const User = function(name) {
    this.name = name;
    this.lname = this.name.toLowerCase();
    this.uname = this.name.toUpperCase();
    this.nav = "#nav-" + this.lname;
    this.img = "images\\profile\\" + name + ".png";
}

const Comment = function(user, content){
    this.user = user;
    this.content = content;
}

let comments = [];
let comCtr = 0;
let currentUser = new User("Cinnamoroll");

// .________________________.
// ||                      ||
// ||    Create Comment    ||
// ||______________________||
// '            

document.addEventListener("DOMContentLoaded",function() {

    document.querySelector(".submit-button")?.addEventListener("click", function(e){
        e.preventDefault();

        const content = document.querySelector(".comment-area").value;
        if (comCtr === 0) {
            document.querySelector(".view-comments").textContent = "";
        }
        let comment = new Comment(currentUser, content);
        comments.push(comment);
        comCtr++;
        
        refreshDisplay(comments);
        resetCreateComment();
        document.querySelector(".comment-area").value = "Write a Comment...";
    })

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
        scUp.innerHTML = `<img src="images/post/upvote.png" class="sc-upvote"></img>`;
        scDown.innerHTML = `<img src="images/post/downvote.png" class="sc-downvote"></img>`;
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
            scUp.querySelector("img").src = "images/post/clicked/c-upvoted.png";
            scNumVote.textContent++;
            } else if (
            scDown.querySelector("img").src.includes("c-downvoted.png")
            ) {
            scUp.querySelector("img").src = "images/post/clicked/c-upvoted.png";
            scDown.querySelector("img").src = "images/post/downvote.png";
            scNumVote.textContent++;
            scNumVote.textContent++;
            } else {
            scUp.querySelector("img").src = "images/post/upvote.png";
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
            scUp.querySelector("img").src = "images/post/upvote.png";
            scNumVote.textContent--;
            } else if (
            scUp.querySelector("img").src.includes("c-upvoted.png")
            ) {
            scDown.querySelector("img").src =
                "images/post/clicked/c-downvoted.png";
            scUp.querySelector("img").src = "images/post/upvote.png";
            scNumVote.textContent--;
            scNumVote.textContent--;
            } else {
            scDown.querySelector("img").src = "images/post/downvote.png";
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

    // ._____________________________.
    // ||			                ||
    // ||   Checks Posts for View   ||
    // ||___________________________||
    // '			                 '

    const url = new URLSearchParams(window.location.search);
    const postId = url.get('id');

    const postContent = document.querySelector('.actual-post');
    const postComments = document.querySelector('.view-comments');

    if (postId == "1") {
        postContent.innerHTML = `<div class="view-post-container">
                                    <div class="vote">
                                        <button class="upvote-button">
                                            <img src="images/post/upvote.png" class="upvote">
                                        </button>
                                        <p class="num-votes">45</p>
                                        <button class="downvote-button">
                                            <img src="images/post/downvote.png" class="downvote">
                                        </button>
                                    </div>
                                    <div class="content">
                                        <div class="post-content">
                                            <h4 class="title">Demon Slayer mid-tier?</h4>
                                            <p class="author">by <a href="profile1.html">pocchi</a></p>
                                            <p class="text">Despite its visually stunning animation and action sequences, Demon Slayer
                                                fails to explore significant thematic depth. It primarily focuses on the battle between
                                                good and evil, neglecting opportunities to delve into complex societal, moral, or
                                                philosophical themes. The absence of deeper thematic exploration prevents it from
                                                resonating on a profound and hought-provoking level. So why did I watch it? Inosuke.</p>
                                            <img src="images/post/media/sample1.jpeg" class="sample">
                                        </div>
                                        <div class="post-actions">
                                            <button class="comment-button">
                                                <img src="images/post/comment.png" class="comment">
                                            </button>
                                            <p>12 Comments</p>
                                            <button class="save-button">
                                                <img src="images/post/save.png" class="save">
                                            </button>
                                        </div>
                                    </div>
                                </div>`;
        /* postComments.innerHTML = 'Comments for Post 1';
        window.onload = () => {
            let initComment = new Comment(new User("MamaMo"), "Tama na kaka anime mo!");
            comments.push(initComment);
            comCtr++;
            initComment = new Comment(new User("Cinnamoroll"), "'Wag mo ko pakialaman Ma! Bakit ka ba nasa website namin!?");
            comments.push(initComment);
            comCtr++;
            refreshDisplay(comments);
        } */
    } else if (postId === '5') {
        postContent.innerHTML = `<div class="view-post-container">
                                <div class="vote">
                                    <button class="upvote-button">
                                        <img src="images/post/upvote.png" class="upvote">
                                    </button>
                                    <p class="num-votes">12</p>
                                    <button class="downvote-button">
                                        <img src="images/post/downvote.png" class="downvote">
                                    </button>
                                </div>
                                <div class="content">
                                    <div class="post-content">
                                        <h4 class="title">Best Agent on Ascent?</h4>
                                        <p class="author">by <a href="main-profile.html">shellyace</a></p>
                                        <p class="text">Hey fellow Valorant enthusiasts! After countless hours of gameplay and
                                            intense battles on the Ascent map, I've finally discovered the ultimate agent that
                                            dominates this battlefield. Drum roll, please... It's none other than Jett! Her mobility
                                            and versatility make her the queen of Ascent, allowing for epic plays and outmaneuvering
                                            opponents. Give her a try and witness the chaos she unleashes! #AscentQueen #JettMain
                                            #GetReadyToAscend</p>
                                        <img src="images/post/media/sample5.png" class="sample">
                                    </div>
                                    <div class="post-actions">
                                        <button class="edit-button">
                                            <img src="images/post/edit.png" class="edit">
                                        </button>
                                        <p id="edit-post">Edit Post</p>
                                        <button class="comment-button">
                                            <img src="images/post/comment.png" class="comment">
                                        </button>
                                        <p>12 Comments</p>
                                        <button class="save-button">
                                            <img src="images/post/save.png" class="save">
                                        </button>
                                    </div>
                                </div>
                            </div>`;
        /* postComments.innerHTML = 'Comments for Post 5'; 
        window.onload = () => {
            let initComment = new Comment(new User("G3nsh1nSuckz"), "What are you even saying!? The era of Jett was over ever since they nerfed her dash and ultimate. It's Phoenix' time to shine now, one flash and boom! Enemies can't even fight back! Get gud Noob!");
            comments.push(initComment);
            comCtr++;
            refreshDisplay(comments);
        } */
    }
});
