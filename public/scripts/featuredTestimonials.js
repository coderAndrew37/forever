import { testimonials } from "/data/featuredTestimonialsData.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("testimonials-container");
  if (!container) return console.error("Testimonials container not found!");

  const swiperWrapper = container.querySelector(".swiper-wrapper");
  if (!swiperWrapper) return console.error("Swiper wrapper not found!");

  swiperWrapper.innerHTML = testimonials
    .map(
      ({ quote, name, beforeImg, afterImg }) => `
    <div class="swiper-slide flex flex-col md:flex-row items-center gap-8">
      <div class="p-6 text-center md:text-left">
        <p class="text-xl text-gray-700 italic">“${quote}”</p>
        <h3 class="text-2xl font-bold mt-4">- ${name}</h3>
        <p class="text-gray-600 mt-2">Verified Customer</p>
      </div>
      <div class="flex gap-4 justify-center">
        <div>
          <h4 class="text-center font-semibold mb-2">Before</h4>
          <img src="${beforeImg}" alt="Before Image" class="rounded-lg shadow-md w-full">
        </div>
        <div>
          <h4 class="text-center font-semibold mb-2">After</h4>
          <img src="${afterImg}" alt="After Image" class="rounded-lg shadow-md w-full">
        </div>
      </div>
    </div>
  `
    )
    .join("");

  container.innerHTML += `
    <div class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  `;

  requestAnimationFrame(() => {
    if (window.swiperInstance) window.swiperInstance.destroy(true, true);

    window.swiperInstance = new Swiper("#testimonials-container", {
      loop: true,
      slidesPerView: 1,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: { delay: 5000 },
    });

    window.swiperInstance.update();
  });
});
