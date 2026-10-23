/* Cada fotografia tiene una cara posterior con un concepto breve. Se puede abrir con el mouse, con el dedo o con el teclado. */
document.querySelectorAll(".specialty-flip-toggle").forEach((button) => {
  const area = button.closest(".specialty-flip");
  const mouseAvailable = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  // Una sola funcion mantiene de acuerdo el giro visible y la indicacion para herramientas de lectura en voz alta.
  function setFlipped(open) {
    area.classList.toggle("is-flipped", open);
    button.setAttribute("aria-pressed", String(open));
  }

  // En computadora el concepto aparece al pasar el mouse por la fotografia.
  area.addEventListener("pointerenter", () => {
    if (mouseAvailable.matches) setFlipped(true);
  });

  area.addEventListener("pointerleave", () => {
    if (mouseAvailable.matches) setFlipped(false);
  });

  // En celulares, tocar la foto alterna las dos caras sin abrir la pagina del servicio.
  button.addEventListener("click", () => {
    setFlipped(button.getAttribute("aria-pressed") !== "true");
  });

  button.addEventListener("focus", () => {
    if (button.matches(":focus-visible")) setFlipped(true);
  });

  button.addEventListener("blur", () => setFlipped(false));
  button.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setFlipped(false);
  });
});
