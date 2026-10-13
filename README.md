# Tarea 3: Agenda Multicapas

Aplicación web desarrollada para la materia **Programación Web** en el **Instituto Tecnológico de Las Américas (ITLA)**, aplicando el patrón de **Arquitectura Multicapas** y consumo de servicios REST mediante `fetch`.

---

## 👤 Información del Estudiante

- **Nombre:** Sebastian Peguero
- **Matrícula:** 20251172
- **Asignatura:** Programación Web
- **Profesor:** Raydelto Hernández
- **Asignación:** Tarea 3 - Agenda Multicapas (8 puntos)

---

## 🏛️ Arquitectura de la Solución (Multicapas)

La aplicación implementa una separación estricta de responsabilidades en diferentes capas lógicas para garantizar desacoplamiento, mantenibilidad y legibilidad del código:

```
┌──────────────────────────────────────────────────────────────────┐
│  1. Capa de Presentación (UI)                                    │
│     - index.html                                                 │
│     - css/styles.css                                             │
│     - js/app.js (Control de eventos del DOM y renderizado)       │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│  2. Capa de Lógica de Negocio                                    │
│     - js/controllers/AgendaController.js                         │
│     (Validaciones, reglas de negocio, sanitización y filtrado)   │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│  3. Capa de Acceso a Datos (Servicio API)                        │
│     - js/services/AgendaService.js                               │
│     (Peticiones HTTP GET y POST con fetch, serialización JSON)   │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│  4. Capa de Modelo / Entidad                                     │
│     - js/models/Contacto.js                                      │
│     (Estructura y encapsulación del contacto: nombre, apellido,  │
│      teléfono)                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Descripción de Cada Capa:

1. **Capa de Modelo (`js/models/Contacto.js`):**
   - Define la entidad `Contacto` con las propiedades requeridas: `nombre`, `apellido` y `telefono`.

2. **Capa de Acceso a Datos (`js/services/AgendaService.js`):**
   - Encapsula exclusivamente las comunicaciones remotas con el API REST.
   - Utiliza la función nativa `fetch` con los métodos HTTP `GET` (obtener contactos) y `POST` (agregar nuevo contacto enviando `Content-Type: application/json`).
   - Implementa control de errores y compatibilidad de protocolos.

3. **Capa de Lógica de Negocio (`js/controllers/AgendaController.js`):**
   - Valida que todos los campos sean suministrados de manera correcta sin cadenas vacías o espacios sobrantes (`trim()`).
   - Coordina la carga de datos y provee filtrado reactivo de búsqueda en memoria.

4. **Capa de Presentación (`index.html`, `css/styles.css`, `js/app.js`):**
   - **HTML5:** Maquetación semántica sin atributos obsoletos (evitando `type="text/javascript"`).
   - **CSS3:** Estilos organizados dentro de la carpeta `css/` conforme a los estándares de la industria.
   - **JavaScript (`app.js`):** Escucha eventos de usuario, muestra estados de carga (*spinner*), notificaciones toast dinámicas y renderiza la lista de contactos.

---

## 🌐 Endpoint del Servicio Web

- **URL:** `http://www.raydelto.org/agenda.php`
- **Método GET:** Devuelve un arreglo JSON con todos los contactos registrados.
- **Método POST:** Recibe un cuerpo JSON con `{ "nombre": "...", "apellido": "...", "telefono": "..." }` para almacenar un nuevo registro.

---

## 📁 Estructura del Proyecto

```text
AgendaMulticapasPWEB-3/
├── index.html                  # Maquetación semántica de la interfaz
├── README.md                   # Documentación técnica del proyecto
├── .gitignore                  # Exclusión de archivos de sistema
├── css/
│   └── styles.css              # Estilos CSS3 modernos y responsivos
└── js/
    ├── app.js                  # Orquestador de la capa de presentación
    ├── models/
    │   └── Contacto.js         # Capa de modelo
    ├── services/
    │   └── AgendaService.js    # Capa de acceso a datos (fetch GET / POST)
    └── controllers/
        └── AgendaController.js # Capa de controladores y lógica de negocio
```

---

## 🚀 Despliegue y Ejecución

1. **En línea:**
   - [Enlace a GitHub Pages](https://sebaspeguero.github.io/AgendaMulticapasPWEB-3/)
2. **Localmente:**
   - Clone el repositorio:
     ```bash
     git clone https://github.com/SebasPeguero/AgendaMulticapasPWEB-3.git
     ```
   - Abra el archivo `index.html` en cualquier navegador web moderno.
