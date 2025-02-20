document
  .getElementById("floatingTestimonialWidget")
  .addEventListener("click", function () {
    document
      .getElementById("floatingTestimonialModal")
      .classList.remove("hidden");
  });
document
  .getElementById("closeFloatingTestimonialModal")
  .addEventListener("click", function () {
    document.getElementById("floatingTestimonialModal").classList.add("hidden");
  });

// Testimonial Data
const testimonials = [
  { image: "/images/testimonials/testimonial1.jpg" },
  { image: "/images/testimonials/testimonial2.jpg" },
  { image: "/images/testimonials/testimonial3.jpg" },
];

const slider = document.getElementById("testimonialSlider");
testimonials.forEach((testimonial) => {
  const slide = document.createElement("div");
  slide.className =
    "swiper-slide p-4 bg-gray-100 rounded-lg flex justify-center";
  slide.innerHTML = `<img src="${testimonial.image}" alt="Customer Testimonial" class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-md">`;
  slider.appendChild(slide);
});

// Initialize Swiper after content loads
new Swiper(".floating-testimonial-swiper", {
  loop: true,
  autoplay: {
    delay: 5000,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
