
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
  

  
  