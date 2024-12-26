import { baseUrl } from "./constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const packSlug = params.get("slug");

  if (!packSlug) {
    document.body.innerHTML = "<p>Pack not found.</p>";
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/packs/${packSlug}`);
    if (!response.ok)
      throw new Error(`Failed to fetch pack details: ${response.statusText}`);

    const pack = await response.json();
    renderPackDetails(pack);
  } catch (error) {
    console.error("Error fetching pack details:", error);
    document.body.innerHTML = "<p>Error loading pack details.</p>";
  }
});

function renderPackDetails(pack) {
  // Set Hero Section
  document.getElementById("pack-name").textContent = pack.name;
  document.getElementById("pack-description").textContent = pack.description;

  // Set Image and Detailed Description
  document.getElementById("pack-image").src = pack.packImage;
  document.getElementById("pack-detailed-description").textContent =
    pack.detailedDescription;

  // Render Benefits
  const benefitsList = document.getElementById("benefits-list");
  benefitsList.innerHTML = pack.benefits
    .map(
      (benefit) => `
        <li class="flex items-start space-x-3">
          <i class="${benefit.icon} text-yellow-500 text-xl"></i>
          <span>${benefit.benefit}</span>
        </li>
      `
    )
    .join("");

  // Render Included Products
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = pack.productIds
    .map(
      (productId) => `
        <li>
          <a
            href="/product-details.html?id=${productId}"
            class="block bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
          >
            <p>Product ID: ${productId}</p>
          </a>
        </li>
      `
    )
    .join("");
}
