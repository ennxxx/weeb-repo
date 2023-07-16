
// .________________________.
// ||			                 ||
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
          <button class="edit-toolbar-buttons" onclick="makeBullet()"><img src="/static/images/icons/bullet.png" alt="Bullet Form"></button>
          <button class="edit-toolbar-buttons" onclick="insertImage()"><img src="/static/images/icons/image.png" alt="Insert Image"></button>
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
          <button class="toolbar-buttons" onclick="makeBullet()"><img src="/static/images/icons/bullet.png"
                  alt="Bullet Form"></button>
          <button class="toolbar-buttons" onclick="insertImage()"><img src="/static/images/icons/image.png"
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


document.addEventListener("DOMContentLoaded",function() {

  // .________________________.
  // ||			                 ||
  // ||      Save Post       ||
  // ||______________________||
  // '			                  '
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
  // ||			                 ||
  // ||     Vote Buttons     ||
  // ||______________________||
  // '			                  '
  
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

  // .________________________.
  // ||			                 ||
  // ||     submits post     ||
  // ||______________________||
  // '			                  '
document.addEventListener("DOMContentLoaded",function() {
  document.querySelector("#popup-submit")?.addEventListener("click", async e =>{
    e.preventDefault();

    const content = document.querySelector("#content").innerText;
    const title = document.getElementById("title").value; 
    const image = document.getElementById("url").value;
    const author = currentUser.name;

    console.log({title, author, content, image});
    const jString = JSON.stringify({title, author, content, image});
    console.log(jString);

    const response = await fetch("/post", {
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

    resetCreatePost();
    document.getElementById("submit-message").innerHTML = "Post Submitted!";
    document.getElementById("submit-message").style.color = "green";
    
  })
});
