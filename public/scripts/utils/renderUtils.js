import { baseUrl as baseURL } from "../constants.js";
import { initAddToCartListeners } from "./cartUtils.js";
import { formatCurrency } from "./money.js";

// Fetch products from the API
export async function loadProducts(page = 1) {
  const apiUrl = `${baseURL}/api/products?page=${page}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    data.products = data.products.map((product) => ({
      ...product,
      id: product._id, // Ensure `id` is mapped for consistency
    }));

    return {
      products: data.products,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// Generate product HTML
export function generateProductHTML(product) {
  return `
    <div class="product-container border border-gray-200 rounded-lg p-5 flex flex-col shadow-sm hover:shadow-lg">
      <div class="product-image-container flex justify-center items-center h-48 mb-5">
        <img
          class="product-image object-cover max-w-full max-h-full"
          src="${product.image}"
          alt="${product.name}"
        />
      </div>
      <div class="product-name text-lg font-medium text-gray-800 mb-2 truncate">
        ${product.name}
      </div>
      <div class="product-rating-container flex items-center mb-4">
        <img
          class="product-rating-stars w-20"
          src="images/ratings/rating-${product.rating.stars * 10}.png"
          alt="${product.rating.stars} stars"
        />
        <span
          class="product-rating-count text-blue-500 text-sm ml-2 cursor-pointer"
        >
          ${product.rating.count} reviews
        </span>
      </div>
      <div class="product-price text-xl font-bold text-gray-800 mb-4">
        Ksh ${formatCurrency(product.priceCents)}
      </div>
      <div class="product-spacer flex-grow"></div>
      <a
        href="/product-details.html?id=${product.id}"
        class="block mt-4"
      >
        <button
          class="add-to-cart-button button-primary w-full bg-primary text-white py-2 rounded-full hover:bg-yellow-600 transition"
          data-product-id="${product.id}"
        >
          Learn More
        </button>
      </a>
    </div>
  `;
}

// Render products into a container
export function renderProducts(products, containerSelector) {
  const productsGrid = document.querySelector(containerSelector);
  if (!productsGrid) return;

  if (products.length === 0) {
    productsGrid.innerHTML = `
      <p class="text-center text-gray-600">No results found.</p>
    `;
    return;
  }

  productsGrid.className = `
    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6
  `; // Responsive grid classes

  const productsHTML = products
    .map((product) => generateProductHTML(product))
    .join("");
  productsGrid.innerHTML = productsHTML;

  // Initialize Add to Cart listeners after rendering
  initAddToCartListeners();
}

//rendering packs
export function renderPacks(packs, containerSelector) {
  const packsGrid = document.querySelector(containerSelector);
  if (!packsGrid) return;

  packsGrid.innerHTML = packs
    .slice(0, 3) // Show only three packs
    .map(
      (pack) => `
      <div class="pack-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
        <img src="${pack.image}" alt="${pack.name}" class="w-full h-40 object-cover">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800">${pack.name}</h3>
          <p class="text-gray-600 text-sm mt-2 line-clamp-3">${pack.description}</p>
          <div class="mt-4">
            <a
              href="/pack.html?category=${pack.slug}"
              class="text-blue-500 font-medium hover:underline"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

export function renderPagination(
  currentPage,
  totalPages,
  containerSelector,
  onPageClick
) {
  const paginationContainer = document.querySelector(containerSelector);
  if (!paginationContainer) return;

  paginationContainer.innerHTML = `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
    </li>
    ${Array.from({ length: totalPages }, (_, i) => i + 1)
      .map(
        (page) => `
          <li class="page-item ${page === currentPage ? "active" : ""}">
            <a class="page-link" href="#" data-page="${page}">${page}</a>
          </li>
        `
      )
      .join("")}
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
    </li>
  `;

  // Attach click event listeners to pagination links
  paginationContainer.querySelectorAll(".page-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const page = parseInt(link.getAttribute("data-page"));
      if (page > 0 && page <= totalPages) {
        onPageClick(page); // Call the provided callback function
      }
    });
  });
}

export function renderCategories(categories) {
  const categoriesSection = document.querySelector(".categories-section");
  if (!categoriesSection) return;

  categoriesSection.innerHTML = `
    <h2>Explore Our Categories</h2>
    <div class="categories-grid">
      ${categories
        .map(
          (category) => `
          <div class="category-item">
            <a href="category.html?category=${category.slug}" class="category-link">
              <div class="category-image">
                <img src="${category.image}" alt="${category.name}" />
              </div>
              <h3>${category.name}</h3>
            </a>
          </div>
        `
        )
        .join("")}
    </div>
  `;
}

export function renderFAQs(faqs) {
  const faqSection = document.querySelector(".faq-section");
  if (!faqSection) return;

  faqSection.innerHTML = `
    <h2 class="text-center text-3xl font-bold text-gray-800 mb-8">
      Frequently Asked Questions
    </h2>
    <div class="faq-items space-y-4">
      ${faqs
        .map(
          (faq) => `
          <div class="faq-item">
            <button
              class="faq-question flex items-center w-full bg-gray-100 p-4 rounded-md text-left text-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              aria-expanded="false"
            >
              <i class="fas fa-chevron-right transition-transform text-gray-500"></i>
              <span class="question-text flex-grow ml-4 text-gray-800">
                ${faq.question}
              </span>
            </button>
            <div
              class="faq-answer overflow-hidden transition-all duration-300 max-h-0 px-4"
            >
              <p class="text-gray-600 mt-4">${faq.answer}</p>
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  `;

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", !expanded);

      const icon = button.querySelector("i");
      icon.classList.toggle("rotate-90", !expanded);

      const answer = button.nextElementSibling;
      answer.style.maxHeight = expanded ? 0 : `${answer.scrollHeight}px`;
    });
  });
}

export function renderTestimonials(testimonials) {
  const testimonialsSection = document.querySelector(".testimonials-section");
  if (!testimonialsSection) return;

  testimonialsSection.innerHTML = `
    <h2 class="text-center text-3xl font-bold text-gray-800 mb-10">
      What Our Customers Say
    </h2>
    <div class="testimonials-grid grid gap-6 text-center md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1">
      ${testimonials
        .map(
          (testimonial) => `
          <div
            class="testimonial-item bg-white p-5 rounded-lg shadow-md opacity-0 transform translate-y-10 transition-all duration-500"
          >
            <p class="text-gray-600 italic mb-4">"${testimonial.text}"</p>
            <div class="flex justify-center mb-2">
              ${Array.from({ length: 5 })
                .map((_, i) => {
                  return i < testimonial.rating
                    ? `<i class="fas fa-star text-yellow-500"></i>`
                    : `<i class="far fa-star text-gray-300"></i>`;
                })
                .join("")}
            </div>
            <span class="block text-gray-800 font-semibold text-sm">
              - ${testimonial.name}
            </span>
          </div>
        `
        )
        .join("")}
    </div>
    <div class="text-center mt-8">
      <button
        id="submitTestimonialBtn"
        class="px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-yellow-600 transition"
      >
        Submit Your Testimonial
      </button>
    </div>
  `;

  // Add fade-in effect
  const testimonialItems = document.querySelectorAll(".testimonial-item");
  testimonialItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.remove("opacity-0", "translate-y-10");
    }, index * 200); // Staggered fade-in
  });
}

export async function renderSpecialOffers(apiEndpoint, containerSelector) {
  const offersSection = document.querySelector(containerSelector);
  if (!offersSection) return;

  try {
    // Fetch special offers from the API
    const response = await fetch(apiEndpoint);
    if (!response.ok) throw new Error("Failed to fetch special offers");

    const offers = await response.json();

    // Render the offers
    offersSection.innerHTML = `
      <h2 class="text-3xl font-bold text-gray-700 text-center mb-12">
        <i class="fas fa-fire text-red-500"></i> Exclusive Deals
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        ${offers
          .map(
            (offer) => `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
              <img
                src="${offer.product.image}"
                alt="${offer.product.name}"
                class="w-full h-48 object-cover"
              />
              <div class="p-4">
                <h3 class="text-lg font-bold text-gray-700">${offer.product.name}</h3>
                <p class="text-red-500 font-bold text-xl mt-4">
                  Ksh ${offer.price}
                  <span class="line-through text-gray-400">${offer.originalPrice}</span>
                </p>
                <button
                  class="w-full bg-yellow-500 text-white py-2 mt-4 rounded-lg shadow hover:bg-yellow-600 transition add-to-cart-button button-primary js-add-to-cart"
                  data-product-id="${offer.product.id}"
                >
                  <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          `
          )
          .join("")}
      </div>
    `;

    // Reinitialize Add to Cart listeners for the new buttons
    initAddToCartListeners();
  } catch (error) {
    console.error("Error rendering special offers:", error);
    offersSection.innerHTML =
      "<p>Error loading special offers. Please try again later.</p>";
  }
}
