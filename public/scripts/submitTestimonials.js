import { baseUrl } from "./constants.js";
import { fetchTestimonials } from "./testimonials.js"; // ✅ Import fetch function
import { showToast } from "./utils/toast.js"; // ✅ Import toast notifications

document
  .getElementById("openTestimonialModal")
  .addEventListener("click", () => {
    document.getElementById("testimonialModal").classList.remove("hidden");
  });

document
  .getElementById("closeTestimonialModal")
  .addEventListener("click", () => {
    document.getElementById("testimonialModal").classList.add("hidden");
  });

// ✅ Ensure Form Submission Works Correctly
document
  .getElementById("submitTestimonial")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const name = document.getElementById("testimonialName").value.trim();
    const text = document.getElementById("testimonialText").value.trim();
    const rating = parseInt(
      document.getElementById("testimonialRating").value,
      10
    );
    const photoInput = document.getElementById("testimonialPhoto").files[0];
    const testimonialForm = document.getElementById("testimonialForm");

    if (!name || !text || isNaN(rating) || rating < 3 || rating > 5) {
      showToast(
        "Please fill all fields correctly. Only 3★ and above allowed.",
        "error"
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("text", text);
    formData.append("rating", rating);
    if (photoInput) formData.append("photo", photoInput);

    try {
      const response = await fetch(`${baseUrl}/api/testimonials`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        showToast(
          "Thank you for your feedback! Your review is pending approval.",
          "success"
        );

        // ✅ Auto-hide modal & refresh testimonials
        setTimeout(() => {
          document.getElementById("testimonialModal").classList.add("hidden");
          testimonialForm.reset(); // ✅ Reset form
          fetchTestimonials(); // ✅ Refresh displayed testimonials
        }, 2000);
      } else {
        showToast("Error: " + result.error, "error");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      showToast("Something went wrong. Please try again.", "error");
    }
  });
