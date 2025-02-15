import { baseUrl } from "./constants.js";
document
  .getElementById("bookingForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      date: document.getElementById("date").value,
      message: document.getElementById("message").value,
    };

    try {
      const response = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Booking submitted successfully!");
        document.getElementById("bookingForm").reset();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong, please try again.");
    }
  });
