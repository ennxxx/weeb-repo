
document.addEventListener("DOMContentLoaded", function () {

    // .________________________.
    // ||			           ||
    // ||       Register       ||
    // ||______________________||
    // '			            '
  
    /* Declaration of Variables */
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    const passwordMatchIcon = document.getElementById('password-match-icon');
  
    /* Function for checking if both passwords match */
    function checkPasswordMatch() {
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
  
      if (password === confirmPassword) {
        passwordMatchIcon.textContent = '✓';
      } else {
        passwordMatchIcon.textContent = '✕';
      }
    }
  
    /* Getting the input */
    usernameInput.addEventListener('input', checkUsername);
    passwordInput.addEventListener('input', checkPasswordMatch);
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);

    const registerButton = document.getElementById('register-button');
    registerButton.addEventListener('click', async function () {
      const username = usernameInput.value;
      const password = passwordInput.value;
  
      try {
        // Check if passwords match before sending the registration data
        checkPasswordMatch();
  
        // Check if passwords match before sending the registration data
        const isPasswordMatch = passwordInput.value === confirmPasswordInput.value;
        if (!isPasswordMatch) {
          console.log("Passwords do not match");
          return; // Exit the function if passwords don't match
        }
  
        // Send the registration data to the server
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
  
        // Check the response status to see if the registration was successful
        if (response.status === 200) {
          console.log("Registration successful");
          // Perform any other actions here, e.g., show a success message, redirect to another page
        } else {
          console.log("Registration failed");
          // Show an error message or perform other actions for a failed registration attempt
        }
      } catch (error) {
        console.error("Error during registration:", error);
        // Handle the error as needed
      }
    });
  });
    
  });
  