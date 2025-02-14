import { baseUrl } from "./constants.js";
import { addToCart, updateCartQuantity } from "../data/cart.js";
import { isAuthenticated } from "./utils/cartUtils.js";
import "./authButton.js";
import "./sidebar.js";
import "./categoryNav.js";
import "./cartPreview.js"; // Importing Cart Preview
import { fetchCart } from "./cartPreview.js"; // ✅ Import `fetchCart`

document.addEventListener("DOMContentLoaded", async () => {
  const authenticated = await isAuthenticated();
  if (authenticated) updateCartQuantity();

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    showToast("Product not found.", "error");
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
    showToast("Error loading product details.", "error");
  }
});

function renderProductDetails(product) {
  const container = document.getElementById("product-details-container");
  container.innerHTML = `
    <div class="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Image Section -->
        <div class="relative">
          <img src="${product.image}" alt="${product.name}"
            class="w-full rounded-lg mb-4 transform hover:scale-105 transition duration-300 ease-in-out shadow-md" />
          <div class="grid grid-cols-2 gap-4">
            ${product.gallery
              .slice(0, 4) // ✅ Show up to 4 images instead of 2
              .map(
                (image) => ` 
                <img src="${image}" alt="Gallery Image"
                  class="rounded-lg w-full h-auto transform hover:scale-110 transition duration-300 ease-in-out shadow-md" />
              `
              )
              .join("")}
          </div>
        </div>

        <!-- Product Details -->
        <div>
          <h2 class="text-3xl font-bold text-gray-800 mb-4">${product.name}</h2>
          <p class="text-gray-600 mb-4">${product.description}</p>

          <!-- Benefits Section -->
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Benefits</h3>
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
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Usage</h3>
          <p class="text-gray-600 mb-4">${product.usage}</p>

          <!-- Pricing -->
          <div class="text-green-600 font-bold text-3xl mb-4">
            KSH ${(product.priceCents / 100).toLocaleString("en-KE")}
          </div>

          <!-- Quantity Selector -->
          <div class="mb-4">
            <label for="quantity" class="block text-gray-600 mb-2 font-medium">Quantity</label>
            <select id="quantity"
              class="block w-auto px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-yellow-400 focus:outline-none">
              ${Array.from(
                { length: 10 },
                (_, i) => `<option value="${i + 1}">${i + 1}</option>`
              ).join("")}
            </select>
          </div>

          <!-- Add to Cart Button -->
          <button
            class="js-add-to-cart w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300 ease-in-out disabled:opacity-50"
            data-product-id="${
              product._id
            }"  // ✅ Ensure MongoDB ObjectId is used
          >
            Add to Cart
          </button>

          <!-- Added to Cart Notification -->
          <p class="added-to-cart text-green-600 mt-2 text-center opacity-0 transition-opacity duration-300">
            ✅ Added to cart!
          </p>
        </div>
      </div>
    </div>
  `;

  // ✅ Restore Add to Cart functionality
  initAddToCartListener(product._id);
}

function initAddToCartListener(productId) {
  const addToCartButton = document.querySelector(".js-add-to-cart");

  if (!addToCartButton) {
    console.error("❌ Error: Add to Cart button not found.");
    return;
  }

  // ✅ Remove any existing event listeners before adding a new one
  const newButton = addToCartButton.cloneNode(true);
  addToCartButton.replaceWith(newButton);

  newButton.addEventListener("click", async () => {
    console.log("🛒 Add to Cart clicked"); // ✅ Debug log

    const quantitySelector = document.getElementById("quantity");
    const quantity = quantitySelector ? parseInt(quantitySelector.value) : 1;

    const isUserAuthenticated = await isAuthenticated();

    if (!isUserAuthenticated) {
      const proceedToLogin = confirm(
        "You must log in to add items to your cart. Would you like to log in now?"
      );
      if (proceedToLogin) {
        window.location.href = "/login.html";
      } else {
        showToast("❌ You must log in to add items.", "error");
      }
      return;
    }

    try {
      newButton.disabled = true;
      await addToCart(productId, quantity);
      updateCartQuantity();
      showToast("✅ Added to cart!", "success");

      // ✅ Fetch updated cart preview after adding to cart
      await fetchCart();
    } catch (error) {
      console.error("❌ Error adding product to cart:", error);
      showToast("Failed to add item to cart.", "error");
    } finally {
      newButton.disabled = false;
    }
  });
}

/** Toast Notification System **/
function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");

  if (!toastContainer) {
    console.error("Toast container not found!");
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="close-btn">&times;</button>
    <div class="progress-bar"></div>
  `;

  toastContainer.appendChild(toast);

  // Close toast manually
  toast.querySelector(".close-btn").addEventListener("click", () => {
    toast.remove();
  });

  // Auto dismiss with animation
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
