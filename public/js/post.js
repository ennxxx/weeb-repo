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
// ||      Create Post     ||
// ||______________________||
// '			

  function openPopup() {
      document.getElementById("overlay").style.display = "";
      document.getElementById("popup").style.display = "";
  }

  function closePopup() {
    document.getElementById("submit-message").innerHTML = "";
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
   
    return url;
  }
  
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
