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
        this.img = "./images/" + name + ".png";
    }
    
    const Post = function(user, content, title, url){
        this.user = user;
        this.content = content;
        this.title = title;
        this.img = url;
    }
    
    let posts = [];
    let postCtr = 0;
    let currentUser = new User("shellyace");

// ._____________________________.
// ||                           ||
// ||      Text Functions       ||
// ||___________________________||
// '                             '

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
        return url;
    }

    function checkTitleLength() {
        var title = document.getElementById("title").value;
        document.getElementById("title-count").textContent = title.length + "/50";
    }
        
// ._____________________________.
// ||                           ||
// ||     Edit/Delete Posts     ||
// ||___________________________||
// '                             '
    
    function deletePost(post) {
        const index = posts.indexOf(post);
        if (index > -1) {
            posts.splice(index, 1);
        }
    }    

    function closeEditPost() {
        document.getElementById("edit-overlay").style.display = "none";
        document.getElementById("edit-popup").style.display = "none";
    }
    
    function openEditPost(post) {
        const editPostContainer = document.createElement("div");
        editPostContainer.innerHTML = `<div id="edit-overlay" style="display: none;"></div>
        <div id="edit-popup" style="display: none;">
            <span id="edit-close">✕</span>
            <h2>Edit a post</h2>
            <div id="edit-title-container">
                <textarea id="edit-title" placeholder="Title" maxlength="50" oninput="checkEditTitleLength()"></textarea>
                <span id="edit-title-count">0/50</span>
            </div>
    
            <div id="edit-toolbar">
                <button class="edit-toolbar-buttons" onclick="makeBold()"><strong>B</strong></button>
                <button class="edit-toolbar-buttons" onclick="makeUnderline()"><u>U</u></button>
                <button class="edit-toolbar-buttons" onclick="makeItalic()"><em>I</em></button>
                <button class="edit-toolbar-buttons" onclick="makeBullet()"><img src="images/icons/bullet.png" alt="Bullet Form"></button>
                <button class="edit-toolbar-buttons" onclick="insertImage()"><img src="images/icons/image.png" alt="Insert Image"></button>
            </div>
    
            <div id="edit-content" contenteditable="true" placeholder="Content" style="border: 1px solid #ccc; padding: 5px;"></div>
            <br>
    
            <div>
                <label for="edit-url">URL:</label>
                <input type="text" id="edit-url" placeholder="Enter URL" style="padding: 15px 10px; margin: 0;">
            </div>
            <br>
    
            <div id="edit-actions">
                <button id="edit-popup-submit">Submit</button>
                <button id="edit-popup-delete">Delete</button>
            </div>
        </div>`;
    
        // Edit post elements
        const editTitleInput = editPostContainer.querySelector("#edit-title");
        const editContentInput = editPostContainer.querySelector("#edit-content");
        const editUrlInput = editPostContainer.querySelector("#edit-url");
        const editSubmitBtn = editPostContainer.querySelector("#edit-popup-submit");
        const editDeleteBtn = editPostContainer.querySelector("#edit-popup-delete");
        const editCloseBtn = editPostContainer.querySelector("#edit-close");
    
        // Get the original values
        editTitleInput.value = post.title;
        editContentInput.innerHTML = post.content;
        editUrlInput.value = post.img;
    
        editSubmitBtn.addEventListener("click", () => {
            const updatedTitle = editTitleInput.value;
            const updatedContent = editContentInput.innerHTML;
            const updatedUrl = editUrlInput.value;
    
            // Update with new values
            post.title = updatedTitle;
            post.content = updatedContent;
            post.img = updatedUrl;
    
            closeEditPost();
            refreshDisplay(posts);
        });

        editDeleteBtn.addEventListener("click", () => {
            deletePost(post);
            closeEditPost();
            refreshDisplay(posts);
        });
    
        editCloseBtn.addEventListener("click", () => {
            closeEditPost();
        });

        document.body.appendChild(editPostContainer);
    
        // Display the popup
        document.getElementById("edit-overlay").style.display = "";
        document.getElementById("edit-popup").style.display = "";
    }
    
// ._____________________________.
// ||                           ||
// ||   Create Post Interface   ||
// ||___________________________||
// '                             '

    function openPopup() {
        document.getElementById("overlay").style.display = "";
        document.getElementById("popup").style.display = "";
    }

    function closePopup() {
        document.getElementById("overlay").style.display = "none";
        document.getElementById("popup").style.display = "none";
    }

    function openCreatePost() {
        const createPostContainer = document.createElement("div");
        createPostContainer.innerHTML = `<div id="overlay" style="display: none;"></div>
        <div id="popup" style="display: none;">
            <span id="close" onclick="closePopup()">✕</span>
            <h2>Create a post</h2>
            <div id="title-container">
                <textarea id="title" placeholder="Title" maxlength="50"
                    oninput="checkTitleLength()"></textarea>
                <span id="title-count">0/50</span>
            </div>

            <div id="toolbar">
                <button class="toolbar-buttons" onclick="makeBold()"><strong>B</strong></button>
                <button class="toolbar-buttons" onclick="makeUnderline()"><u>U</u></button>
                <button class="toolbar-buttons" onclick="makeItalic()"><em>I</em></button>
                <button class="toolbar-buttons" onclick="makeBullet()"><img src="images/icons/bullet.png"
                        alt="Bullet Form"></button>
                <button class="toolbar-buttons" onclick="insertImage()"><img src="images/icons/image.png"
                        alt="Insert Image"></button>
            </div>

            <div id="content" contenteditable="true" placeholder="Content"
                style="border: 1px solid #ccc; padding: 5px;"></div>
            <br>

            <div>
                <label for="url">URL:</label>
                <input type="text" id="url" placeholder="Enter URL" style="padding: 15px 10px; margin: 0;">
            </div>
            <br>
            <button id="popup-submit">Submit</button>
        </div>`;

        document.body.appendChild(createPostContainer);
    }

// ._____________________________.
// ||                           ||
// ||   Create Post Functions   ||
// ||___________________________||
// '                             '
    
    function submitPost() {
        const content = document.querySelector("#content").innerHTML;
        const title = document.getElementById("title").value;
        const url = document.getElementById("url").value;

        let post = new Post(currentUser, content, title, url);
        posts.unshift(post); 

        closePopup();
        resetCreatePost();
        refreshDisplay(posts);
    }

    function resetCreatePost() {
        document.getElementById("title").value = "";
        document.getElementById("content").innerHTML = "";
        document.getElementById("url").value = "";
    }

    function refreshDisplay(displayedPosts) {
        const postsContainer = document.querySelector(".posts-container");
        postsContainer.innerHTML = ""; 
        displayPosts(displayedPosts);
    }

    function displayPosts(newPosts) {
        for (let i = newPosts.length - 1; i >= 0; i--) {
            displayPost(newPosts[i]);
        }
    }
    
    function displayPost(newPost) {
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
        const spText = document.createElement("p");
        const spSample = document.createElement("img");
        const spPostAction = document.createElement("div");
        const spEditBtn = document.createElement("button");
        const spEditPost = document.createElement("p");
        const spCommentBtn = document.createElement("button");
        const spCommentNum = document.createElement("p");
        const spSaveBtn = document.createElement("button");

        postMain.className = "post-container";
        spVote.className = "vote";
        spUp.className = "upvote-button";
        spNumVote .className = "num-votes";
        spDown.className = "downvote-button";
        spContent.className = "content";
        spPostContent.className = "post-content";
        spclickable1.className = "post-clickable";
        spclickable2.className = "post-clickable";
        spclickable3.className = "post-clickable";
        spTitle.className = "title";
        spAuthor.className = "author";
        spText.className = "text";
        spSample.className = "sample";
        spPostAction.className = "post-actions";
        spEditBtn.className = "edit-button";
        spEditPost.className = "edit-post";
        spCommentBtn.className = "comment-button";
        spCommentNum.className = "comment-num";
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
        spPostAction.appendChild(spEditBtn);
        spPostAction.appendChild(spEditPost);
        spPostAction.appendChild(spCommentBtn);
        spPostAction.appendChild(spCommentNum);
        spPostAction.appendChild(spSaveBtn);
        
        spNumVote.innerText = 0;
        spUp.innerHTML = `<img src="images/post/upvote.png" class="upvote">`;
        spDown.innerHTML = `<img src="images/post/downvote.png" class="downvote">`;
        spTitle.innerText = newPost.title;
        spText.innerHTML = newPost.content;
        spSample.src = newPost.img;
        spAuthor.innerHTML =` by <a href="main-profile.html">` + newPost.user.name + `</a>`;
        spEditBtn.innerHTML = `<img src="images/post/edit.png" class="edit">`;
        spEditPost.innerText = "Edit Post";
        spCommentBtn.innerHTML = `<img src="images/post/comment.png" class="comment">`;
        spCommentNum.innerText = "0 Comments";
        spSaveBtn.innerHTML=`<img src="images/post/save.png" class="save">`;
        
        postContainer.prepend(postMain);

        spSaveBtn.addEventListener("click", savePost);
        spUp.addEventListener("click", upvotePost);
        spDown.addEventListener("click", downvotePost);
        
        spEditBtn.addEventListener("click", function () {
            openEditPost(newPost);
        });     

        function savePost() {
            if (spSaveBtn.querySelector("img").src.includes("save.png")) {
            spSaveBtn.querySelector("img").src = "images/post/clicked/c-saved.png";
            } else {
            spSaveBtn.querySelector("img").src = "images/post/save.png";
            }
        }

        function upvotePost() {
            if (
            spUp.querySelector("img").src.includes("upvote.png") &&
            spDown.querySelector("img").src.includes("downvote.png")
            ) {
            spUp.querySelector("img").src = "images/post/clicked/c-upvoted.png";
            spNumVote.textContent++;
            } else if (
            spDown.querySelector("img").src.includes("c-downvoted.png")
            ) {
            spUp.querySelector("img").src = "images/post/clicked/c-upvoted.png";
            spDown.querySelector("img").src = "images/post/downvote.png";
            spNumVote.textContent++;
            spNumVote.textContent++;
            } else {
            spUp.querySelector("img").src = "images/post/upvote.png";
            spNumVote.textContent--;
            }
        }

        function downvotePost() {
            if (
            spDown.querySelector("img").src.includes("downvote.png") &&
            spUp.querySelector("img").src.includes("upvote.png")
            ) {
            spDown.querySelector("img").src =
                "images/post/clicked/c-downvoted.png";
            spUp.querySelector("img").src = "images/post/upvote.png";
            spNumVote.textContent--;
            } else if (
            spUp.querySelector("img").src.includes("c-upvoted.png")
            ) {
            spDown.querySelector("img").src =
                "images/post/clicked/c-downvoted.png";
            spUp.querySelector("img").src = "images/post/upvote.png";
            spNumVote.textContent--;
            spNumVote.textContent--;
            } else {
            spDown.querySelector("img").src = "images/post/downvote.png";
            spNumVote.textContent++;
            }
        }
    }
        
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelector("#popup-submit")?.addEventListener("click", function (e) {
            e.preventDefault();
            submitPost();
        });
    });
