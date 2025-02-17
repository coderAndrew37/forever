export let cartItems = [];

export async function fetchCartItems() {
  try {
    const response = await fetch("/api/cart/get-cart", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      cartItems = data.cart || [];

      const productIds = cartItems.map((item) => item.productId).join(",");
      const productResponse = await fetch(
        `/api/products/by-ids?ids=${productIds}`
      );

      if (productResponse.ok) {
        const products = await productResponse.json();
        cartItems = cartItems.map((item) => {
          const matchingProduct = products.find(
            (product) => product._id === item.productId
          );
          return {
            ...item,
            name: matchingProduct?.name || "Unknown Item",
            priceCents: matchingProduct?.priceCents || 0,
          };
        });
      }
    }
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
}

export async function updateQuantity(productId, newQuantity) {
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

export async function clearCart() {
  try {
    await fetch("/api/cart/clear-cart", {
      method: "DELETE",
      credentials: "include",
    });
    cartItems = [];
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
}
