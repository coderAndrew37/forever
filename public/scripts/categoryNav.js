import { categories } from "./data/categoriesData.js";

document.addEventListener("DOMContentLoaded", () => {
  const categoryNav = document.getElementById("category-nav");
  const categoriesContainer = document.getElementById("categories-container");

  if (!categoryNav || !categoriesContainer) {
    console.error("❌ Category nav elements not found!");
    return;
  }

  // 🌟 Populate the category nav dynamically
  categoriesContainer.innerHTML = categories
    .map(
      (category) => `
      <a href="/category.html?category=${category.slug}" 
         class="category-link">
        ${category.name}
      </a>`
    )
    .join("");

  // ✨ Improved scroll behavior for smooth visibility
  let lastScrollTop = 0;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let scrollTop = window.scrollY;

        if (scrollTop > lastScrollTop) {
          // Scrolling down → Hide with animation
          categoryNav.style.opacity = "0";
          categoryNav.style.transform = "translateY(-20px)";
          categoryNav.style.pointerEvents = "none"; // Prevents interaction
        } else {
          // Scrolling up → Show with smooth transition
          categoryNav.style.opacity = "1";
          categoryNav.style.transform = "translateY(0)";
          categoryNav.style.pointerEvents = "auto"; // Enables interaction
        }

        lastScrollTop = scrollTop;
        ticking = false;
      });

      ticking = true;
    }
  });

  // 🚀 Ensure it's visible on page load
  categoryNav.style.opacity = "1";
  categoryNav.style.transform = "translateY(0)";
});
