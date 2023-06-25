document.addEventListener("DOMContentLoaded",function() {

// .________________________.
// ||			                 ||
// ||        Sign In       ||
// ||______________________||
// '			                  '

var signedIn = true;
var userDropdown = document.getElementById("user-dropdown");
var profilePic = document.getElementById("profile");
var signinLink = document.getElementById("signin-link");

if (signedIn) {
    userDropdown.style.display = "block";
    profilePic.style.display = "block";
    signinLink.style.display = "none";
} else {
    userDropdown.style.display = "none";
    profilePic.style.display = "none";
    signinLink.style.display = "block";
}
    
// .________________________.
// ||			                 ||
// ||    Change Profile    ||
// ||______________________||
// '			                  ' 

var changeButton = document.querySelector("#change-image-btn");
changeButton.addEventListener("click", changeProfile);

function changeProfile() {
	var mediaInput = document.createElement("input");
	mediaInput.type = "file";
	mediaInput.accept = "image/*";
	mediaInput.style.display = "none";
  
	mediaInput.addEventListener("change", function (event) {
	  var file = event.target.files[0];
	  var reader = new FileReader();
  
	  reader.onload = function (e) {
      var newProfileMain = document.getElementById("profile-pic");
      newProfileMain.src = e.target.result;
      var newProfileNav = document.getElementById("profile");
      newProfileNav.src = e.target.result;
      var newProfilePost = document.getElementsByClassName("post-profile")[0];
      newProfilePost.src = e.target.result;
	  };
  
	  reader.readAsDataURL(file);
	});
  
	mediaInput.click();
  }
  
});