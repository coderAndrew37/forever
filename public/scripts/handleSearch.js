import { baseUrl } from "./constants.js";
import { renderProducts } from "./utils/renderUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM Loaded, initializing search functionality...");
  setupSearch();
});

function setupSearch() {
  const searchToggle = document.querySelector(".js-search-toggle");
  const searchClose = document.querySelector(".js-search-close");
  const searchContainer = document.querySelector(".js-search-bar-container");
  const searchBar = document.querySelector(".js-search-bar");
  const suggestionsDropdown = document.querySelector(
    ".js-suggestions-dropdown"
  );
  const resultsContainer = document.querySelector(".js-products-grid");

  if (
    !searchToggle ||
    !searchClose ||
    !searchContainer ||
    !searchBar ||
    !suggestionsDropdown ||
    !resultsContainer
  ) {
    console.error(
      "❌ ERROR: One or more required elements not found in the DOM."
    );
    return;
  }

  // ✅ Open Search Bar
  searchToggle.addEventListener("click", () => {
    console.log("🔍 Opening search bar...");
    searchContainer.classList.remove("-translate-y-full", "hidden");
    searchBar.focus();
  });

  // ✅ Close Search Bar
  searchClose.addEventListener("click", () => {
    console.log("❌ Closing search bar...");
    closeSearchBar();
  });

  // ✅ Handle Search Input Events
  searchBar.addEventListener("input", (event) => handleSuggestions(event));
  searchBar.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("🔍 Searching for:", searchBar.value);
      handleSearch(searchBar.value);
    }
  });

  // ✅ Hide Suggestions on Outside Click
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".js-search-bar-container")) {
      suggestionsDropdown.style.display = "none";
    }
  });
}

// ✅ Close Search Bar
function closeSearchBar() {
  const searchContainer = document.querySelector(".js-search-bar-container");
  if (searchContainer) {
    searchContainer.classList.add("-translate-y-full");
    setTimeout(() => searchContainer.classList.add("hidden"), 300);
  }
}

// ✅ Handle Suggestions
async function handleSuggestions(event) {
  const searchBar = document.querySelector(".js-search-bar");
  const suggestionsDropdown = document.querySelector(
    ".js-suggestions-dropdown"
  );
  const query = event.target.value.trim();

  if (!query) {
    suggestionsDropdown.style.display = "none";
    return;
  }

  console.log(`🟡 Fetching suggestions for: "${query}"`);

  try {
    const suggestions = await fetchSuggestions(query);
    if (suggestions.length > 0) {
      console.log("✅ Suggestions received:", suggestions);

      suggestionsDropdown.innerHTML = suggestions
        .map(
          (suggestion) =>
            `<div class="suggestion-item cursor-pointer px-4 py-2 hover:bg-gray-200" data-name="${suggestion.name}">${suggestion.name}</div>`
        )
        .join("");

      document.querySelectorAll(".suggestion-item").forEach((item) => {
        item.addEventListener("click", () => {
          searchBar.value = item.dataset.name;
          suggestionsDropdown.style.display = "none";
          console.log("🔍 Searching via suggestion:", item.dataset.name);
          handleSearch(item.dataset.name);
        });
      });

      suggestionsDropdown.style.display = "block";
    } else {
      console.warn("⚠️ No suggestions found.");
      suggestionsDropdown.innerHTML =
        "<p class='px-4 py-2 text-gray-500'>No suggestions found.</p>";
      suggestionsDropdown.style.display = "block";
    }
  } catch (error) {
    console.error("❌ Error fetching suggestions:", error);
    suggestionsDropdown.innerHTML =
      "<p class='px-4 py-2 text-red-500'>Error fetching suggestions.</p>";
    suggestionsDropdown.style.display = "block";
  }
}

// ✅ Fetch Suggestions from API
const suggestionsCache = {};

async function fetchSuggestions(query) {
  if (suggestionsCache[query]) return suggestionsCache[query];

  try {
    const response = await fetch(
      `${baseUrl}/api/products/suggestions?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Failed to fetch suggestions");

    const data = await response.json();
    suggestionsCache[query] = Array.isArray(data) ? data : [];
    return suggestionsCache[query];
  } catch (error) {
    console.error("❌ Error fetching search results:", error);
    return [];
  }
}

// ✅ Handle Product Search
async function handleSearch(searchTerm) {
  if (!searchTerm) return;

  console.log("🔍 Searching for:", searchTerm);

  let resultsContainer = document.querySelector(".js-products-grid");

  if (!resultsContainer) {
    console.warn("⚠️ .js-products-grid not found. Retrying in 500ms...");
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait & retry
    resultsContainer = document.querySelector(".js-products-grid");

    if (!resultsContainer) {
      console.error("❌ ERROR: .js-products-grid still not found.");
      return;
    }
  }

  const spinner = document.getElementById("loadingSpinner");
  spinner.classList.remove("hidden");
  resultsContainer.innerHTML =
    "<p class='text-center text-gray-500'>Searching...</p>";

  try {
    const results = await searchProducts(searchTerm);
    if (results.length > 0) {
      renderProducts(results, ".js-products-grid");
      smoothScrollToResults();
    } else {
      resultsContainer.innerHTML =
        "<p class='text-center text-gray-500'>No results found.</p>";
    }
  } catch (error) {
    console.error("❌ Search failed:", error);
    resultsContainer.innerHTML =
      "<p class='text-center text-red-500'>Error loading search results.</p>";
  } finally {
    spinner.classList.add("hidden");
  }
}

// ✅ Fetch Search Results from API
async function searchProducts(query) {
  try {
    const response = await fetch(
      `${baseUrl}/api/products/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Failed to fetch search results");

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error("❌ Error fetching search results:", error);
    return [];
  }
}

// ✅ Smooth Scroll to Search Results
function smoothScrollToResults() {
  setTimeout(() => {
    const searchResultsSection = document.querySelector("#featured-products");
    if (searchResultsSection) {
      console.log("📜 Scrolling to search results...");
      searchResultsSection.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn("⚠️ Featured products section not found.");
    }
  }, 300);
}
