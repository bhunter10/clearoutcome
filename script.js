const form = document.querySelector("#beta-form");
const note = document.querySelector("#form-note");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  const formData = new FormData(form);
  const firstName = formData.get("firstName").trim();
  const lastName = formData.get("lastName").trim();
  const email = formData.get("email").trim();
  const phone = formData.get("phone").trim() || "Not provided";
  const userType = formData.get("userType");

  const subject = `ClearOutcome beta request - ${firstName} ${lastName}`;
  const body = [
    "I would like to request ClearOutcome beta user status.",
    "",
    `First name: ${firstName}`,
    `Last name: ${lastName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `User type: ${userType}`,
  ].join("\n");

  const mailto = new URL("mailto:team@clearoutcome.com");
  mailto.searchParams.set("subject", subject);
  mailto.searchParams.set("body", body);

  note.textContent = "Opening your email app with the beta request filled in.";
  window.location.href = mailto.toString();
});
