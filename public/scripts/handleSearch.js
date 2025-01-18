import { baseUrl } from "./constants.js";
import { renderProducts } from "./utils/renderUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.querySelector(".js-search-button");
  const searchBar = document.querySelector(".js-search-bar");
  const suggestionsDropdown = document.querySelector(
    ".js-suggestions-dropdown"
  );

  // Event listeners for search and suggestions
  searchButton.addEventListener("click", handleSearch);
  searchBar.addEventListener("input", handleSuggestions);
  searchBar.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  });

  // Hide suggestions when clicking outside the search bar
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".js-search-bar")) {
      suggestionsDropdown.style.display = "none";
    }
  });
});

// Handles real-time suggestions based on input
async function handleSuggestions(event) {
  const query = event.target.value.trim();
  const suggestionsDropdown = document.querySelector(
    ".js-suggestions-dropdown"
  );

  if (query.length === 0) {
    suggestionsDropdown.style.display = "none";
    return;
  }

  try {
    const suggestions = await fetchSuggestions(query);
    if (suggestions.length > 0) {
      suggestionsDropdown.innerHTML = suggestions
        .map(
          (suggestion) =>
            `<div class="suggestion-item cursor-pointer px-4 py-2 hover:bg-gray-200">${suggestion.name}</div>`
        )
        .join("");

      // Attach click event to each suggestion
      document.querySelectorAll(".suggestion-item").forEach((item) => {
        item.addEventListener("click", () => {
          document.querySelector(".js-search-bar").value = item.textContent;
          handleSearch(); // Search with the selected suggestion
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

// Handles product search
async function handleSearch() {
  const searchTerm = document.querySelector(".js-search-bar").value.trim();
  const resultsContainer = document.querySelector(".js-products-grid");
  const spinner = document.getElementById("loadingSpinner");

  if (!searchTerm) {
    return; // Don't trigger search if the input is empty
  }

  // Show spinner and clear current results
  spinner.classList.remove("hidden");
  resultsContainer.innerHTML = "";

  try {
    const results = await searchProducts(searchTerm);

    if (results.length > 0) {
      renderProducts(results, ".js-products-grid");
      document
        .querySelector("#featured-products")
        .scrollIntoView({ behavior: "smooth" });
    } else {
      resultsContainer.innerHTML =
        "<p class='text-gray-500'>No results found.</p>";
    }
  } catch (error) {
    console.error("Search failed:", error);
    resultsContainer.innerHTML =
      "<p class='text-red-500'>Error loading search results. Please try again later.</p>";
  } finally {
    spinner.classList.add("hidden");
  }
}

async function searchProducts(query) {
  try {
    const response = await fetch(
      `${baseUrl}/api/products/search?q=${encodeURIComponent(query)}`
    );
    //DEBUG LINE
    console.log(response);
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
