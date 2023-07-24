
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
// '                    

function openEditPost(title, content, img, post_id) {
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

  // Get the information
  const editTitleInput = editPostContainer.querySelector("#edit-title");
  const editContentInput = editPostContainer.querySelector("#edit-content");
  const editUrlInput = editPostContainer.querySelector("#edit-url");

  // Fill with original values
  editTitleInput.value = title.innerText;
  editContentInput.innerHTML = content.innerText;
  editUrlInput.value = img.innerText;

  // Get the buttons
  const editSubmitBtn = editPostContainer.querySelector("#edit-popup-submit");
  const editDeleteBtn = editPostContainer.querySelector("#edit-popup-delete");
  const editCloseBtn = editPostContainer.querySelector("#edit-close");

  // Edit Button
  editSubmitBtn.addEventListener("click", async () => {
    const updatedTitle = editTitleInput.value;
    const updatedContent = editContentInput.innerHTML;
    const updatedUrl = editUrlInput.value;

    try {
      const jString = JSON.stringify({ title: updatedTitle, content: updatedContent, img: updatedUrl });

      const response = await fetch(`/post/${post_id}`, {
        method: 'PUT',
        body: jString,
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        console.log("Post updated");
        location.reload();
        // Optionally, you can update the post content and image on the page here
      } else {
        console.error("Bad request");
      }
    } catch (error) {
      console.error("Error during post update:", error);
    }
    closeEditPost();
  });

  // Delete Button
  editDeleteBtn.addEventListener("click", async () => {
    try {
      const response = await fetch(`/post/${post_id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        console.log("Post deleted");
        location.reload();
        // Optionally, you can remove the deleted post from the page here
      } else {
        console.error("Bad request");
      }
    } catch (error) {
      console.error("Error during post deletion:", error);
    }
    closeEditPost();
  });

  editCloseBtn.addEventListener("click", () => {
    closeEditPost();
  });

  document.body.appendChild(editPostContainer);

  // Display the popup
  document.getElementById("edit-overlay").style.display = "";
  document.getElementById("edit-popup").style.display = "";
}

function closeEditPost() {
  document.getElementById("edit-overlay").style.display = "none";
  document.getElementById("edit-popup").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {

  var editButtons = document.querySelectorAll(".edit-button");

  editButtons.forEach(function (editButton) {
    editButton.addEventListener("click", function () {
      var parentPost = editButton.closest(".post-container");
      var title = parentPost.querySelector("#title-" + parentPost.id);
      var content = parentPost.querySelector("#text-" + parentPost.id);
      var image = parentPost.querySelector("#sample-" + parentPost.id);
      var post_id = parentPost.id;

      openEditPost(title, content, image, post_id);
    });
  });
});

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

// .________________________.
// ||			                 ||
// ||     Submits Post     ||
// ||______________________||
// '			                  '
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#popup-submit")?.addEventListener("click", async e => {
    e.preventDefault();

    const content = document.querySelector("#content").innerText;
    const title = document.getElementById("title").value;
    const image = document.getElementById("url").value;

    console.log({ title, content, image });
    const jString = JSON.stringify({ title, content, image });
    console.log(jString);

    const response = await fetch("/post", {
      method: 'POST',
      body: jString,
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    // Access the post_id from the response data
    const newPost = data.post_id;

    if (response.status == 200)
      window.location.href = '/view/'+ newPost;
    else
      console.error("Bad request");

    resetCreatePost();
    document.getElementById("submit-message").innerHTML = "Post Submitted!";
    document.getElementById("submit-message").style.color = "green";

  })
});

document.addEventListener("DOMContentLoaded", function () {

  // .________________________.
  // ||			                 ||
  // ||      Save Post       ||
  // ||______________________||
  // '			                  '
  var saveButtons = document.querySelectorAll(".save-button");

  saveButtons.forEach(function (saveButton) {
    var saveImage = saveButton.querySelector(".save");
    saveButton.addEventListener("click", savePost);
 
    async function savePost() {
      if (saveImage.src.includes("save.png")) {
        saveImage.src = "/static/images/post/clicked/c-saved.png";
      } else {
        saveImage.src = "/static/images/post/save.png";
      }
      const jString = JSON.stringify({ post_id });
      const response = await fetch("/save", {
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
  // ||			                 ||
  // ||     Vote Buttons     ||
  // ||______________________||
  // '			                  '

  var upvoteButtons = document.querySelectorAll(".upvote-button");

  upvoteButtons.forEach(function (upvoteButton, index) {
    var parentPost = upvoteButton.closest(".post-container"); // Get the closest parent post container
    var downvoteButton = parentPost.querySelector(".downvote-button");
    var numVotes = parentPost.querySelector(".num-votes");
    var post_id = parentPost.id;

    var upvoteImage = upvoteButton.querySelector(".upvote");
    var downvoteImage = downvoteButton.querySelector(".downvote");

    upvoteButton.addEventListener("click", upvotePost);
    downvoteButton.addEventListener("click", downvotePost);
    var votes= parseInt(numVotes.textContent)

    async function upvotePost() {
      if (upvoteImage.src.includes("upvote.png") && downvoteImage.src.includes("downvote.png")) {
        upvoteImage.src = "/static/images/post/clicked/c-upvoted.png";
        votes++;
      }
      else if (downvoteImage.src.includes("c-downvoted.png")) {
        upvoteImage.src = "/static/images/post/clicked/c-upvoted.png";
        downvoteImage.src = "/static/images/post/downvote.png"
        votes++;
        votes++;
      } else {
        upvoteImage.src = "/static/images/post/upvote.png";
        votes--;
      }

      const jString = JSON.stringify({ votes, post_id, check: "up" });
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
        votes--;
      }
      else if (upvoteImage.src.includes("c-upvoted.png")) {
        downvoteImage.src = "/static/images/post/clicked/c-downvoted.png";
        upvoteImage.src = "/static/images/post/upvote.png";
        votes--;
        votes--;
      }
      else {
        downvoteImage.src = "/static/images/post/downvote.png";
        votes++;
      }
      const jString = JSON.stringify({ votes, post_id, check: "down" });
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
});

