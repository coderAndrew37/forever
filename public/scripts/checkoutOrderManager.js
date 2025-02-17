import { cartItems, clearCart } from "./checkoutCartManager.js";

const isValidPhoneNumber = (phone) =>
  /^\+\d{1,3}\s?\d{3}\s?\d{6,}$/.test(phone);

export async function prefillOrderForm() {
  try {
    const response = await fetch("/api/users/profile", {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const userData = await response.json();
      document.getElementById("name").value = userData?.name || "";
      document.getElementById("email").value = userData?.email || "";
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

export async function handleOrderSubmission(e) {
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

    const responseData = await response.json();
    if (!response.ok)
      throw new Error(responseData.message || "Failed to place order");

    await clearCart();

    Swal.fire({
      icon: "success",
      title: "Order Placed Successfully!",
      text: "Your order has been placed. Thank you for shopping with us!",
      confirmButtonText: "OK",
      customClass: { confirmButton: "button-primary" },
    }).then(() => {
      window.location.href = "/orders.html";
    });
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Could not place order. Please try again.");
  } finally {
    setTimeout(() => {
      placeOrderButton.disabled = false;
      placeOrderButton.innerHTML = `Place Order`;
    }, 1500);
  }
}
