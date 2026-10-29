document.querySelectorAll(".specialty-flip-toggle").forEach((button) => {
  const area = button.closest(".specialty-flip");
  const mouseAvailable = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  function setFlipped(open) {
    area.classList.toggle("is-flipped", open);
    button.setAttribute("aria-pressed", String(open));
  }

  area.addEventListener("pointerenter", () => {
    if (mouseAvailable.matches) setFlipped(true);
  });

  area.addEventListener("pointerleave", () => {
    if (mouseAvailable.matches) setFlipped(false);
  });

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
