import { baseUrl } from "./constants.js";
import { isAuthenticated } from "./utils/cartUtils.js";
import { updateCartQuantity, removeFromCart, addToCart } from "../data/cart.js";

let autoCloseTimeout;

/** Fetch Cart Data and Render Preview */
export async function fetchCart() {
  try {
    const response = await fetch(`${baseUrl}/api/cart/get-cart`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to fetch cart.");

    const { cart } = await response.json(); // Extract cart items
    console.log("✅ Fetched cart data:", cart);

    if (!cart || cart.length === 0) {
      renderCartPreview([]); // Handle empty cart
      return;
    }

    // Fetch full product details using stored product IDs
    const productIds = cart.map((item) => item.productId).join(",");
    const productResponse = await fetch(
      `${baseUrl}/api/products/by-ids?ids=${productIds}`
    );

    if (!productResponse.ok)
      throw new Error("Failed to fetch product details.");

    const products = await productResponse.json(); // Get full product details

    // Merge cart items with full product details
    const enrichedCart = cart.map((cartItem) => {
      const matchingProduct = products.find(
        (product) => product._id === cartItem.productId
      );
      return {
        ...cartItem,
        name: matchingProduct ? matchingProduct.name : "Unknown Item",
        price: matchingProduct ? matchingProduct.priceCents / 100 : 0,
        image: matchingProduct ? matchingProduct.image : "/images/default.jpg",
      };
    });

    renderCartPreview(enrichedCart);
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
  }
}

/** Render Cart Preview */
function renderCartPreview(cartItems) {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartSubtotal = document.getElementById("cart-subtotal");

  if (!cartItemsContainer || !cartSubtotal) {
    console.error("❌ Error: Cart preview elements missing.");
    return;
  }

  cartItemsContainer.innerHTML = "";

  if (!cartItems || cartItems.length === 0) {
    cartItemsContainer.innerHTML =
      "<p class='text-gray-500 text-center py-2'>Your cart is empty.</p>";
    cartSubtotal.textContent = "KSH 0.00";
    closeCartPreview();
    return;
  }

  let subtotal = 0;
  cartItems.forEach((item) => {
    subtotal += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "flex justify-between items-center border-b pb-2 p-2";
    cartItem.innerHTML = `
      <div class="flex items-center space-x-2">
        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded">
        <div>
          <p class="text-sm font-semibold">${item.name}</p>
          <p class="text-xs text-gray-500">KSH ${item.price} x ${item.quantity}</p>
        </div>
      </div>
      <button class="remove-item text-red-500" data-product-id="${item.productId}">
        <i class="fas fa-trash-alt"></i>
      </button>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  cartSubtotal.textContent = `KSH ${subtotal.toLocaleString("en-KE")}`;

  setTimeout(() => attachRemoveItemListeners(), 100); // ✅ Delay attaching to ensure elements exist
  openCartPreview(); // ✅ Show cart preview
}

/** Attach Remove Button Listeners */
function attachRemoveItemListeners() {
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.closest(".remove-item").dataset.productId;
      if (!productId) {
        console.error("❌ Error: Missing productId for removal.");
        return;
      }
      console.log("🗑 Removing product:", productId);

      try {
        const response = await fetch(
          `${baseUrl}/api/cart/remove-from-cart/${productId}`, // ✅ Correct API endpoint
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to remove item: ${errorText}`);
        }

        console.log("✅ Product removed from cart.");
        await fetchCart(); // Refresh cart preview
      } catch (error) {
        console.error("❌ Error removing product from cart:", error);
      }
    });
  });
}

/** Open the Cart Preview */
function openCartPreview() {
  const cartPreview = document.getElementById("cart-preview");
  if (!cartPreview) {
    console.error("❌ Error: Cart preview element not found.");
    return;
  }
  cartPreview.classList.remove("translate-x-full");

  clearTimeout(autoCloseTimeout);
  autoCloseTimeout = setTimeout(() => {
    closeCartPreview();
  }, 5000);
}

/** Close the Cart Preview */
function closeCartPreview() {
  const cartPreview = document.getElementById("cart-preview");
  if (!cartPreview) {
    console.error("❌ Error: Cart preview element not found.");
    return;
  }
  cartPreview.classList.add("translate-x-full");
}

/** Initialize the Cart Preview */
document.addEventListener("DOMContentLoaded", async () => {
  const cartPreview = document.getElementById("cart-preview");
  const closeCartBtn = document.getElementById("close-cart");

  if (!cartPreview || !closeCartBtn) {
    console.error("❌ Error: Missing cart preview elements.");
    return;
  }

  /** Close Cart Manually */
  closeCartBtn.addEventListener("click", closeCartPreview);

  /** Close Cart When Clicking Outside */
  document.addEventListener("click", (event) => {
    if (
      !cartPreview.contains(event.target) &&
      !event.target.closest(".js-add-to-cart")
    ) {
      closeCartPreview();
    }
  });

  /** Handle Add to Cart Event */
  document.addEventListener("click", async (event) => {
    if (event.target.closest(".js-add-to-cart")) {
      const productId =
        event.target.closest(".js-add-to-cart").dataset.productId;

      if (!productId) {
        console.error("❌ Error: Missing productId for add to cart.");
        return;
      }

      const isUserAuthenticated = await isAuthenticated();
      if (!isUserAuthenticated) {
        alert("You must log in to add items to your cart.");
        window.location.href = "/login.html";
        return;
      }

      await addToCart(productId, 1);
      await fetchCart(); // Refresh cart preview
    }
  });
});
