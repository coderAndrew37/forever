import { categories } from "./data/categoriesData.js";

document.addEventListener("DOMContentLoaded", () => {
  const categoryNav = document.getElementById("category-nav");
  const categoriesContainer = document.getElementById("categories-container");
  const sidebarMenu = document.querySelector(".js-sidebar nav");

  if (!categoryNav || !categoriesContainer || !sidebarMenu) {
    console.error("❌ Navigation elements not found!");
    return;
  }

  console.log("✅ categoryNav.js Loaded!");

  // 🌟 Populate Desktop Category Nav
  categoriesContainer.innerHTML = categories
    .map(
      (category) => `
      <div class="group relative">
        <a href="/category.html?category=${category.slug}" class="category-link hover:text-yellow-500 transition-all duration-300">
          ${category.name}
        </a>

        <!-- Dropdown -->
        <div class="category-dropdown hidden absolute left-0 top-full w-56 bg-white shadow-lg rounded-lg p-2">
          <img src="${category.image}" alt="${category.name}" class="w-full h-32 object-cover rounded-lg mb-2" />
          <a href="/category.html?category=${category.slug}" class="block text-center text-yellow-500 font-semibold hover:underline">
            Explore ${category.name}
          </a>
        </div>
      </div>`
    )
    .join("");

  // 📱 Populate Mobile Category Menu (Inside Sidebar)
  const categorySidebarMenu = `
    <div class="mobile-categories mt-4">
      <h3 class="text-lg font-semibold text-white">Categories</h3>
      <ul class="mt-2">
        ${categories
          .map(
            (category) => `
          <li>
            <a href="/category.html?category=${category.slug}" class="block text-white py-2 hover:text-yellow-500 transition">
              ${category.name}
            </a>
          </li>`
          )
          .join("")}
      </ul>
    </div>`;

  sidebarMenu.insertAdjacentHTML("beforeend", categorySidebarMenu);

  // ✨ Improved Scroll Behavior for Smooth Visibility
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

  // 🚀 Ensure Nav is Visible on Load
  categoryNav.classList.remove("hidden");
});
