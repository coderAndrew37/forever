import { addToCart, updateCartQuantity } from "../data/cart.js";
import { loadProducts } from "./utils/renderUtils.js";

import {
  renderProducts,
  renderPagination,
  renderFAQs,
  renderSpecialOffers,
} from "./utils/renderUtils.js";

import { faqs } from "./data/faqsData.js";
import { specialOffers } from "./data/specialOffersData.js";
import { isAuthenticated, initAddToCartListeners } from "./utils/cartUtils.js";
import "./authButton.js";
import "./handleSearch.js";
import "./categoryNav.js";
import "./sidebar.js";
import "./newsletter.js";
import "./featuredTestimonials.js";
import "./testimonials.js";
import "./submitTestimonials.js";
import "./floatingtestimonials.js";

let currentPage = 1;
let totalPages = 1;

document.addEventListener("DOMContentLoaded", async () => {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    updateCartQuantity();
  }

  fetchAndDisplayProducts(currentPage, authenticated);
  renderFAQs(faqs);
  renderSpecialOffers(specialOffers);
});

// Fetch and display products
async function fetchAndDisplayProducts(page = 1, authenticated = false) {
  try {
    const { products, totalPages: fetchedTotalPages } = await loadProducts(
      page
    );

    if (!products || products.length === 0) {
      console.log("No products available for homepage.");
      document.querySelector(".js-products-grid").innerHTML =
        "<p>No products found.</p>";
      return;
    }

    renderProducts(products, ".js-products-grid", authenticated);

    totalPages = fetchedTotalPages;
    currentPage = page;

    renderPagination(currentPage, totalPages, ".js-pagination", (page) =>
      fetchAndDisplayProducts(page, authenticated)
    );

    initAddToCartListeners();
  } catch (error) {
    console.error("Error loading products on homepage:", error);
    document.querySelector(".js-products-grid").innerHTML =
      "<p>Error loading products. Please try again later.</p>";
  }
}

// Observes changes to the products grid and re-initializes listeners
function observeProductsGrid() {
  const productsGrid = document.querySelector(".js-products-grid");

  const observer = new MutationObserver(() => {
    initAddToCartListeners();
  });

  observer.observe(productsGrid, { childList: true, subtree: true });
}

// FAQ toggle functionality
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", !expanded);

    const answer = button.nextElementSibling;
    if (!expanded) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = 0;
    }
  });
});
