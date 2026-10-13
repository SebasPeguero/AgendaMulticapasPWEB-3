class AgendaService {
  constructor() {
    this.primaryUrl = 'https://www.raydelto.org/agenda.php';
    this.fallbackUrl = 'http://www.raydelto.org/agenda.php';
  }

  async obtenerContactos() {
    try {
      const response = await fetch(this.primaryUrl);
      if (!response.ok) {
        throw new Error('Respuesta inválida del servidor: ' + response.status);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      try {
        const fallbackRes = await fetch(this.fallbackUrl);
        if (!fallbackRes.ok) {
          throw new Error('Respuesta inválida en fallback: ' + fallbackRes.status);
        }
        const fallbackData = await fallbackRes.json();
        return Array.isArray(fallbackData) ? fallbackData : [];
      } catch (fallbackError) {
        throw new Error('No fue posible conectar con el servidor de la agenda.');
      }
    }
  }

  async guardarContacto(contacto) {
    const targetUrl = window.location.protocol === 'https:' ? this.primaryUrl : this.fallbackUrl;
    
    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        body: JSON.stringify({
          nombre: contacto.nombre,
          apellido: contacto.apellido,
          telefono: contacto.telefono
        })
      });

      if (!response.ok) {
        throw new Error('Error al registrar el contacto en el servidor: ' + response.status);
      }

      return true;
    } catch (error) {
      try {
        const fallbackRes = await fetch(this.primaryUrl, {
          method: 'POST',
          body: JSON.stringify({
            nombre: contacto.nombre,
            apellido: contacto.apellido,
            telefono: contacto.telefono
          })
        });
        if (!fallbackRes.ok) {
          throw new Error('Fallo al registrar en servidor.');
        }
        return true;
      } catch (secondaryError) {
        throw new Error('No se pudo guardar el contacto. Compruebe su conexión.');
      }
    }
  }
}
