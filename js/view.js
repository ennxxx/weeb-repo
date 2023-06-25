/* For comment text area */
function clearDefaultText(element) {
    if (element.value === element.defaultValue) {
      element.value = '';
    }
}
function restoreDefaultText(element) {
    if (element.value === '') {
      element.value = "    Write a Comment...";
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
    this.img = "./images/" + name + ".png";
}

const Comment = function(user, content){
    this.user = user;
    this.content = content;
}

let comments = [];
let comCtr = 0;
let currentUser = new User("profile");

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
        document.querySelector(".comment-area").value = "    Write a Comment...";
    })

    
    function refreshDisplay(displayedComments) {
		const commentsContainer = document.querySelector(".view-comments")
		commentsContainer.innerHTML = ""; // Clear post-container
		displayComments(displayedComments);
	}
    function displayComments(newComment) {
		// Clear post-container and add each post inside newPosts inside it instead
        for (let i = newComment.length - 1; i >= 0; i--) {
            displayComment(newComment[i]);
        }
	}
    function displayComment(newComment) {
		const commContainer = document.querySelector(".view-comments");
		
		const commMain = document.createElement("div");
		const singleComment = document.createElement("div");
		const scLeft = document.createElement("div");
		const scRight = document.createElement("div");
		const scPic = document.createElement("img");
		const scRightCont = document.createElement("div");
        const scName = document.createElement("div");
		const scBody = document.createElement("div");

		// Add classes to your created elements so you don't have to style repeatedly
		// HINT: You can use $(element1).addClass("class-name");
		commMain.className = "single-comment-main";
		singleComment.className = "single-comment";
		scLeft.className = "sc-left";
		scRight.className = "sc-right";
		scPic.className = "sc-picture";
		scRightCont.className = "sc-right-content";
        scName.className = "sc-name";
		scBody.className = "sc-body";

		// Set the proper hierarchy of the created elements
		// HINT: $(element1).append(element2); will place element2 within element1
		commMain.appendChild(singleComment);
		singleComment.appendChild(scLeft);
		singleComment.appendChild(scRight);
		scLeft.appendChild(scPic);
		scRight.appendChild(scName);
        scRight.appendChild(scRightCont);
        scRightCont.appendChild(scBody);
        

		// Set the proper content/values to the correct elements/tags
		// HINT: You can use $(element2).text("Text to Add"); OR $(imgElement).attr("src", "./images/user.png");
		scPic.src = newComment.user.img;
        scName.innerHTML = newComment.user.name;
		scBody.innerText = newComment.content;
	
		commContainer.appendChild(commMain);
	}
    function resetCreateComment() {
        const content = document.querySelector('.comment-area');

        content.value = "";
	}

    // ._____________________________________.
    // ||			                        ||
    // ||   Checks which post called view   ||
    // ||___________________________________||
    // '			                         '

    const url = new URLSearchParams(window.location.search);
    const postId = url.get('id');

    const postContent = document.querySelector('.actual-post');
    const postComments = document.querySelector('.view-comments');

    if (postId == "1") {
        postContent.innerHTML = `<div class="post-container">
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
                                            <p class="author">by <a href="profile.html">pocchi</a></p>
                                            <p class="text">Despite its visually stunning animation and action sequences, Demon Slayer
                                                fails to explore significant thematic depth. It primarily focuses on the battle between
                                                good and evil, neglecting opportunities to delve into complex societal, moral, or
                                                philosophical themes. The absence of deeper thematic exploration prevents it from
                                                resonating on a profound and hought-provoking level. So why did I watch it? Inosuke.</p>
                                            <img src="images/post/media/sample2.jpeg" class="sample">
                                        </div>
                                        <div class="post-actions">
                                            <button class="comment-button">
                                                <img src="images/post/comment.png" class="comment">
                                            </button>
                                            <p>12 Comments</p>
                                            <button class="share-button">
                                                <img src="images/post/share.png" class="share">
                                            </button>
                                            <p>Share</p>
                                            <button class="save-button">
                                                <img src="images/post/save.png" class="save">
                                            </button>
                                        </div>
                                    </div>
                                </div>`;
        postComments.innerHTML = 'Comments for Post 1';
    } else if (postId === '2') {
        postContent.innerHTML = '<div class="post-container">' +
                                    '<div class="vote">'+
                                        '<button class="upvote-button">'+
                                            '<img src="images/post/upvote.png" class="upvote">'+
                                        '</button>'+
                                        '<p class="num-votes">45</p>'+
                                        '<button class="downvote-button">'+
                                            '<img src="images/post/downvote.png" class="downvote">'+
                                        '</button>'+
                                    '</div>'+
                                    '<div class="content">'+
                                        '<div class="post-content">'+
                                            '<h4 class="title">Best Agent on Ascent?</h4>'+
                                            '<p class="author">by <span>cornbrip69</span></p>'+
                                            '<p class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit,'+
                                                'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim'+
                                                'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo...</p>'+
                                            '<img src="images/post/media/sample1.png" class="sample">'+
                                        '</div>'+
                                        '<div class="post-actions">'+
                                            '<button class="comment-button">'+
                                                '<img src="images/post/comment.png" class="comment">'+
                                            '</button>'+
                                            '<p>12 Comments</p>'+
                                            '<button class="share-button">'+
                                                '<img src="images/post/share.png" class="share">'+
                                            '</button>'+
                                            '<p>Share</p>'+
                                            '<button class="save-button">'+
                                                '<img src="images/post/save.png" class="save">'+
                                            '</button>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';
        postComments.innerHTML = 'Comments for Post 2';
    } else if (postId === '3') {
        postContent.innerHTML = '<div class="post-container">' +
                                    '<div class="vote">'+
                                        '<button class="upvote-button">'+
                                            '<img src="images/post/upvote.png" class="upvote">'+
                                        '</button>'+
                                        '<p class="num-votes">45</p>'+
                                        '<button class="downvote-button">'+
                                            '<img src="images/post/downvote.png" class="downvote">'+
                                        '</button>'+
                                    '</div>'+
                                    '<div class="content">'+
                                        '<div class="post-content">'+
                                            '<h4 class="title">Best Agent on Ascent?</h4>'+
                                            '<p class="author">by <span>cornbrip69</span></p>'+
                                            '<p class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit,'+
                                                'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim'+
                                                'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo...</p>'+
                                            '<img src="images/post/media/sample1.png" class="sample">'+
                                        '</div>'+
                                        '<div class="post-actions">'+
                                            '<button class="comment-button">'+
                                                '<img src="images/post/comment.png" class="comment">'+
                                            '</button>'+
                                            '<p>12 Comments</p>'+
                                            '<button class="share-button">'+
                                                '<img src="images/post/share.png" class="share">'+
                                            '</button>'+
                                            '<p>Share</p>'+
                                            '<button class="save-button">'+
                                                '<img src="images/post/save.png" class="save">'+
                                            '</button>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';
        postComments.innerHTML = 'Comments for Post 3';
    } else if (postId === '4') {
        postContent.innerHTML = '<div class="post-container">' +
                                    '<div class="vote">'+
                                        '<button class="upvote-button">'+
                                            '<img src="images/post/upvote.png" class="upvote">'+
                                        '</button>'+
                                        '<p class="num-votes">45</p>'+
                                        '<button class="downvote-button">'+
                                            '<img src="images/post/downvote.png" class="downvote">'+
                                        '</button>'+
                                    '</div>'+
                                    '<div class="content">'+
                                        '<div class="post-content">'+
                                            '<h4 class="title">Best Agent on Ascent?</h4>'+
                                            '<p class="author">by <span>cornbrip69</span></p>'+
                                            '<p class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit,'+
                                                'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim'+
                                                'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo...</p>'+
                                            '<img src="images/post/media/sample1.png" class="sample">'+
                                        '</div>'+
                                        '<div class="post-actions">'+
                                            '<button class="comment-button">'+
                                                '<img src="images/post/comment.png" class="comment">'+
                                            '</button>'+
                                            '<p>12 Comments</p>'+
                                            '<button class="share-button">'+
                                                '<img src="images/post/share.png" class="share">'+
                                            '</button>'+
                                            '<p>Share</p>'+
                                            '<button class="save-button">'+
                                                '<img src="images/post/save.png" class="save">'+
                                            '</button>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';
        postComments.innerHTML = 'Comments for Post 4';
    } else if (postId === '5') {
        postContent.innerHTML = '<div class="post-container">' +
                                    '<div class="vote">'+
                                        '<button class="upvote-button">'+
                                            '<img src="images/post/upvote.png" class="upvote">'+
                                        '</button>'+
                                        '<p class="num-votes">45</p>'+
                                        '<button class="downvote-button">'+
                                            '<img src="images/post/downvote.png" class="downvote">'+
                                        '</button>'+
                                    '</div>'+
                                    '<div class="content">'+
                                        '<div class="post-content">'+
                                            '<h4 class="title">Best Agent on Ascent?</h4>'+
                                            '<p class="author">by <span>cornbrip69</span></p>'+
                                            '<p class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit,'+
                                                'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim'+
                                                'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo...</p>'+
                                            '<img src="images/post/media/sample1.png" class="sample">'+
                                        '</div>'+
                                        '<div class="post-actions">'+
                                            '<button class="comment-button">'+
                                                '<img src="images/post/comment.png" class="comment">'+
                                            '</button>'+
                                            '<p>12 Comments</p>'+
                                            '<button class="share-button">'+
                                                '<img src="images/post/share.png" class="share">'+
                                            '</button>'+
                                            '<p>Share</p>'+
                                            '<button class="save-button">'+
                                                '<img src="images/post/save.png" class="save">'+
                                            '</button>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';
        postComments.innerHTML = 'Comments for Post 5<br><br><br><br><br><br><br><br><br>sadge';
    }

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

    

    // ._________________________.
    // ||			            ||
    // ||       drop down       ||
    // ||_______________________||
    // '			             '

    var signedIn = true;
    var userDropdown = document.getElementById("user-dropdown");
    var signinLink = document.getElementById("signin-link");

    if (signedIn) {
        userDropdown.style.display = "block";
        signinLink.style.display = "none";
    } else {
        userDropdown.style.display = "none";
        signinLink.style.display = "block";
    }


});
