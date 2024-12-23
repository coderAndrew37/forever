import { baseUrl } from "./constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    document.getElementById("product-details-container").innerHTML =
      "<p>Product not found.</p>";
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/products/${productId}`);
    if (!response.ok)
      throw new Error(`Failed to fetch product details: ${response.status}`);

    const product = await response.json();
    renderProductDetails(product);
  } catch (error) {
    console.error(error);
    document.getElementById("product-details-container").innerHTML =
      "<p>Error loading product details.</p>";
  }
});

function renderProductDetails(product) {
  const container = document.getElementById("product-details-container");
  container.innerHTML = `
    <div class="bg-white shadow-lg rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Image Section -->
        <div>
          <div class="grid grid-cols-2 gap-4">
            <img src="${product.image}" alt="${
    product.name
  }" class="rounded-lg">
            ${product.gallery
              .map(
                (image) =>
                  `<img src="${image}" alt="Gallery Image" class="rounded-lg">`
              )
              .join("")}
          </div>
        </div>

        <!-- Product Details Section -->
        <div>
          <h2 class="text-2xl font-bold mb-4">${product.name}</h2>
          <p class="text-gray-600 mb-4">${product.description}</p>
          
          <!-- Benefits Section -->
          <h3 class="text-xl font-semibold mb-2">Benefits</h3>
          <ul class="list-disc pl-5 mb-4">
            ${product.benefits
              .map(
                (benefit) => `
                <li class="flex items-start mb-2">
                  <i class="${benefit.icon} text-green-600 mr-2"></i>
                  <span>${benefit.text}</span>
                </li>
              `
              )
              .join("")}
          </ul>
          
          <!-- Usage Section -->
          <h3 class="text-xl font-semibold mb-2">Usage</h3>
          <p class="text-gray-600 mb-4">${product.usage}</p>
          
          <!-- Price and Add to Cart -->
          <div class="text-green-600 font-bold text-2xl mb-4">
            KSH ${(product.priceCents / 100).toLocaleString("en-KE")}
          </div>
          <button class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}
