document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-slide");
  const indicators = document.querySelectorAll(".indicator");
  const prevButton = document.querySelector(".carousel-prev");
  const nextButton = document.querySelector(".carousel-next");
  let currentIndex = 0;

  // Function to update the carousel
  const updateCarousel = () => {
    const slideWidth = slides[0].clientWidth;
    const container = document.querySelector(".carousel-slides");
    container.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    // Update active indicator
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("bg-yellow-500", index === currentIndex);
    });
  };

  // Next button functionality
  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  // Previous button functionality
  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  // Indicator functionality
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // Auto-slide functionality
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }, 5000); // Change slide every 5 seconds

  // Initialize carousel
  updateCarousel();
});
