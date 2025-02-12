import { baseUrl } from "./constants.js";
import { renderProducts } from "./utils/renderUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchToggle = document.querySelector(".js-search-toggle");
  const searchClose = document.querySelector(".js-search-close");
  const searchContainer = document.querySelector(".js-search-bar-container");
  const searchBar = document.querySelector(".js-search-bar");
  const suggestionsDropdown = document.querySelector(
    ".js-suggestions-dropdown"
  );
  const resultsContainer = document.querySelector(".js-products-grid");

  if (!suggestionsDropdown) {
    console.error("Error: .js-suggestions-dropdown not found in the DOM.");
    return;
  }

  if (searchToggle && searchContainer) {
    searchToggle.addEventListener("click", () => {
      searchContainer.classList.remove("-translate-y-full", "hidden");
    });
  }

  if (searchClose && searchContainer) {
    searchClose.addEventListener("click", () => {
      closeSearchBar();
    });
  }

  if (searchBar) {
    searchBar.addEventListener("input", handleSuggestions);
    searchBar.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".js-search-bar-container") &&
      suggestionsDropdown
    ) {
      suggestionsDropdown.style.display = "none";
    }
  });
});

function closeSearchBar() {
  const searchContainer = document.querySelector(".js-search-bar-container");
  if (searchContainer) {
    searchContainer.classList.add("-translate-y-full");
    setTimeout(() => searchContainer.classList.add("hidden"), 300);
  }
}

async function handleSuggestions(event) {
  const query = event.target.value.trim();
  if (!query) {
    suggestionsDropdown.style.display = "none";
    return;
  }

  try {
    const suggestions = await fetchSuggestions(query);
    if (suggestions.length > 0) {
      suggestionsDropdown.innerHTML = suggestions
        .map(
          (suggestion) =>
            `<div class="suggestion-item cursor-pointer px-4 py-2 hover:bg-gray-200" data-id="${suggestion._id}">${suggestion.name}</div>`
        )
        .join("");

      document.querySelectorAll(".suggestion-item").forEach((item) => {
        item.addEventListener("click", () => {
          searchBar.value = ""; // Clear search bar
          suggestionsDropdown.style.display = "none";
          handleSearch(item.dataset.id);
        });
      });

      suggestionsDropdown.style.display = "block";
    } else {
      suggestionsDropdown.innerHTML =
        "<p class='px-4 py-2 text-gray-500'>No suggestions found.</p>";
      suggestionsDropdown.style.display = "block";
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    suggestionsDropdown.innerHTML =
      "<p class='px-4 py-2 text-red-500'>Error fetching suggestions.</p>";
    suggestionsDropdown.style.display = "block";
  }
}

const suggestionsCache = {};

async function fetchSuggestions(query) {
  if (suggestionsCache[query]) {
    return suggestionsCache[query];
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/products/suggestions?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch suggestions");
    }
    const data = await response.json();
    suggestionsCache[query] = Array.isArray(data) ? data : [];
    return suggestionsCache[query];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

async function handleSearch(productId = null) {
  const searchBar = document.querySelector(".js-search-bar");
  const resultsContainer = document.querySelector(".js-products-grid");
  const spinner = document.getElementById("loadingSpinner");

  if (!searchBar || !resultsContainer) return;

  const searchTerm = searchBar.value.trim();
  if (!searchTerm && !productId) return;

  if (spinner) spinner.classList.remove("hidden");
  resultsContainer.innerHTML = "";

  try {
    const results = await searchProducts(searchTerm);
    if (results.length > 0) {
      renderProducts(results, ".js-products-grid");
      closeSearchBar(); // Hide search bar

      if (productId) {
        setTimeout(() => {
          const selectedProduct = document.querySelector(
            `[data-id='${productId}']`
          );
          if (selectedProduct) {
            selectedProduct.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 300);
      } else {
        document
          .querySelector("#featured-products")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      resultsContainer.innerHTML =
        "<p class='px-4 py-2 text-gray-500'>No results found.</p>";
    }
  } catch (error) {
    console.error("Search failed:", error);
    resultsContainer.innerHTML =
      "<p class='px-4 py-2 text-red-500'>Error loading search results. Please try again later.</p>";
  } finally {
    if (spinner) spinner.classList.add("hidden");
  }
}

async function searchProducts(query) {
  try {
    const response = await fetch(
      `${baseUrl}/api/products/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error("Failed to fetch search results");
    }
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}
