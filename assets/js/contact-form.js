/*
  Este archivo hace funcionar el formulario de contacto.html.
  Primero revisa los datos. Si estan completos, abre WhatsApp con un mensaje
  listo para enviar al consultorio. La persona termina el envio en WhatsApp;
  una cita queda confirmada solo cuando el consultorio responde.
*/
// Las acciones de este archivo se preparan al abrir Contacto. Se mantienen juntas para no mezclarse con las del menu.
(() => {
// Buscamos el formulario de esta pagina. El nombre contactForm coincide con el que aparece en contacto.html.
  const form = document.getElementById('contactForm');
// Si este archivo se cargara en una pagina sin formulario, terminamos aqui y dejamos funcionar el resto de la pagina.
  if (!form) return;

  // Para cambiar el destinatario, escribe aqui el codigo de pais seguido del numero, sin espacios.
  const clinicWhatsApp = '59172347510';
// Reunimos los espacios donde la persona escribe o elige datos. Los nombres de la izquierda se usan a lo largo de este archivo.
  const fields = {
    tipo: form.elements.namedItem('tipo'),
    nombre: form.elements.namedItem('nombre'),
    telefono: form.elements.namedItem('telefono'),
    email: form.elements.namedItem('email'),
    especialidad: form.elements.namedItem('especialidad'),
    fecha: form.elements.namedItem('fecha'),
    mensaje: form.elements.namedItem('mensaje')
  };
// Este es el bloque que contiene la fecha preferida y que solo se muestra al pedir una cita.
  const reservationFields = document.getElementById('reservationFields');
// Aqui apareceran los avisos generales, por ejemplo que faltan datos o que el mensaje ya esta listo.
  const feedback = document.getElementById('mensajeConfirmacion');

  // Usamos la fecha de Bolivia para que el limite no cambie segun el pais de quien visita el sitio.
  function todayInBolivia() {
// Obtenemos el dia actual de Bolivia en orden ano-mes-dia, por ejemplo 2026-10-13. Ese orden permite comparar fechas.
    return new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/La_Paz' }).format(new Date());
  }

  // Cada campo tiene su propio aviso. Al corregirlo, retiramos el borde rojo y el mensaje.
  function showFieldError(key, message) {
// Buscamos el aviso que corresponde al campo revisado y escribimos su explicacion. Un texto vacio elimina el aviso.
    document.getElementById(`${key}-error`).textContent = message;
    if (message) {
// Indicamos que este dato necesita corregirse, tambien para quien utiliza una herramienta que lee la pagina en voz alta.
      fields[key].setAttribute('aria-invalid', 'true');
    } else {
// Cuando ya no hay aviso, quitamos la senal de error del campo.
      fields[key].removeAttribute('aria-invalid');
    }
  }

  // Esta funcion limpia el aviso general cuando se comienza a editar de nuevo.
  function clearFeedback() {
// Retiramos el texto y el enlace de cualquier aviso anterior.
    feedback.replaceChildren();
// Volvemos a esconder el espacio del aviso hasta que haga falta mostrar otro.
    feedback.classList.remove('show');
// Quitamos tambien la indicacion que decidia si el aviso debia verse rojo o verde.
    feedback.removeAttribute('data-state');
  }

  // Una consulta no necesita fecha. Una reserva requiere especialidad y fecha preferida.
  function updateReservationFields() {
// Comprobamos si la persona eligio Solicitar una cita.
    const isReservation = fields.tipo.value === 'reserva';
// Mostramos la fecha para reservas y la escondemos para consultas.
    reservationFields.hidden = !isReservation;
// Al realizar una consulta, la fecha queda fuera de los datos que se pueden completar.
    fields.fecha.disabled = !isReservation;
// Solo una reserva necesita obligatoriamente una fecha.
    fields.fecha.required = isReservation;
// El primer dia que se puede seleccionar es hoy, tomando la hora de Bolivia.
    fields.fecha.min = todayInBolivia();
// Al reservar hay que elegir un servicio; al preguntar algo puede dejarse sin seleccionar.
    fields.especialidad.required = isReservation;
// Agregamos el asterisco al nombre del campo cuando la especialidad es obligatoria.
    document.querySelector('label[for="especialidad"]').textContent = isReservation
      ? 'Especialidad *'
      : 'Especialidad';
    showFieldError('fecha', '');
    showFieldError('especialidad', '');
  }

  // Los enlaces de Agendar cita pueden indicar que servicio se desea reservar.
  // Solo aceptamos especialidades que ya existen en la lista del formulario.
// Leemos la informacion incluida en el enlace de llegada, como el servicio elegido en una pagina de especialidad.
  const parameters = new URLSearchParams(window.location.search);
// Si el enlace venia del boton de reserva, dejamos seleccionada la opcion Solicitar una cita.
  if (parameters.get('tipo') === 'reserva') fields.tipo.value = 'reserva';
// Recuperamos el nombre del servicio indicado en el enlace.
  const requestedSpecialty = parameters.get('especialidad');
// Antes de seleccionarlo, comprobamos que el servicio este realmente entre las opciones del formulario.
  if (Array.from(fields.especialidad.options).some(option => option.value && option.value === requestedSpecialty)) {
// Dejamos elegida la especialidad que la persona estaba consultando.
    fields.especialidad.value = requestedSpecialty;
    fields.tipo.value = 'reserva';
  }
// Preparamos los campos de la primera vista segun se trate de consulta o de reserva.
  updateReservationFields();

  // Las advertencias propias reemplazan los avisos del navegador cuando este archivo esta disponible.
  form.noValidate = true;
// Cada vez que cambia el motivo de contacto, actualizamos los campos que se deben pedir.
  fields.tipo.addEventListener('change', updateReservationFields);
// Aplicamos a todos los campos la misma idea: al editar un dato, se retira su aviso anterior.
  for (const [key, field] of Object.entries(fields)) {
    field.addEventListener('input', () => {
      showFieldError(key, '');
      clearFeedback();
    });
    field.addEventListener('change', clearFeedback);
  }

  // Revisa los datos sin borrar lo que escribio la persona.
  function validate(values) {
// Empezamos sin avisos. Si encontramos un dato incorrecto, anotamos aqui el campo y la explicacion.
    const errors = {};
// El motivo de contacto debe ser una de las dos opciones que ofrece la pagina.
    if (!['consulta', 'reserva'].includes(values.tipo)) {
      errors.tipo = 'Selecciona si deseas consultar o solicitar una cita.';
    }
// Contamos las letras reales del nombre. Los espacios no sirven para cumplir el minimo.
    const nameLetters = values.nombre.match(/\p{L}/gu) || [];
// El nombre necesita al menos dos letras. Se aceptan acentos, espacios, puntos, apostrofos y guiones, pero no numeros.
    if (nameLetters.length < 2 || values.nombre.length > 100 || !/^[\p{L}\p{M} .'-]+$/u.test(values.nombre)) {
      errors.nombre = 'Escribe tu nombre con letras, entre 2 y 100 caracteres.';
    }

    // Se permiten espacios, guiones y parentesis para escribir el telefono de forma natural.
// Para contar el telefono retiramos por un momento los espacios y signos; el texto original sigue guardado para el mensaje.
    const phoneDigits = values.telefono.replace(/\D/g, '');
// El telefono admite un signo + al principio y separadores habituales. Debe contener de 7 a 15 digitos.
    if (!/^\+?[\d\s()-]+$/.test(values.telefono) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      errors.telefono = 'Escribe un telefono valido de 7 a 15 digitos, con codigo de pais si corresponde.';
    }
// El correo solo se revisa si fue escrito. El navegador ayuda a detectar si su forma no corresponde a una direccion de correo.
    if (values.email && (fields.email.validity.typeMismatch || values.email.length > 254)) {
      errors.email = 'Revisa el correo; por ejemplo: nombre@correo.com.';
    }
// Comprobamos otra vez que una especialidad seleccionada pertenezca a la lista del consultorio.
    if (values.especialidad && !Array.from(fields.especialidad.options).some(option => option.value === values.especialidad)) {
      errors.especialidad = 'Selecciona una especialidad de la lista.';
    }
// Las siguientes revisiones de especialidad y fecha se necesitan cuando se pide una cita.
    if (values.tipo === 'reserva') {
      if (!values.especialidad) errors.especialidad = 'Selecciona la especialidad de tu cita.';
      // Revisamos que sea una fecha real y que no sea anterior al dia actual.
// Intentamos interpretar el dia elegido como una fecha. Una hora fija evita confundirla con un dia vecino.
      const date = new Date(`${values.fecha}T12:00:00Z`);
// Revisamos que el dia exista y que no se haya escrito una fecha imposible, como un 31 de febrero.
      const validDate = /^\d{4}-\d{2}-\d{2}$/.test(values.fecha)
        && !Number.isNaN(date.getTime())
        && date.toISOString().slice(0, 10) === values.fecha;
// Una fecha inexistente o anterior a hoy impide continuar hacia WhatsApp.
      if (!validDate || values.fecha < todayInBolivia()) {
        errors.fecha = 'Elige una fecha de hoy en adelante.';
      }
    }
// El mensaje necesita entre 10 y 2000 caracteres. Si cambias estos limites, ajusta tambien el campo en contacto.html.
    if (values.mensaje.length < 10 || values.mensaje.length > 2000) {
      errors.mensaje = 'Describe el motivo con al menos 10 caracteres y hasta 2000.';
    }
// Devolvemos los avisos encontrados. Si esta lista queda vacia, los datos se pueden usar.
    return errors;
  }

  // Al continuar detenemos el envio normal de la pagina y preparamos una conversacion real.
  form.addEventListener('submit', event => {
// Evitamos que el boton recargue la pagina, para revisar primero los datos y conservar lo que se escribio.
    event.preventDefault();
    clearFeedback();
// Tomamos los datos actuales y retiramos espacios sobrantes al principio y al final.
    const values = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value.trim()]));
// Colocamos el correo sin espacios alrededor para revisar exactamente la direccion escrita.
    fields.email.value = values.email;
// Pedimos la revision completa antes de preparar el mensaje.
    const errors = validate(values);
// Escribimos cada aviso junto a su campo y quitamos los que ya no corresponden.
    for (const key of Object.keys(fields)) showFieldError(key, errors[key] || '');

// Buscamos el primer campo por corregir para guiar a la persona directamente hacia el.
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      feedback.textContent = 'Revisa los campos indicados antes de continuar.';
      feedback.dataset.state = 'error';
      feedback.classList.add('show');
// Llevamos el cursor al primer campo que necesita atencion.
      fields[firstError].focus();
// Si faltan correcciones, detenemos el envio aqui. No abrimos WhatsApp todavia.
      return;
    }

    // Formamos un mensaje legible; no guardamos datos personales en este dispositivo.
// Cada elemento es una linea del mensaje: consultorio, motivo, nombre y telefono. Puedes cambiar los titulos visibles de esas lineas.
    const lines = [
      'SABIMEDIC JESUS',
      values.tipo === 'reserva' ? 'Solicitud de cita' : 'Consulta',
      `Nombre: ${values.nombre}`,
      `Telefono: ${values.telefono}`
    ];
// Agregamos el correo solo cuando la persona lo completo.
    if (values.email) lines.push(`Correo: ${values.email}`);
// Usamos el nombre visible de la especialidad, como Pediatria, para que el mensaje sea facil de leer.
    if (values.especialidad) lines.push(`Especialidad: ${fields.especialidad.selectedOptions[0].textContent}`);
    if (values.tipo === 'reserva') {
// Separamos el ano, mes y dia para presentar la fecha como dia/mes/ano en WhatsApp.
      const [year, month, day] = values.fecha.split('-');
      lines.push(`Fecha preferida: ${day}/${month}/${year}`);
    }
// Dejamos una linea de separacion antes del texto que escribio la persona.
    lines.push('', `Mensaje: ${values.mensaje}`);
// Preparamos el enlace con el numero del consultorio y todo el mensaje. Los espacios, saltos de linea y signos se convierten para que el enlace pueda abrirse bien.
    const whatsappUrl = `https://wa.me/${clinicWhatsApp}?text=${encodeURIComponent(lines.join('\n'))}`;

    // Dejamos tambien un enlace visible por si el navegador no abre WhatsApp de inmediato.
    feedback.textContent = 'Datos listos. Envia el mensaje en WhatsApp; el consultorio confirmara la disponibilidad.';
// El aviso se muestra con el aspecto de datos listos. Todavia falta enviar el mensaje dentro de WhatsApp.
    feedback.dataset.state = 'ready';
// Creamos un enlace alternativo para continuar manualmente si WhatsApp no se abre de inmediato.
    const openLink = document.createElement('a');
// El enlace alternativo tiene el mismo destinatario y mensaje que el envio principal.
    openLink.href = whatsappUrl;
    openLink.textContent = 'Abrir conversacion en WhatsApp';
// Colocamos ese enlace debajo del aviso visible.
    feedback.append(openLink);
    feedback.classList.add('show');
// Abrimos la conversacion de WhatsApp con el texto preparado. Esta accion no confirma una cita ni envia el mensaje por cuenta propia.
    window.location.assign(whatsappUrl);
  });
})();
