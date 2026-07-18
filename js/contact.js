// Contact form validation — demonstrates event handling, DOM manipulation,
// and dynamic content updates without a backend (client-side only).

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  message: document.getElementById("message"),
};

const errors = {
  name: document.getElementById("error-name"),
  email: document.getElementById("error-email"),
  phone: document.getElementById("error-phone"),
  message: document.getElementById("error-message"),
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_REGEX = /^\d+$/;

function setError(field, message) {
  errors[field].textContent = message;
  fields[field].classList.toggle("invalid", Boolean(message));
}

function validateName() {
  const value = fields.name.value.trim();
  if (!value) {
    setError("name", "Name is required.");
    return false;
  }
  setError("name", "");
  return true;
}

function validateEmail() {
  const value = fields.email.value.trim();
  if (!value) {
    setError("email", "Email address is required.");
    return false;
  }
  if (!EMAIL_REGEX.test(value)) {
    setError("email", "Please enter a valid email address.");
    return false;
  }
  setError("email", "");
  return true;
}

function validatePhone() {
  const value = fields.phone.value.trim();
  if (!value) {
    setError("phone", "Phone number is required.");
    return false;
  }
  if (!PHONE_DIGITS_REGEX.test(value)) {
    setError("phone", "Phone number must contain digits only.");
    return false;
  }
  setError("phone", "");
  return true;
}

function validateMessage() {
  const value = fields.message.value.trim();
  if (!value) {
    setError("message", "Message cannot be empty.");
    return false;
  }
  setError("message", "");
  return true;
}

// Validate on the fly as the user types/leaves a field
fields.name.addEventListener("blur", validateName);
fields.email.addEventListener("blur", validateEmail);
fields.phone.addEventListener("blur", validatePhone);
fields.message.addEventListener("blur", validateMessage);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const validations = [
    validateName(),
    validateEmail(),
    validatePhone(),
    validateMessage(),
  ];

  const isValid = validations.every(Boolean);

  status.classList.remove("show", "success", "error");

  if (!isValid) {
    status.textContent = "Please fix the highlighted fields before submitting.";
    status.classList.add("show", "error");
    return;
  }

  const submittedName = fields.name.value.trim();
  status.textContent = `Thanks, ${submittedName}! Your message has been received. (This is a demo form — no data is sent to a server.)`;
  status.classList.add("show", "success");

  form.reset();
  Object.keys(fields).forEach((key) => fields[key].classList.remove("invalid"));
  Object.keys(errors).forEach((key) => (errors[key].textContent = ""));
});
