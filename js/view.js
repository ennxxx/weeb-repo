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

document.addEventListener("DOMContentLoaded",function() {

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
                                            '<img src="images/post/sample.png" class="sample">'+
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
                                            '<img src="images/post/sample.png" class="sample">'+
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
                                            '<img src="images/post/sample.png" class="sample">'+
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
                                            '<img src="images/post/sample.png" class="sample">'+
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
                                            '<img src="images/post/sample.png" class="sample">'+
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
            if (upvoteImage.src.includes("upvote.png") || downvoteImage.src.includes("c-downvoted.png")) {
                upvoteImage.src = "images/post/clicked/c-upvoted.png";
                downvoteImage.src = "images/post/downvote.png"
                numVotes.textContent++;
            } else {
                upvoteImage.src = "images/post/upvote.png";
                numVotes.textContent--;
            }
        }

        function downvotePost() {
            if (downvoteImage.src.includes("downvote.png") || upvoteImage.src.includes("c-upvoted.png")) {
                downvoteImage.src = "images/post/clicked/c-downvoted.png";
                upvoteImage.src = "images/post/upvote.png";
                numVotes.textContent--;
            } else {
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