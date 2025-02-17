import {
  cartItems,
  fetchCartItems,
  updateQuantity,
} from "./checkoutCartManager.js";
import {
  prefillOrderForm,
  handleOrderSubmission,
} from "./checkoutOrderManager.js";
import { renderOrderSummary } from "./renderOrderSummary.js";
import { updateCartQuantity } from "../data/cart.js";

async function attachCartEventListeners() {
  document.querySelectorAll(".js-quantity-select").forEach((select) => {
    select.addEventListener("change", async (event) => {
      const productId = event.target.dataset.productId;
      const newQuantity = parseInt(event.target.value, 10);
      await updateQuantity(productId, newQuantity);
      await renderOrderSummary(cartItems);
      updateCartQuantity();
    });
  });

  document.querySelectorAll(".js-delete-quantity-link").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.productId;
      await updateQuantity(productId, 0);
      await renderOrderSummary(cartItems);
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

document.addEventListener("DOMContentLoaded", async () => {
  await fetchCartItems();
  await renderOrderSummary(cartItems);
  updateCartQuantity();
  attachCartEventListeners();
  setupModalListeners();

  const orderForm = document.getElementById("orderDetailsForm");
  if (orderForm) {
    orderForm.addEventListener("submit", handleOrderSubmission);
  } else {
    console.error("❌ Order form not found! Check your HTML.");
  }
});
