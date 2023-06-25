document.addEventListener("DOMContentLoaded",function() {
    
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