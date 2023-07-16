document.addEventListener("DOMContentLoaded", function () {

    // .________________________.
    // ||			           ||
    // ||       Register       ||
    // ||______________________||
    // '			            '
  
    /* Declaration of Variables */
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
    passwordInput.addEventListener('input', checkPasswordMatch);
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
  
  });
  