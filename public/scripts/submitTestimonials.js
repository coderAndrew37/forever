import { baseUrl } from "./constants.js";
import { showToast } from "./utils/toast.js";

const modal = document.getElementById("testimonialModal");
const closeModalButton = document.getElementById("closeTestimonialModal");
const openModalButton = document.getElementById("openTestimonialModal");

// ✅ Open Modal
openModalButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// ✅ Close Modal on Cancel Button Click
closeModalButton.addEventListener("click", () => {
  closeModal();
});

// ✅ Close Modal when Clicking Outside
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// ✅ Close Modal on `Escape` Key Press
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

// ✅ Close Modal Function
function closeModal() {
  modal.classList.add("hidden");
}

// ✅ Submit Testimonial
document
  .getElementById("submitTestimonial")
  .addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("testimonialName").value.trim();
    const text = document.getElementById("testimonialText").value.trim();
    const rating = parseInt(
      document.getElementById("testimonialRating").value,
      10
    );
    const photoInput = document.getElementById("testimonialPhoto").files[0];
    const videoInput = document.getElementById("testimonialVideo").files[0];

    if (!name || !text || isNaN(rating) || rating < 3 || rating > 5) {
      showToast(
        "Please fill all fields correctly. Only 3★ and above allowed.",
        "error"
      );
      return;
    }

    // ✅ Validate file size (Max: 5MB for images, 50MB for videos)
    if (photoInput && photoInput.size > 5 * 1024 * 1024) {
      showToast("Image file is too large. Max size: 5MB.", "error");
      return;
    }
    if (videoInput && videoInput.size > 50 * 1024 * 1024) {
      showToast("Video file is too large. Max size: 50MB.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("text", text);
    formData.append("rating", rating);
    if (photoInput) formData.append("photo", photoInput);
    if (videoInput) formData.append("video", videoInput);

    try {
      const response = await fetch(`${baseUrl}/api/testimonials`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        showToast("Thank you! Your review is pending approval.", "success");

        setTimeout(() => {
          closeModal();
          document.getElementById("testimonialForm").reset();
        }, 2000);
      } else {
        showToast("Error: " + result.error, "error");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      showToast("Something went wrong. Please try again.", "error");
    }
  });
