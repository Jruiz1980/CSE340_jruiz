function showPassword() {
  const passwordInput = document.querySelector("#password");
  const passButton = document.querySelector("#pswdBtn");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passButton.textContent = "Hide Password";
  } else {
    passwordInput.type = "password";
    passButton.textContent = "Show Password";
  }
}
