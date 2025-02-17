import { baseUrl } from "./constants.js";
import { showToast } from "./utils/toast.js";

let editingProductId = null;
let currentPage = 1;
const itemsPerPage = 10; // Match backend pagination limit

// ✅ Fetch & Render Products with Pagination
async function fetchProducts(page = 1) {
  try {
    const response = await fetch(`${baseUrl}/api/products?page=${page}&limit=${itemsPerPage}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to fetch products");

    const { products, currentPage, totalPages } = await response.json();
    renderProducts(products);
    renderPagination(currentPage, totalPages);
  } catch (error) {
    console.error("Error fetching products:", error);
    showToast("Failed to load products", "error");
  }
}

// ✅ Render Products in Table
function renderProducts(products) {
  const tableBody = document.getElementById("productsTable");
  tableBody.innerHTML = products
    .map(
      (p) => `
    <tr>
      <td class="border px-4 py-2">
        <img src="${p.image}" alt="Product Image" class="w-16 h-16 rounded-md"/>
      </td>
      <td class="border px-4 py-2">${p.name}</td>
      <td class="border px-4 py-2">KSH ${(p.priceCents / 100).toLocaleString()}</td>
      <td class="border px-4 py-2">${p.categorySlug}</td>
      <td class="border px-4 py-2">${p.isOnOffer ? "Yes" : "No"}</td>
      <td class="border px-4 py-2">
        <button class="edit-btn bg-blue-500 text-white px-3 py-1 rounded" data-id="${p._id}">Edit</button>
        <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded" data-id="${p._id}">Delete</button>
      </td>
    </tr>`
    )
    .join("");

  attachEventListeners();
}

// ✅ Render Pagination Controls
function renderPagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) {
    console.error("Pagination container not found!");
    return;
  }
  
  paginationContainer.innerHTML = "";

  if (totalPages <= 1) return; // Hide pagination if only one page

  // Previous Button
  if (currentPage > 1) {
    paginationContainer.innerHTML += `<button class="page-btn bg-gray-300 px-3 py-1 rounded" data-page="${
      currentPage - 1
    }">Previous</button>`;
  }

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `<button class="page-btn ${
      i === currentPage ? "bg-blue-500 text-white" : "bg-gray-300"
    } px-3 py-1 rounded mx-1" data-page="${i}">${i}</button>`;
  }

  // Next Button
  if (currentPage < totalPages) {
    paginationContainer.innerHTML += `<button class="page-btn bg-gray-300 px-3 py-1 rounded" data-page="${
      currentPage + 1
    }">Next</button>`;
  }

  // Attach pagination event listeners
  document.querySelectorAll(".page-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const page = parseInt(button.dataset.page, 10);
      fetchProducts(page);
    });
  });
}


// ✅ Attach Event Listeners for Edit/Delete
function attachEventListeners() {
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.id;
      openEditModal(productId);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.id;
      await deleteProduct(productId);
    });
  });
}

// ✅ Open Add/Edit Modal
function openModal(title) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("productModal").classList.remove("hidden");
}

// ✅ Close Modal
document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("productModal").classList.add("hidden");
  document.getElementById("productForm").reset();
  editingProductId = null;
});

// ✅ Add / Update Product
document.getElementById("productForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const productData = {
    name: document.getElementById("productName").value.trim(),
    priceCents: Math.round(parseFloat(document.getElementById("productPrice").value) * 100),
    categorySlug: document.getElementById("productCategory").value.trim(),
    description: document.getElementById("productDescription").value.trim(),
    image: document.getElementById("productImage").value.trim(),
    rating: {
      stars: parseFloat(document.getElementById("productRatingStars").value),
      count: parseInt(document.getElementById("productRatingCount").value, 10),
    },
    isOnOffer: document.getElementById("productOnOffer").checked,
  };

  try {
    const url = editingProductId
      ? `${baseUrl}/api/products/${editingProductId}`
      : `${baseUrl}/api/products`;
    const method = editingProductId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to save product");

    showToast(`Product ${editingProductId ? "updated" : "added"} successfully!`, "success");
    document.getElementById("productModal").classList.add("hidden");
    document.getElementById("productForm").reset();
    editingProductId = null;
    fetchProducts(currentPage); // Refresh current page
  } catch (error) {
    console.error("Error saving product:", error);
    showToast("Failed to save product", "error");
  }
});

// ✅ Delete Product
async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const response = await fetch(`${baseUrl}/api/products/${productId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to delete product");

    showToast("Product deleted!", "success");
    fetchProducts(currentPage); // Refresh current page
  } catch (error) {
    console.error("Error deleting product:", error);
    showToast("Failed to delete product", "error");
  }
}

// ✅ Initialize on Page Load
document.addEventListener("DOMContentLoaded", () => fetchProducts(currentPage));
