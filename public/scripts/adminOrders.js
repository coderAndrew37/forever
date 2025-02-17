import { baseUrl } from "./constants.js";
import { showToast } from "./utils/toast.js";

let currentPage = 1;
const itemsPerPage = 10;

// ✅ Fetch & Render Orders
async function fetchOrders(page = 1, status = "", search = "") {
  try {
    const response = await fetch(
      `${baseUrl}/api/orders/admin?page=${page}&limit=${itemsPerPage}&status=${status}&search=${search}`,
      { method: "GET", credentials: "include" }
    );

    if (!response.ok) throw new Error("Failed to fetch orders");
    const { orders, currentPage, totalPages } = await response.json();
    renderOrders(orders);
    renderPagination(currentPage, totalPages);
  } catch (error) {
    console.error("Error fetching orders:", error);
    showToast("Failed to load orders", "error");
  }
}

// ✅ Render Orders in Table
function renderOrders(orders) {
  const tableBody = document.getElementById("ordersTable");
  tableBody.innerHTML = orders
    .map(
      (o) => `
    <tr>
      <td class="border px-4 py-2">${o._id}</td>
      <td class="border px-4 py-2">${o.name}</td>
      <td class="border px-4 py-2">${o.email}</td>
      <td class="border px-4 py-2">KSH ${(
        o.totalCents / 100
      ).toLocaleString()}</td>
      <td class="border px-4 py-2">
        <select class="status-dropdown" data-id="${o._id}">
          <option value="Preparing" ${
            o.status === "Preparing" ? "selected" : ""
          }>Preparing</option>
          <option value="Shipped" ${
            o.status === "Shipped" ? "selected" : ""
          }>Shipped</option>
          <option value="Delivered" ${
            o.status === "Delivered" ? "selected" : ""
          }>Delivered</option>
        </select>
      </td>
      <td class="border px-4 py-2">
        <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded" data-id="${
          o._id
        }">Delete</button>
      </td>
    </tr>`
    )
    .join("");
  attachEventListeners();
}

// ✅ Render Pagination Controls
function renderPagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";
  if (totalPages <= 1) return;

  if (currentPage > 1) {
    paginationContainer.innerHTML += `<button class="page-btn" data-page="${
      currentPage - 1
    }">Previous</button>`;
  }
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `<button class="page-btn ${
      i === currentPage ? "active" : ""
    }" data-page="${i}">${i}</button>`;
  }
  if (currentPage < totalPages) {
    paginationContainer.innerHTML += `<button class="page-btn" data-page="${
      currentPage + 1
    }">Next</button>`;
  }

  document.querySelectorAll(".page-btn").forEach((button) => {
    button.addEventListener("click", () =>
      fetchOrders(parseInt(button.dataset.page))
    );
  });
}

// ✅ Attach Event Listeners
function attachEventListeners() {
  document.querySelectorAll(".status-dropdown").forEach((dropdown) => {
    dropdown.addEventListener("change", async (event) => {
      const orderId = event.target.dataset.id;
      const newStatus = event.target.value;
      await updateOrderStatus(orderId, newStatus);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const orderId = event.target.dataset.id;
      await deleteOrder(orderId);
    });
  });
}

// ✅ Update Order Status
async function updateOrderStatus(orderId, status) {
  try {
    const response = await fetch(`${baseUrl}/api/orders/admin/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to update status");
    showToast("Order status updated!", "success");
    fetchOrders(currentPage);
  } catch (error) {
    console.error("Error updating order status:", error);
    showToast("Failed to update order", "error");
  }
}

// ✅ Delete Order
async function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) return;
  try {
    const response = await fetch(`${baseUrl}/api/orders/admin/${orderId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to delete order");
    showToast("Order deleted!", "success");
    fetchOrders(currentPage);
  } catch (error) {
    console.error("Error deleting order:", error);
    showToast("Failed to delete order", "error");
  }
}

// ✅ Export Orders as CSV
async function exportOrders() {
  try {
    const response = await fetch(`${baseUrl}/api/orders/admin/export`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to export orders");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error exporting orders:", error);
    showToast("Failed to export orders", "error");
  }
}

// ✅ Initialize on Page Load
document.addEventListener("DOMContentLoaded", () => {
  fetchOrders(currentPage);
  document
    .getElementById("exportOrdersBtn")
    .addEventListener("click", exportOrders);
});
