// Open popup
function openPopup() {
    document.getElementById("overlay").style.display = "";
    document.getElementById("popup").style.display = "";
}

  
  // Close popup
  function closePopup() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
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
    if (url) {
      document.execCommand("insertImage", false, url);
    }
  }
  
  // Handle popup submit
  document.getElementById("popup-submit").addEventListener("click", function () {
    var title = document.getElementById("title").value;
    var content = document.getElementById("content").innerHTML;
    var url = document.getElementById("url").value;
  
    // Perform any additional logic for submitting the popup data
  
    // Close the popup after submission
    closePopup();
  });
  