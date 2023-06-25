document.addEventListener("DOMContentLoaded",function() {

// .________________________.
// ||			           ||
// ||        Sign In       ||
// ||______________________||
// '			            '

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
// ||			           ||
// ||    Change Profile    ||
// ||______________________||
// '			            '

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
		var newProfilePic = document.getElementById("profile-pic");
		newProfilePic.src = e.target.result;
		var newProfile = document.getElementById("profile");
		newProfile.src = e.target.result;
	  };
  
	  reader.readAsDataURL(file);
	});
  
	mediaInput.click();
  }

// .________________________.
// ||			           ||
// ||     Change Info      ||
// ||______________________||
// '			            '

    // Retrieve the name and bio input elements
    var nameInput = document.getElementById('new-name');
    var bioInput = document.getElementById('new-bio');
  
    // Add event listener to the save button
    document.getElementById('save').addEventListener('click', function () {
      // Get the input values
      var newName = nameInput.value;
      var newBio = bioInput.value;
  
      // Check if the name and bio inputs are empty
      if (newName.trim() === '' || newBio.trim() === '') {
        alert('Name and bio cannot be empty!');
        return;
      }
  
      // Redirect to the profile page with URL parameters
      window.location.href = 'uprofile.html?name=' + encodeURIComponent(newName) + '&bio=' + encodeURIComponent(newBio);
    });
  
    // Get the URL parameters
    var params = new URLSearchParams(window.location.search);
    var newName = params.get('name');
    var newBio = params.get('bio');
  
    // Update the name and bio elements on the profile page
    if (newName && newBio) {
      var nameElement = document.getElementById('name');
      var bioElement = document.getElementById('bio');
  
      nameElement.innerHTML = newName;
      bioElement.innerHTML = newBio;
    }


});