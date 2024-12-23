import { baseUrl } from "./constants.js";
import { addToCart, updateCartQuantity } from "../data/cart.js";
import { isAuthenticated } from "./utils/cartUtils.js";
import "./authButton.js";

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
          <button 
            class="button-primary js-add-to-cart add-to-cart-button bg-primary text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
            data-product-id="${product.id}"
          >
            Add to Cart
          </button>
          <div class="added-to-cart text-green-600 mt-2" style="opacity: 0;">
            <i class="fas fa-check"></i> Added to cart
          </div>
        </div>
      </div>
    </div>
  `;
}

function initAddToCartListener(productId) {
  const addToCartButton = document.querySelector(".js-add-to-cart");

  addToCartButton.addEventListener("click", async () => {
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
      await addToCart(productId, 1);
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
