export function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");

  if (!toastContainer) {
    console.error("Toast container not found!");
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="close-btn">&times;</button>
    <div class="progress-bar"></div>
  `;

  toastContainer.appendChild(toast);

  // Close toast manually
  toast.querySelector(".close-btn").addEventListener("click", () => {
    toast.remove();
  });

  // Auto dismiss with animation
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
