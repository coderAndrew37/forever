import { baseUrl } from "./constants.js";
import { showToast } from "./utils/toast.js";

// ✅ Fetch & Render Testimonials
async function fetchTestimonials() {
  try {
    const response = await fetch(`${baseUrl}/api/testimonials/admin`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to fetch testimonials");

    const testimonials = await response.json();
    renderTestimonials(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    showToast("Failed to load testimonials", "error");
  }
}

// ✅ Render Testimonials in Table
function renderTestimonials(testimonials) {
  const tableBody = document.getElementById("testimonialsTable"); // Match the ID in HTML
  tableBody.innerHTML = testimonials
    .map(
      (t) => `
    <tr>
      <td class="border px-4 py-2">${t.name}</td>
      <td class="border px-4 py-2">${t.text}</td>
      <td class="border px-4 py-2">${t.rating} ★</td>
      <td class="border px-4 py-2">
        ${
          t.photo
            ? `<img src="${t.photo}" alt="Testimonial Image" class="w-16 h-16 rounded-full"/>`
            : "No Image"
        }
      </td>
      <td class="border px-4 py-2">
        ${
          t.video
            ? `<video src="${t.video}" controls class="w-32 h-32"></video>`
            : "No Video"
        }
      </td>
      <td class="border px-4 py-2">
        ${
          t.approved
            ? '<span class="text-green-500">Approved</span>'
            : `<button class="approve-btn bg-green-500 text-white px-3 py-1 rounded" data-id="${t._id}">Approve</button>`
        }
        <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded" data-id="${
          t._id
        }">Delete</button>
      </td>
    </tr>`
    )
    .join("");

  attachEventListeners(); // ✅ Attach event listeners after rendering
}

// ✅ Attach Event Listeners
function attachEventListeners() {
  document.querySelectorAll(".approve-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const testimonialId = event.target.dataset.id;
      await approveTestimonial(testimonialId);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const testimonialId = event.target.dataset.id;
      await deleteTestimonial(testimonialId);
    });
  });
}

// ✅ Approve Testimonial
async function approveTestimonial(testimonialId) {
  try {
    const response = await fetch(
      `${baseUrl}/api/testimonials/${testimonialId}/approve`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Failed to approve testimonial");

    showToast("Testimonial approved!", "success");
    fetchTestimonials();
  } catch (error) {
    console.error("Error approving testimonial:", error);
    showToast("Failed to approve", "error");
  }
}

// ✅ Delete Testimonial
async function deleteTestimonial(testimonialId) {
  if (!confirm("Are you sure you want to delete this testimonial?")) return;

  try {
    const response = await fetch(
      `${baseUrl}/api/testimonials/${testimonialId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }, // Ensure proper headers
      }
    );

    if (!response.ok) throw new Error("Failed to delete testimonial");

    showToast("Testimonial deleted!", "success");
    fetchTestimonials();
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    showToast("Failed to delete", "error");
  }
}

// ✅ Initialize on Page Load
document.addEventListener("DOMContentLoaded", fetchTestimonials);
