const menuToggle = document.querySelector(".menu-toggle");

const mobileMenu = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const menuIsOpen = mobileMenu.classList.toggle("is-open");

  menuToggle.setAttribute("aria-expanded", String(menuIsOpen));

  menuToggle.setAttribute("aria-label", menuIsOpen ? "Cerrar menu" : "Abrir menu");

  menuToggle.textContent = menuIsOpen ? "×" : "☰";
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute("aria-label", "Abrir menu");

    menuToggle.textContent = "☰";
  });
});
