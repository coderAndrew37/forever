document.addEventListener("scroll", () => {
  document
    .querySelector("header")
    .classList.toggle("bg-white", window.scrollY > 50);
});

document.querySelector(".js-menu-toggle").addEventListener("click", () => {
  document.querySelector(".js-sidebar").classList.remove("-translate-x-full");
});

document.querySelector(".js-menu-close").addEventListener("click", () => {
  document.querySelector(".js-sidebar").classList.add("-translate-x-full");
});

document.querySelector(".js-search-toggle").addEventListener("click", () => {
  document
    .querySelector(".js-search-bar-container")
    .classList.remove("-translate-y-full");
});

document.querySelector(".js-search-close").addEventListener("click", () => {
  document
    .querySelector(".js-search-bar-container")
    .classList.add("-translate-y-full");
});
