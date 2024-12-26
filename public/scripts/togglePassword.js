function togglePassword(inputId) {
  const passwordInput = document.getElementById(inputId);
  const toggleButton = passwordInput.nextElementSibling;

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleButton.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    toggleButton.textContent = "Show";
  }
}
