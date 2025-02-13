document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".js-menu-toggle");
  const menuClose = document.querySelector(".js-menu-close");
  const sidebar = document.querySelector(".js-sidebar");

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
  });

  menuClose.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
  });
});
