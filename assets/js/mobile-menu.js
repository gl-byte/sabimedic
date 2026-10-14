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
// Escuchamos cuando alguien pulsa la hamburguesa. Cada pulsacion cambia el menu entre abierto y cerrado.
menuToggle.addEventListener('click', () => {
  // El CSS muestra el panel cuando encuentra la clase is-open.
// Esta marca guarda si los enlaces quedaron visibles o escondidos despues de pulsar el boton.
  const menuIsOpen = mobileMenu.classList.toggle('is-open');

  // Estos datos ayudan a que el boton sea comprensible para lectores de pantalla.
// Comunicamos si el menu esta abierto a las herramientas que leen la pagina en voz alta.
  menuToggle.setAttribute('aria-expanded', String(menuIsOpen));
// Actualizamos la descripcion del boton: cuando esta abierto sirve para cerrar, y al cerrarse sirve para abrir.
  menuToggle.setAttribute('aria-label', menuIsOpen ? 'Cerrar menu' : 'Abrir menu');

  // La X indica que se puede cerrar; las tres lineas indican que se puede abrir.
  menuToggle.textContent = menuIsOpen ? '×' : '☰';
});

// Al elegir una pagina, escondemos el panel para dejar visible el nuevo contenido.
// Aplicamos el cierre a cada enlace del menu para que funcione igual al elegir Inicio, Nosotros, Especialidades o Contacto.
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
// Ocultamos las opciones despues de elegir un destino.
    mobileMenu.classList.remove('is-open');
// Indicamos que las opciones ya quedaron cerradas.
    menuToggle.setAttribute('aria-expanded', 'false');
// La proxima accion del boton sera abrir el menu.
    menuToggle.setAttribute('aria-label', 'Abrir menu');
// Volvemos a mostrar el simbolo de tres lineas.
    menuToggle.textContent = '☰';
  });
});
