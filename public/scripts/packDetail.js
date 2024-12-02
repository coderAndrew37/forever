import { baseUrl as baseURL } from "./constants.js";

async function fetchPackDetails(slug) {
  const response = await fetch(`${baseURL}/api/packs/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch pack details");
  }
  return response.json();
}

// DOM Elements
const packTitleElement = document.getElementById("pack-title");
const packDescriptionElement = document.getElementById("pack-description");
const packBenefitsElement = document.getElementById("pack-benefits");
const productsGrid = document.getElementById("products-grid");

async function loadAndRenderPackDetails() {
  const slug = new URLSearchParams(window.location.search).get("pack");
  try {
    const pack = await fetchPackDetails(slug);

    // Render pack details
    packTitleElement.textContent = pack.name;
    packDescriptionElement.textContent = pack.description;
    packBenefitsElement.innerHTML = pack.benefits
      .map((benefit) => `<li>${benefit}</li>`)
      .join("");

    // Render products
    renderProducts(pack.products, "#products-grid");
  } catch (error) {
    console.error("Error rendering pack details:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadAndRenderPackDetails);
