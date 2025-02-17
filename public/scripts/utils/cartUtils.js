import { baseUrl } from "../constants.js";
import { addToCart, updateCartQuantity } from "../../data/cart.js";

// Check if the user is authenticated
export async function isAuthenticated() {
  try {
    const response = await fetch(`${baseUrl}/api/users/is-authenticated`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data.authenticated;
    }
  } catch (error) {
    console.error("Authentication check failed:", error);
  }
  return false;
}

// Initialize Add to Cart listeners
export function initAddToCartListeners() {
  const buttons = document.querySelectorAll(".js-add-to-cart");

  buttons.forEach((button) => {
    if (button.dataset.listenerAttached === "true") return; // ✅ Prevent duplicate listeners
    button.dataset.listenerAttached = "true"; // ✅ Mark it as attached

    button.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("🛒 Add to Cart clicked"); // ✅ Debug log

      button.disabled = true;
      const productId = button.dataset.productId;
      if (!productId) {
        console.error("❌ Error: Missing productId.");
        button.disabled = false;
        return;
      }

      const isUserAuthenticated = await isAuthenticated();
      if (!isUserAuthenticated) {
        if (confirm("You must log in to add items to your cart. Log in now?")) {
          window.location.href = "/login.html";
        } else {
          alert("❌ You must log in to add items.");
        }
        button.disabled = false;
        return;
      }

      await handleAddToCart(productId, button);
    });
  });
}

async function handleAddToCart(productId, button) {
  try {
    await addToCart(productId, 1);
    await updateCartQuantity();
    await fetchCart(); // ✅ Only call fetchCart() once

    // ✅ Show "Added to Cart" notification
    const addedMessage = button.parentElement.querySelector(".added-to-cart");
    if (addedMessage) {
      addedMessage.style.opacity = "1";
      setTimeout(() => {
        addedMessage.style.opacity = "0";
      }, 2000);
    }
  } catch (error) {
    console.error("❌ Error adding product to cart:", error);
    alert("Failed to add item to cart.");
  } finally {
    button.disabled = false;
  }
}
