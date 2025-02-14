document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".js-sidebar");
  const menuToggle = document.querySelector(".js-menu-toggle");
  const menuClose = document.querySelector(".js-menu-close");
  const menuIcon = menuToggle.querySelector("i"); // Toggle menu icon

  if (!sidebar || !menuToggle) {
    console.error("❌ Sidebar or menu toggle not found!");
    return;
  }

  // ✅ Open Sidebar Function
  const openSidebar = () => {
    sidebar.classList.remove("-translate-x-full"); // Show sidebar
    menuIcon.classList.replace("fa-bars", "fa-times");
  };

  // ✅ Close Sidebar Function
  const closeSidebar = () => {
    sidebar.classList.add("-translate-x-full"); // Hide sidebar
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

  // 📌 Close Sidebar when Pressing Escape Key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();
    }
  });
});
