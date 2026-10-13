document.addEventListener('DOMContentLoaded', () => {
  const service = new AgendaService();
  const controller = new AgendaController(service);

  const contactForm = document.getElementById('contactForm');
  const inputNombre = document.getElementById('inputNombre');
  const inputApellido = document.getElementById('inputApellido');
  const inputTelefono = document.getElementById('inputTelefono');
  const btnSubmit = document.getElementById('btnSubmit');

  const contactsList = document.getElementById('contactsList');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const contactsCountBadge = document.getElementById('contactsCountBadge');
  const btnRefresh = document.getElementById('btnRefresh');

  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  async function inicializar() {
    configurarEventos();
    await obtenerYRenderizar();
  }

  function configurarEventos() {
    contactForm.addEventListener('submit', manejarEnvioFormulario);
    searchInput.addEventListener('input', manejarBusqueda);
    inputTelefono.addEventListener('input', manejarFormatoTelefono);
    btnRefresh.addEventListener('click', () => {
      searchInput.value = '';
      obtenerYRenderizar();
    });
  }

  function manejarFormatoTelefono() {
    inputTelefono.value = formatearTelefono(inputTelefono.value);
  }

  function formatearTelefono(valor) {
    if (!valor) return '';
    const empiezaConMas = valor.trim().startsWith('+');
    let digitos = valor.replace(/\D/g, '');
    if (!digitos) return empiezaConMas ? '+' : '';
    if (digitos.length > 11) digitos = digitos.substring(0, 11);

    if (digitos.length === 11 || (empiezaConMas && digitos.length > 3)) {
      const pais = digitos.charAt(0);
      const p1 = digitos.substring(1, 4);
      const p2 = digitos.substring(4, 7);
      const p3 = digitos.substring(7);
      let res = `+${pais}`;
      if (p1) res += `-${p1}`;
      if (p2) res += `-${p2}`;
      if (p3) res += `-${p3}`;
      return res;
    }

    if (digitos.length <= 3) {
      return digitos;
    } else if (digitos.length <= 6) {
      return `${digitos.substring(0, 3)}-${digitos.substring(3)}`;
    } else {
      return `${digitos.substring(0, 3)}-${digitos.substring(3, 6)}-${digitos.substring(6)}`;
    }
  }

  async function obtenerYRenderizar() {
    mostrarCargando(true);
    try {
      const contactos = await controller.cargarContactos();
      renderizarListado(contactos);
    } catch (error) {
      mostrarToast(error.message || 'Error al obtener los contactos.', 'error');
    } finally {
      mostrarCargando(false);
    }
  }

  async function manejarEnvioFormulario(evento) {
    evento.preventDefault();

    const nombre = inputNombre.value;
    const apellido = inputApellido.value;
    const telefono = inputTelefono.value;

    establecerEstadoBoton(true);

    try {
      await controller.agregarContacto(nombre, apellido, telefono);
      mostrarToast('¡Contacto registrado exitosamente!', 'success');
      contactForm.reset();
      inputNombre.focus();
      await obtenerYRenderizar();
    } catch (error) {
      mostrarToast(error.message || 'No fue posible registrar el contacto.', 'error');
    } finally {
      establecerEstadoBoton(false);
    }
  }

  function manejarBusqueda() {
    const texto = searchInput.value;
    const contactosFiltrados = controller.filtrarContactos(texto);
    renderizarListado(contactosFiltrados);
  }

  function renderizarListado(lista) {
    contactsList.innerHTML = '';
    const total = lista ? lista.length : 0;
    contactsCountBadge.textContent = String(total);

    if (total === 0) {
      emptyState.style.display = 'flex';
      return;
    }

    emptyState.style.display = 'none';

    const fragmento = document.createDocumentFragment();

    lista.forEach(contacto => {
      const card = document.createElement('article');
      card.className = 'contact-card';

      const avatar = document.createElement('div');
      avatar.className = 'contact-avatar';
      const inicialNom = contacto.nombre ? contacto.nombre.trim().charAt(0).toUpperCase() : '?';
      const inicialApe = contacto.apellido ? contacto.apellido.trim().charAt(0).toUpperCase() : '';
      avatar.textContent = inicialNom + inicialApe;

      const info = document.createElement('div');
      info.className = 'contact-info';

      const nombreEl = document.createElement('h3');
      nombreEl.className = 'contact-name';
      nombreEl.textContent = (contacto.nombre || '') + ' ' + (contacto.apellido || '');

      const telEl = document.createElement('a');
      telEl.className = 'contact-phone';
      telEl.href = 'tel:' + (contacto.telefono || '').replace(/\s+/g, '');
      
      const phoneIcon = document.createElement('span');
      phoneIcon.className = 'phone-icon';
      phoneIcon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
      
      const phoneText = document.createTextNode(' ' + (contacto.telefono || 'Sin teléfono'));
      telEl.appendChild(phoneIcon);
      telEl.appendChild(phoneText);

      info.appendChild(nombreEl);
      info.appendChild(telEl);

      card.appendChild(avatar);
      card.appendChild(info);

      fragmento.appendChild(card);
    });

    contactsList.appendChild(fragmento);
  }

  function mostrarCargando(activo) {
    if (activo) {
      loadingIndicator.style.display = 'flex';
      contactsList.style.display = 'none';
      emptyState.style.display = 'none';
    } else {
      loadingIndicator.style.display = 'none';
      contactsList.style.display = 'grid';
    }
  }

  function establecerEstadoBoton(cargando) {
    if (cargando) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `
        <span class="btn-spinner"></span>
        <span>Guardando...</span>
      `;
    } else {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>Agregar Contacto</span>
      `;
    }
  }

  let toastTimeout = null;
  function mostrarToast(mensaje, tipo = 'success') {
    toastMessage.textContent = mensaje;
    toast.className = 'toast-notification show ' + tipo;

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toast.className = 'toast-notification';
    }, 3500);
  }

  inicializar();
});
