import { fetchCartItems, updateQuantity } from "./checkoutCartManager.js";
import {
  prefillOrderForm,
  handleOrderSubmission,
} from "./checkoutOrderManager.js";
import { renderOrderSummary } from "./renderOrderSummary.js";
import { updateCartQuantity } from "../data/cart.js";

// ✅ Show Skeletons Before Fetching Data
function showSkeletons() {
  document.querySelector(".js-order-summary").innerHTML =
    '<div class="skeleton skeleton-order-summary"></div>';
  document.querySelector(".js-payment-summary").innerHTML =
    '<div class="skeleton skeleton-payment-summary"></div>';
}

async function attachCartEventListeners() {
  document.querySelectorAll(".js-quantity-select").forEach((select) => {
    select.addEventListener("change", async (event) => {
      const productId = event.target.dataset.productId;
      const newQuantity = parseInt(event.target.value, 10);
      await updateQuantity(productId, newQuantity);
      await renderOrderSummary();
      updateCartQuantity();
    });
  });

  document.querySelectorAll(".js-delete-quantity-link").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.productId;
      await updateQuantity(productId, 0);
      await renderOrderSummary();
      updateCartQuantity();
    });
  });
}

function setupModalListeners() {
  const placeOrderButton = document.querySelector(".js-place-order-button");
  const closeButton = document.querySelector(".close-button");
  const orderDetailsModal = document.getElementById("orderDetailsModal");

  if (!placeOrderButton || !closeButton || !orderDetailsModal) {
    console.warn("Place Order button or modal elements not found.");
    return;
  }

  placeOrderButton.addEventListener("click", async (e) => {
    e.preventDefault();
    await prefillOrderForm();
    orderDetailsModal.style.display = "flex";
  });

  closeButton.addEventListener("click", () => {
    orderDetailsModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === orderDetailsModal) {
      orderDetailsModal.style.display = "none";
    }
  });
}

// ✅ Initialize on Page Load
document.addEventListener("DOMContentLoaded", async () => {
  showSkeletons(); // Show skeletons before loading

  await fetchCartItems();
  await renderOrderSummary();
  updateCartQuantity();
  attachCartEventListeners();
  setupModalListeners();

  document
    .getElementById("orderDetailsForm")
    .addEventListener("submit", handleOrderSubmission);
});
