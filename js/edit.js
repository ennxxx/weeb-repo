// .________________________.
// ||			           ||
// ||    Change Profile    ||
// ||______________________||
// '			            ' 

document.addEventListener("DOMContentLoaded", function() {
    var changeButton = document.querySelector("#change-image-btn");
    changeButton.addEventListener("click", changeProfile);

    function changeProfile() {
        var mediaInput = document.createElement("input");
        mediaInput.type = "file";
        mediaInput.accept = "image/*";
        mediaInput.style.display = "none";

        mediaInput.addEventListener("change", function(event) {
            var file = event.target.files[0];
            var reader = new FileReader();

            reader.onload = function(e) {
                var newProfileMain = document.getElementById("profile-pic");

                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");

                var image = new Image();
                image.onload = function() {
                    var imageWidth = image.width;
                    var imageHeight = image.height;

                    var cropSize = 800; // Adjust this value to change the crop size

                    var cropX = Math.max(0, (imageWidth - cropSize) / 2);
                    var cropY = Math.max(0, (imageHeight - cropSize) / 2);
                    var cropWidth = Math.min(cropSize, imageWidth);
                    var cropHeight = Math.min(cropSize, imageHeight);

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

                    newProfileMain.src = canvas.toDataURL();
                };

                image.src = e.target.result;
            };

            reader.readAsDataURL(file);
        });

        mediaInput.click();
    }
});
