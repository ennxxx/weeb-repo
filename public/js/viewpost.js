
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
// ||    Edit Post Interface    ||
// ||___________________________||
// '                    

const editPostContainer = document.createElement("div");
editPostContainer.innerHTML = `<div id="edit-overlay" style="display: none;"></div>
  <div id="edit-popup" style="display: none;">
      <span id="edit-close" onclick="closeEditPopup()">✕</span>
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
      </div>
  </div>`;

function openEditPopup() {
  document.getElementById("edit-overlay").style.display = "";
  document.getElementById("edit-popup").style.display = "";
}

function closeEditPopup() {
  document.getElementById("edit-overlay").style.display = "none";
  document.getElementById("edit-popup").style.display = "none";
}

function openEditPost(post_id) {

  // Get the information of popup
  const editTitleInput = editPostContainer.querySelector("#edit-title");
  const editContentInput = editPostContainer.querySelector("#edit-content");
  const editUrlInput = editPostContainer.querySelector("#edit-url");

  // Get submit button
  const editSubmitBtn = editPostContainer.querySelector("#edit-popup-submit");

  // Get information from document
  var title = document.querySelector("#title-" + post_id);
  var content = document.querySelector("#text-" + post_id);
  var img = document.querySelector("#sample-" + post_id);

  // Fill with original values
  editTitleInput.value = title.innerText;
  editContentInput.innerHTML = content.innerText;
  editUrlInput.value = img.innerText;

  // Edit Button (Not working correctly)
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
      } else {
        console.error("Bad request");
      }
    } catch (error) {
      console.error("Error during post update:", error);
    }
    closeEditPopup();
  });

  // Display the popup
  document.body.appendChild(editPostContainer);
}

document.addEventListener("DOMContentLoaded", function () {

  var editButtons = document.querySelectorAll(".edit-button");

  editButtons.forEach(function (editButton) {
    var post_id = editButton.closest(".view-post-container").id;
    editButton.addEventListener("click", function () {
      openEditPost(post_id);
    })
  })
})

// ._____________________________.
// ||                           ||
// ||        Delete Post        ||
// ||___________________________||
// '                    

async function deletePost(post_id) {
  try {
    const response = await fetch(`/post/${post_id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.status === 200) {
      console.log("Post deleted");
      window.location.href = "/";
    } else {
      console.error("Bad request");
    }
  } catch (error) {
    console.error("Error during post deletion:", error);
  }

}

document.addEventListener("DOMContentLoaded", function () {

  var deleteButtons = document.querySelectorAll(".delete-button");

  deleteButtons.forEach(function (deleteButton) {
    var post_id = deleteButton.closest(".view-post-container").id;
    deleteButton.addEventListener("click", function () {
      deletePost(post_id);
    })
  })
})



