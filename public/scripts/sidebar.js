document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".js-sidebar");
  const overlay = document.querySelector(".js-overlay");
  const menuToggle = document.querySelector(".js-menu-toggle");
  const menuClose = document.querySelector(".js-menu-close");
  const menuIcon = menuToggle.querySelector("i"); // Toggle menu icon

  if (!sidebar || !menuToggle || !overlay) {
    console.error("❌ Sidebar, menu toggle, or overlay not found!");
    return;
  }

  // ✅ Open Sidebar Function
  const openSidebar = () => {
    sidebar.classList.remove("-translate-x-full"); // Show sidebar
    overlay.classList.remove("hidden"); // Show overlay
    menuIcon.classList.replace("fa-bars", "fa-times");
  };

  // ✅ Close Sidebar Function
  const closeSidebar = () => {
    sidebar.classList.add("-translate-x-full"); // Hide sidebar
    overlay.classList.add("hidden"); // Hide overlay
    menuIcon.classList.replace("fa-times", "fa-bars");
  };

  // 📌 Toggle Sidebar on Menu Click
  menuToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("-translate-x-full")) {
      openSidebar();
    } else {
      closeSidebar();
    }
  });

  // 📌 Close Sidebar when Clicking Close Button
  menuClose.addEventListener("click", closeSidebar);

  // 📌 Close Sidebar when Clicking Outside (Overlay)
  overlay.addEventListener("click", closeSidebar);
});
