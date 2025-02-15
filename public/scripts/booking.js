import { baseUrl } from "./constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const submitBtn = form.querySelector("button[type='submit']");
  const messageBox = document.createElement("p");
  messageBox.className = "text-center text-sm mt-2";
  form.appendChild(messageBox);

  // ✅ Disable past dates
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("date").setAttribute("min", today);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    messageBox.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      date: form.date.value.trim(),
      message: form.message.value.trim(),
    };

    // ✅ Basic Client-side Validation
    if (!formData.name || formData.name.length < 3) {
      return showError("Full Name must be at least 3 characters.");
    }
    if (!/^\+?\d{10,15}$/.test(formData.phone)) {
      return showError("Enter a valid phone number.");
    }
    if (!formData.date) {
      return showError("Please select a preferred date.");
    }
    if (formData.message.length < 10) {
      return showError("Message should be at least 10 characters long.");
    }

    try {
      const response = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess("Booking submitted successfully! We'll contact you soon.");
        form.reset();
      } else {
        showError(result.error || "Error submitting booking.");
      }
    } catch (error) {
      console.error("Error:", error);
      showError("Something went wrong, please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });

  // ✅ Helper Functions for UI Feedback
  function showSuccess(message) {
    messageBox.textContent = message;
    messageBox.className = "text-center text-green-600 text-sm mt-2";
  }

  function showError(message) {
    messageBox.textContent = message;
    messageBox.className = "text-center text-red-600 text-sm mt-2";
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});
