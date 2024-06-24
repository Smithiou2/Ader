const numeroCelularInput = document.getElementById('numeroCelular');

numeroCelularInput.addEventListener('input', () => {
  const phoneRegex = /^\d{10}$/; // 10-digit phone number format
  const phoneNumber = numeroCelularInput.value.replace(/\D/g, ''); // Remove non-digit characters

  if (phoneRegex.test(phoneNumber)) {
    numeroCelularInput.classList.remove('error'); // Remove error class if valid
  } else {
    numeroCelularInput.classList.add('error'); // Add error class if invalid
  }
});
