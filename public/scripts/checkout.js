import { renderOrderSummary } from "./renderOrderSummary.js";
import { updateCartQuantity } from "../data/cart.js";

let cartItems = []; // Initialize cartItems as an empty array
let totalCents = 0; // Initialize totalCents

const isValidPhoneNumber = (phone) =>
  /^\+\d{1,3}\s?\d{3}\s?\d{6,}$/.test(phone);

// Fetch and set cart items on page load
async function fetchCartItems() {
  try {
    const response = await fetch("/api/cart/get-cart", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      cartItems = data.cart || [];

      // Fetch product details for each cart item to include name and priceCents
      const productIds = cartItems.map((item) => item.productId).join(",");
      const productResponse = await fetch(
        `/api/products/by-ids?ids=${productIds}`
      );
      if (productResponse.ok) {
        const products = await productResponse.json();

        // Merge name and priceCents from products into cart items
        cartItems = cartItems.map((item) => {
          const matchingProduct = products.find(
            (product) => product._id === item.productId
          );
          return {
            ...item,
            name: matchingProduct ? matchingProduct.name : "Unknown Item",
            priceCents: matchingProduct ? matchingProduct.priceCents : 0,
          };
        });
      } else {
        console.warn("Could not fetch product details.");
      }
    } else {
      console.warn("Could not fetch cart items.");
    }
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
}

// Attach event listeners for quantity updates and deletions
function attachCartEventListeners() {
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
      await updateQuantity(productId, 0); // Set quantity to 0 to remove item
      await renderOrderSummary(cartItems);
      updateCartQuantity();
    });
  });
}

// Update quantity or remove item in the cart
async function updateQuantity(productId, newQuantity) {
  try {
    if (newQuantity <= 0) {
      await fetch(`/api/cart/remove-from-cart/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
    } else {
      await fetch("/api/cart/update-cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQuantity }),
        credentials: "include",
      });
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
}

// Prefill order form with user data
async function prefillOrderForm() {
  try {
    const response = await fetch("/api/users/profile", {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const userData = await response.json();
      document.getElementById("name").value = userData?.name || "";
      document.getElementById("email").value = userData?.email || "";
    } else {
      console.warn("Could not fetch user profile.");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

// Submit order details form
async function handleOrderSubmission(e) {
  e.preventDefault();

  const phone = document.getElementById("phone").value;
  if (!isValidPhoneNumber(phone)) {
    alert("Please enter a valid phone number in the format +254 712 345678");
    return;
  }

  const itemsForSubmission = cartItems.map(
    ({ productId, quantity, priceCents }) => ({
      productId,
      quantity,
      priceCents,
    })
  );

  const placeOrderButton = document.querySelector(".js-place-order-button");
  placeOrderButton.disabled = true;
  placeOrderButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Placing Order...`;

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone,
    address: document.getElementById("address").value,
    paymentMethod: "Cash on Delivery",
    items: itemsForSubmission,
    totalCents: itemsForSubmission.reduce(
      (sum, item) => sum + item.quantity * item.priceCents,
      0
    ),
    orderDate: new Date().toISOString(),
  };

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to place order");
    }

    // Clear the cart after order placement
    cartItems = [];
    await renderOrderSummary(cartItems);
    updateCartQuantity();

    // Show SweetAlert success message and redirect to orders page
    Swal.fire({
      icon: "success",
      title: "Order Placed Successfully!",
      text: "Your order has been placed. Thank you for shopping with us!",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "button-primary",
      },
    }).then(() => {
      window.location.href = "/orders.html"; // Redirect to the orders page
    });
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Could not place order. Please try again.");
  } finally {
    placeOrderButton.disabled = false;
    placeOrderButton.innerHTML = `Place Order`;
  }
}

// Setup Modal Listeners
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
    orderDetailsModal.style.display = "flex"; // Show modal when button is clicked
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

// Initial render on page load
document.addEventListener("DOMContentLoaded", async () => {
  await fetchCartItems();
  await renderOrderSummary(cartItems);
  updateCartQuantity();
  attachCartEventListeners();
  setupModalListeners();

  // Attach submit event handler to the form
  document
    .getElementById("orderDetailsForm")
    .addEventListener("submit", handleOrderSubmission);
});
