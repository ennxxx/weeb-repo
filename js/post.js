    // Open popup
  function openPopup() {
      document.getElementById("overlay").style.display = "";
      document.getElementById("popup").style.display = "";
  }

  // Close popup
  function closePopup() {
    document.getElementById("submit-message").innerHTML = "";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
  }

  function openEditPopup() {
    document.getElementById('edit-overlay').style.display = 'block';
    document.getElementById('edit-post-popup').style.display = 'block';
}

function closeEditPopup() {
    document.getElementById('edit-overlay').style.display = 'none';
    document.getElementById('edit-post-popup').style.display = 'none';
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
   
    return url;
  }
  
  // Submit button

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

document.addEventListener("DOMContentLoaded",function() {
  document.querySelector("#popup-submit")?.addEventListener("click", function(e){
    e.preventDefault();

    const content = document.querySelector("#content").innerHTML;
    const title = document.getElementById("title").value;  const text= document.getElementById("content").value;
    const url = document.getElementById("url").value;
    
    let post = new Post(currentUser, content, title, url);
    posts.push(post);
    postCtr++;
    console.log(posts[0].user.name);
    refreshDisplay(post);
    resetCreatePost();
    document.getElementById("submit-message").innerHTML = "Post Submitted!";
    document.getElementById("submit-message").style.color = "green";
    
    
  })


  
});
function refreshDisplay(displayedPosts) {
  const postsContainer = document.querySelector(".posts-container")
  //postsContainer.innerHTML = ""; // Clear post-container
  displayPosts(displayedPosts);

  }
  function displayPosts(newPost) {
    
  // Clear post-container and add each post inside newPosts inside it instead
    //for (let i = newPost.length - 1; i >= 0; i--) {
      displayPost(newPost/*[i]*/);
    //}
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
    spclickable1.className = "post-clickable";
    spclickable2.className = "post-clickable";
    spclickable3.className = "post-clickable";
    spTitle.className = "title";
    spAuthor.className = "author";
    spText.className = "text";
    spSample.className = "sample";
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
    spPostAction.appendChild(spCommentBtn);
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
    spAuthor.innerHTML =` by <a href="main-profile.html">` + newPost.user.name + `</a>`;
    spCommentBtn.innerHTML = `<img src="images/post/comment.png" class="comment">`;
    spCommentNum.innerText = "0 Comments";
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
