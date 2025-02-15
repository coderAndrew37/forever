import { baseUrl } from "./constants.js";

// ✅ Fetch & Render Testimonials (Only 3★ and Above)
async function fetchTestimonials() {
  try {
    const response = await fetch(`${baseUrl}/api/testimonials`);
    const testimonials = await response.json();
    renderTestimonials(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
  }
}

// ✅ Render Testimonials with Swiper
function renderTestimonials(testimonials) {
  const swiperContainer = document.querySelector(".swiper-wrapper");
  if (!swiperContainer) return;

  swiperContainer.innerHTML = testimonials
    .map(
      (t) => `
      <div class="swiper-slide bg-white p-6 rounded-lg shadow-md">
        <p class="text-gray-600 italic mb-4">"${t.text}"</p>
        <div class="flex justify-center mb-3">
          ${Array.from({ length: 5 })
            .map((_, i) =>
              i < t.rating
                ? `<i class="fas fa-star text-yellow-500"></i>`
                : `<i class="far fa-star text-gray-300"></i>`
            )
            .join("")}
        </div>
        <span class="block text-gray-800 font-semibold text-sm">
          - ${t.name}
        </span>
        ${
          t.photo
            ? `<img src="${t.photo}" class="mt-2 w-16 h-16 rounded-full mx-auto" />`
            : ""
        }
        ${
          t.video
            ? `<video class="mt-4 mx-auto w-full rounded-lg" controls>
                 <source src="${t.video}" type="video/mp4">
               </video>`
            : ""
        }
        <button 
          class="like-btn bg-yellow-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-yellow-600"
          data-id="${t._id}"
        >
          Like ❤️ (${t.likes})
        </button>
      </div>
    `
    )
    .join("");

  // ✅ Like Functionality
  document.querySelectorAll(".like-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      try {
        const response = await fetch(`${baseUrl}/api/testimonials/${id}/like`, {
          method: "POST",
        });
        const result = await response.json();
        button.innerHTML = `Like ❤️ (${result.likes})`;
      } catch (error) {
        console.error("Error liking testimonial:", error);
      }
    });
  });

  // ✅ Initialize Swiper
  new Swiper(".testimonials-slider", {
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

// ✅ Fetch testimonials on page load
document.addEventListener("DOMContentLoaded", fetchTestimonials);
