import { baseUrl } from "./constants.js";
import { addToCart, updateCartQuantity } from "../data/cart.js";
import { isAuthenticated } from "./utils/cartUtils.js";
import "./authButton.js";
import "./sidebar.js";

document.addEventListener("DOMContentLoaded", async () => {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    updateCartQuantity();
  }
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
    initAddToCartListener(productId); // Add cart functionality
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
          <img src="${product.image}" alt="${
    product.name
  }" class="w-full rounded-lg mb-4" />
          <div class="grid grid-cols-2 gap-4">
            ${product.gallery
              .slice(0, 2)
              .map(
                (image) =>
                  `<img src="${image}" alt="Gallery Image" class="rounded-lg w-full h-auto" />`
              )
              .join("")}
          </div>
        </div>

        <!-- Product Details Section -->
        <div>
          <h2 class="text-3xl font-bold mb-4">${product.name}</h2>
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
          <div class="text-green-600 font-bold text-3xl mb-4">
            KSH ${(product.priceCents / 100).toLocaleString("en-KE")}
          </div>

          <div class="mb-4">
            <label for="quantity" class="block text-gray-600 mb-2">Quantity</label>
            <select
              id="quantity"
              class="block w-auto px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring focus:ring-yellow-400 focus:outline-none"
            >
              ${Array.from(
                { length: 10 },
                (_, i) => `<option value="${i + 1}">${i + 1}</option>`
              ).join("")}
            </select>
          </div>

          <button
            class="button-primary js-add-to-cart add-to-cart-button w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

function initAddToCartListener(productId) {
  const addToCartButton = document.querySelector(".js-add-to-cart");

  addToCartButton.addEventListener("click", async () => {
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
        alert("You cannot add items to the cart without logging in.");
      }
      return;
    }

    try {
      addToCartButton.disabled = true;
      await addToCart(productId, quantity);
      updateCartQuantity();

      // Show "Added to Cart" message
      const addedMessage = document.querySelector(".added-to-cart");
      if (addedMessage) {
        addedMessage.style.opacity = "1";
        setTimeout(() => {
          addedMessage.style.opacity = "0";
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add item to cart.");
    } finally {
      addToCartButton.disabled = false;
    }
  });
}
