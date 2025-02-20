import { baseUrl } from "./constants.js";

// ✅ Fetch & Render Testimonials
async function fetchTestimonials() {
  try {
    const response = await fetch(`${baseUrl}/api/testimonials`);
    const testimonials = await response.json();
    renderTestimonials(testimonials);
  } catch (error) {
    console.error("❌ Error fetching testimonials:", error);
  }
}

// ✅ Render Testimonials with Better Layout
function renderTestimonials(testimonials) {
  const swiperContainer = document.querySelector(".swiper-wrapper");
  if (!swiperContainer) return;

  swiperContainer.innerHTML = testimonials
    .map(
      (t) => `
      <div class="swiper-slide bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
        ${
          t.photo
            ? `<img src="${t.photo}" class="w-full max-h-60 rounded-lg object-cover mb-4 shadow-md" alt="Testimonial Image" />`
            : ""
        }
        <p class="text-gray-700 italic mb-3 text-lg leading-relaxed">
          "${t.text}"
        </p>
        <div class="flex justify-center mb-2">
          ${Array.from({ length: 5 })
            .map((_, i) =>
              i < t.rating
                ? `<i class="fas fa-star text-yellow-500 text-lg"></i>`
                : `<i class="far fa-star text-gray-300 text-lg"></i>`
            )
            .join("")}
        </div>
        <div class="flex items-center space-x-3 mt-3">
          <span class="block text-gray-900 font-semibold text-lg">- ${
            t.name
          }</span>
        </div>
        ${
          t.video
            ? `<video class="mt-4 w-full rounded-lg shadow-md" controls>
                 <source src="${t.video}" type="video/mp4">
               </video>`
            : ""
        }
        <button 
          class="like-btn bg-yellow-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-yellow-600 transition"
          data-id="${t._id}">
          ❤️ Like (${t.likes})
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
        button.innerHTML = `❤️ Like (${result.likes})`;
      } catch (error) {
        console.error("❌ Error liking testimonial:", error);
      }
    });
  });

  // ✅ Initialize Swiper
  new Swiper(".testimonials-slider", {
    loop: true,
    autoplay: {
      delay: 4000,
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
