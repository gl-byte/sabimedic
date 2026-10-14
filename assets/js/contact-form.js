(() => {
  const form = document.getElementById("contactForm");

  if (!form) return;

  const clinicWhatsApp = "59172347510";

  const fields = {
    tipo: form.elements.namedItem("tipo"),
    nombre: form.elements.namedItem("nombre"),
    telefono: form.elements.namedItem("telefono"),
    email: form.elements.namedItem("email"),
    especialidad: form.elements.namedItem("especialidad"),
    fecha: form.elements.namedItem("fecha"),
    mensaje: form.elements.namedItem("mensaje")
  };

  const reservationFields = document.getElementById("reservationFields");

  const feedback = document.getElementById("mensajeConfirmacion");

  function todayInBolivia() {
    return new Intl.DateTimeFormat("sv-SE", { timeZone: "America/La_Paz" }).format(
      new Date()
    );
  }

  function showFieldError(key, message) {
    document.getElementById(`${key}-error`).textContent = message;
    if (message) {
      fields[key].setAttribute("aria-invalid", "true");
    } else {
      fields[key].removeAttribute("aria-invalid");
    }
  }

  function clearFeedback() {
    feedback.replaceChildren();

    feedback.classList.remove("show");

    feedback.removeAttribute("data-state");
  }

  function updateReservationFields() {
    const isReservation = fields.tipo.value === "reserva";

    reservationFields.hidden = !isReservation;

    fields.fecha.disabled = !isReservation;

    fields.fecha.required = isReservation;

    fields.fecha.min = todayInBolivia();

    fields.especialidad.required = isReservation;

    document.querySelector('label[for="especialidad"]').textContent = isReservation
      ? "Especialidad *"
      : "Especialidad";
    showFieldError("fecha", "");
    showFieldError("especialidad", "");
  }

  const parameters = new URLSearchParams(window.location.search);

  if (parameters.get("tipo") === "reserva") fields.tipo.value = "reserva";

  const requestedSpecialty = parameters.get("especialidad");

  if (
    Array.from(fields.especialidad.options).some(
      (option) => option.value && option.value === requestedSpecialty
    )
  ) {
    fields.especialidad.value = requestedSpecialty;
    fields.tipo.value = "reserva";
  }

  updateReservationFields();

  form.noValidate = true;

  fields.tipo.addEventListener("change", updateReservationFields);

  for (const [key, field] of Object.entries(fields)) {
    field.addEventListener("input", () => {
      showFieldError(key, "");
      clearFeedback();
    });
    field.addEventListener("change", clearFeedback);
  }

  function validate(values) {
    const errors = {};

    if (!["consulta", "reserva"].includes(values.tipo)) {
      errors.tipo = "Selecciona si deseas consultar o solicitar una cita.";
    }

    const nameLetters = values.nombre.match(/\p{L}/gu) || [];

    if (
      nameLetters.length < 2 ||
      values.nombre.length > 100 ||
      !/^[\p{L}\p{M} .'-]+$/u.test(values.nombre)
    ) {
      errors.nombre = "Escribe tu nombre con letras, entre 2 y 100 caracteres.";
    }

    const phoneDigits = values.telefono.replace(/\D/g, "");

    if (
      !/^\+?[\d\s()-]+$/.test(values.telefono) ||
      phoneDigits.length < 7 ||
      phoneDigits.length > 15
    ) {
      errors.telefono =
        "Escribe un telefono valido de 7 a 15 digitos, con codigo de pais si corresponde.";
    }

    if (
      values.email &&
      (fields.email.validity.typeMismatch || values.email.length > 254)
    ) {
      errors.email = "Revisa el correo; por ejemplo: nombre@correo.com.";
    }

    if (
      values.especialidad &&
      !Array.from(fields.especialidad.options).some(
        (option) => option.value === values.especialidad
      )
    ) {
      errors.especialidad = "Selecciona una especialidad de la lista.";
    }

    if (values.tipo === "reserva") {
      if (!values.especialidad)
        errors.especialidad = "Selecciona la especialidad de tu cita.";

      const date = new Date(`${values.fecha}T12:00:00Z`);

      const validDate =
        /^\d{4}-\d{2}-\d{2}$/.test(values.fecha) &&
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === values.fecha;

      if (!validDate || values.fecha < todayInBolivia()) {
        errors.fecha = "Elige una fecha de hoy en adelante.";
      }
    }

    if (values.mensaje.length < 10 || values.mensaje.length > 2000) {
      errors.mensaje = "Describe el motivo con al menos 10 caracteres y hasta 2000.";
    }

    return errors;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFeedback();

    const values = Object.fromEntries(
      Object.entries(fields).map(([key, field]) => [key, field.value.trim()])
    );

    fields.email.value = values.email;

    const errors = validate(values);

    for (const key of Object.keys(fields)) showFieldError(key, errors[key] || "");

    const firstError = Object.keys(errors)[0];
    if (firstError) {
      feedback.textContent = "Revisa los campos indicados antes de continuar.";
      feedback.dataset.state = "error";
      feedback.classList.add("show");

      fields[firstError].focus();

      return;
    }

    const lines = [
      "SABIMEDIC JESUS",
      values.tipo === "reserva" ? "Solicitud de cita" : "Consulta",
      `Nombre: ${values.nombre}`,
      `Telefono: ${values.telefono}`
    ];

    if (values.email) lines.push(`Correo: ${values.email}`);

    if (values.especialidad)
      lines.push(`Especialidad: ${fields.especialidad.selectedOptions[0].textContent}`);
    if (values.tipo === "reserva") {
      const [year, month, day] = values.fecha.split("-");
      lines.push(`Fecha preferida: ${day}/${month}/${year}`);
    }

    lines.push("", `Mensaje: ${values.mensaje}`);

    const whatsappUrl = `https://wa.me/${clinicWhatsApp}?text=${encodeURIComponent(lines.join("\n"))}`;

    feedback.textContent =
      "Datos listos. Envia el mensaje en WhatsApp; el consultorio confirmara la disponibilidad.";

    feedback.dataset.state = "ready";

    const openLink = document.createElement("a");

    openLink.href = whatsappUrl;
    openLink.textContent = "Abrir conversacion en WhatsApp";

    feedback.append(openLink);
    feedback.classList.add("show");

    window.location.assign(whatsappUrl);
  });
})();
