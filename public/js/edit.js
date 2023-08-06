// .________________________.
// ||			                 ||
// ||      Edit Profile    ||
// ||______________________||
// '			                  ' 

async function editProfile() {
  const newName = document.getElementById("new-name").value;
  const newBio = document.getElementById("new-bio").value;

  try {
    const requestBody = { name: newName, bio: newBio };

    const response = await fetch(`/edit-profile`, {
      method: 'PUT',
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.status === 200) {
      console.log("Profile updated");
      window.location.href = "/main-profile";
      // Optionally, you can update the profile content on the page here
    } else {
      console.error("Bad request");
    }
  } catch (error) {
    console.error("Error during profile update:", error);
  }
}

// .________________________.
// ||			                 ||
// ||   Profile Picture    ||
// ||______________________||
// '			                  ' 

document.addEventListener('DOMContentLoaded', () => {
  const imageInput = document.getElementById('image-input');
  const changeImageBtn = document.getElementById('edit-change-image-btn');
  const profilePics = document.getElementsByClassName('edit-profile');

  Array.from(profilePics).forEach(profilePic => {
    imageInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const image = new Image();
          image.onload = function () {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            const imageWidth = image.width;
            const imageHeight = image.height;

            const cropSize = 800; // Adjust this value to change the crop size

            const cropX = Math.max(0, (imageWidth - cropSize) / 2);
            const cropY = Math.max(0, (imageHeight - cropSize) / 2);
            const cropWidth = Math.min(cropSize, imageWidth);
            const cropHeight = Math.min(cropSize, imageHeight);

            canvas.width = 300;
            canvas.height = 300;

            context.drawImage(
              image,
              cropX,
              cropY,
              cropWidth,
              cropHeight,
              0,
              0,
              300,
              300
            );

            const formData = new FormData();
            formData.append('profilePic', dataURItoBlob(canvas.toDataURL()));

            fetch('/upload-profile-pic', {
              method: 'POST',
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                profilePic.src = `/static/images/profile/${data.filename}`;
              })
              .catch((error) => {
                console.error('Error uploading image:', error);
              });
          };
          image.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // When the "Change Image" button is clicked, trigger the file input click
  changeImageBtn.addEventListener('click', () => {
    imageInput.click();
  });
});

// Function to convert Data URI to Blob
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}


