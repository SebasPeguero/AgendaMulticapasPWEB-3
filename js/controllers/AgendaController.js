class AgendaController {
  constructor(agendaService) {
    this.service = agendaService;
    this.listaContactos = [];
  }

  async cargarContactos() {
    this.listaContactos = await this.service.obtenerContactos();
    return this.listaContactos;
  }

  async agregarContacto(nombre, apellido, telefono) {
    const nom = nombre ? nombre.trim() : '';
    const ape = apellido ? apellido.trim() : '';
    const tel = telefono ? telefono.trim() : '';

    if (!nom) {
      throw new Error('El campo "Nombre" es obligatorio.');
    }
    if (!ape) {
      throw new Error('El campo "Apellido" es obligatorio.');
    }
    if (!tel) {
      throw new Error('El campo "Teléfono" es obligatorio.');
    }

    const nuevoContacto = new Contacto(nom, ape, tel);
    await this.service.guardarContacto(nuevoContacto);
    return nuevoContacto;
  }

  filtrarContactos(termino) {
    if (!termino || !termino.trim()) {
      return this.listaContactos;
    }

    const filtro = termino.toLowerCase().trim();
    return this.listaContactos.filter(item => {
      const n = (item.nombre || '').toLowerCase();
      const a = (item.apellido || '').toLowerCase();
      const t = (item.telefono || '').toLowerCase();
      return n.includes(filtro) || a.includes(filtro) || t.includes(filtro);
    });
  }
}
