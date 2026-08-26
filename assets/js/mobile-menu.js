/*
  Este archivo controla la hamburguesa de las paginas de especialidades.
  Se comparte para que todas las paginas abran y cierren el menu exactamente
  de la misma manera. Si deseas cambiar el simbolo, el texto o el comportamiento,
  este es el unico lugar que necesitas editar.
*/

// Tomamos el boton que la persona toca cuando usa un celular.
const menuToggle = document.querySelector('.menu-toggle');

// Tomamos la barra que contiene los enlaces de Inicio, Nosotros y Contacto.
const mobileMenu = document.querySelector('.site-nav');

// Abrimos o cerramos la barra y actualizamos la informacion del boton.
menuToggle.addEventListener('click', () => {
  // El CSS muestra el panel cuando encuentra la clase is-open.
  const menuIsOpen = mobileMenu.classList.toggle('is-open');

  // Estos datos ayudan a que el boton sea comprensible para lectores de pantalla.
  menuToggle.setAttribute('aria-expanded', String(menuIsOpen));
  menuToggle.setAttribute('aria-label', menuIsOpen ? 'Cerrar menu' : 'Abrir menu');

  // La X indica que se puede cerrar; las tres lineas indican que se puede abrir.
  menuToggle.textContent = menuIsOpen ? '×' : '☰';
});

// Al elegir una pagina, escondemos el panel para dejar visible el nuevo contenido.
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    menuToggle.textContent = '☰';
  });
});
