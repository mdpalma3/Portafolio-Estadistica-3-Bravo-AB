# Portafolio Virtual — Estadística para Ciencias Navales

Portafolio académico digital, responsivo, con modo claro/oscuro, buscador interno,
gráficos automáticos y sistema de carga de archivos (simulado en el navegador).

## 1. Cómo abrirlo

Solo abre `index.html` con doble clic (funciona sin instalar nada). Para mejor
compatibilidad con la carga de archivos, puedes servirlo con un mini servidor local:

```bash
# Con Python instalado, dentro de la carpeta del proyecto:
python3 -m http.server 8000
# luego abre http://localhost:8000 en el navegador
```

## 2. Estructura del proyecto

```
portafolio/
├── index.html          → Portada + estructura del dashboard (HTML)
├── css/
│   └── style.css       → Todo el diseño visual (colores, tipografía, layout)
├── js/
│   ├── data.js          → TODO el contenido editable (ver sección 3)
│   └── app.js            → Lógica: navegación, gráficos, carga de archivos
└── README.md            → Esta guía
```

## 3. Cómo personalizar el contenido (lo más importante)

Todo el contenido del portafolio (sílabo, unidades, calificaciones, etc.) vive
en **`js/data.js`**, dentro del objeto `DATOS_PORTAFOLIO`. No es necesario tocar
el HTML ni el resto del JavaScript para actualizar la información.

### Cambiar los datos institucionales (portada, sidebar, pie de página)
```js
institucion: {
  materia: "Estadística para Ciencias Navales",
  docente: "Ing. Margarita Palma, Mgtr.",
  curso: "3.º Bravo / AB",
  institucionNombre: "Escuela Superior Naval",
  periodo: "Periodo Académico 2026",
},
```

### Añadir un documento a Planificación Académica
Busca el bloque `planificacion` y agrega un objeto dentro de `archivos` de la
carpeta correspondiente (o crea una carpeta nueva copiando la estructura):
```js
{ nombre: "Nuevo_Documento.pdf", tipo: "pdf", tam: "300 KB", fecha: "2026-06-01" }
```
`tipo` acepta: `"pdf"`, `"word"` o `"enlace"`.

### Añadir una nueva Unidad en Material Didáctico
Copia un bloque completo dentro del arreglo `unidades` y cambia sus valores:
```js
{
  id: "unidad-5",
  numero: 5,
  titulo: "Nombre de la unidad",
  resumen: "Breve descripción de la unidad.",
  carpetas: {
    presentaciones: [], guias: [], talleres: [], videos: [], lecturas: [], complementario: [],
  },
},
```
La pestaña "Unidad 5" aparecerá automáticamente en el módulo de Material Didáctico.

### Añadir un recurso adicional (simuladores, calculadoras, libros, etc.)
Agrega un objeto en `recursosAdicionales`:
```js
{ nombre: "Nombre del recurso", icono: "fa-link", tipo: "enlace", categoria: "Enlaces de interés" }
```
El campo `icono` usa nombres de [Font Awesome](https://fontawesome.com/icons) (sin el prefijo `fa-solid`).

### Editar el Plan de Mejoras
Modifica el objeto `planMejoras`: `diagnosticoInicial`, `dificultadesDetectadas`
(lista), `accionesMejora` (lista), `lineaTiempo` (lista de eventos con `fecha`,
`titulo`, `desc`) y `observacionesDocente`.

### Añadir o editar estudiantes y calificaciones
Agrega o edita objetos dentro de `estudiantes` (escala de notas 0 a 10):
```js
{ nombre: "Apellido Apellido, Nombre", actividades: 8.5, talleres: 9.0, foros: 8.0,
  deberes: 9.2, examenes: 8.0, proyecto: 8.8, obs: "Comentario del docente." },
```
Los promedios, la tabla y los 4 gráficos (promedio general, rendimiento por
actividad, distribución de notas, evolución del curso) se recalculan
automáticamente — no requieren edición adicional.

Si quieres cambiar los rubros de evaluación (columnas de la tabla), edita el
arreglo `RUBROS_CALIFICACION` al final de `data.js` y añade el campo
correspondiente a cada estudiante.

## 4. Personalizar colores y tipografía

Todos los colores y fuentes están centralizados como variables CSS al inicio
de `css/style.css`, dentro de `:root`:

```css
--azul-marino: #0B2545;   /* color primario */
--dorado: #C9A227;        /* color de acento */
--blanco-niebla: #F6F8FB; /* fondo modo claro */
```

Cambia estos valores y el color se actualiza en todo el sitio automáticamente.
Las fuentes (`--fuente-display`, `--fuente-cuerpo`, `--fuente-datos`) se pueden
cambiar por cualquier fuente de [Google Fonts](https://fonts.google.com),
actualizando también el `<link>` correspondiente en `index.html`.

## 5. Carga y descarga de archivos (REALES, no simuladas)

El portafolio soporta descargas y vistas previas 100% reales de dos formas:

### A) Documentos que sube el docente (persisten para todos los estudiantes)

1. Coloca el archivo real dentro de la carpeta `documentos/`, organizado como
   prefieras, por ejemplo:
   ```
   documentos/
   ├── planificacion/Silabo_EstadisticaNaval_2026.pdf
   ├── unidad-1/U1_Guia_Medidas_Tendencia.docx
   └── mejoras/Informe_Seguimiento.pdf
   ```
2. En `js/data.js`, añade el campo **`ruta`** a ese documento, apuntando a la
   ubicación del archivo (ruta relativa desde `index.html`):
   ```js
   { nombre: "Silabo_EstadisticaNaval_2026.pdf", tipo: "pdf", tam: "482 KB",
     fecha: "2026-03-02", ruta: "documentos/planificacion/Silabo_EstadisticaNaval_2026.pdf" },
   ```
3. Guarda y recarga. Ese documento ahora:
   - Se puede **previsualizar de verdad** (los PDF se abren en un visor
     incrustado dentro del modal).
   - Se puede **descargar de verdad** con el botón de descarga.
   - Estará disponible para **todos** los que abran el portafolio (ya sea
     localmente o publicado en internet — ver la sección de "cómo
     compartirlo").

Ya incluimos un ejemplo funcional: el "Sílabo" en Planificación Académica
apunta a un PDF real dentro de `documentos/planificacion/` — ábrelo para ver
cómo se comporta un archivo real frente a uno sin `ruta` (que se muestra como
**"Pendiente de carga"**, con los botones de descarga atenuados).

> Si un documento en `data.js` **no** tiene el campo `ruta`, el portafolio lo
> trata como un marcador de posición y lo marca como "Pendiente de carga" —
> así sabes de un vistazo qué archivos te faltan por subir.

### B) Archivos que arrastras/seleccionas tú mismo (zona de carga interactiva)

Al arrastrar un archivo a cualquier "Zona de carga" (Planificación, Unidades,
Plan de Mejoras), el archivo se lee directamente desde tu computadora y se
generan una vista previa y una descarga **reales** para esa sesión del
navegador (funciona igual de bien, sin necesidad de subir nada a ningún
servidor). La única limitación: como es un sitio estático sin backend, ese
archivo vive en la memoria de tu navegador — si cierras o recargas la
pestaña, desaparece, y no lo verán otros estudiantes. Para que un archivo sea
visible para todos de forma permanente, usa la opción (A).

### C) Si necesitas que los propios estudiantes suban tareas de forma permanente

Eso ya requiere un backend o servicio en la nube (por ejemplo, un formulario
de Google Forms enlazado a Google Drive, Firebase Storage, o Supabase). El
frontend actual puede conectarse a cualquiera de esos servicios: el punto de
entrada es la función `manejarArchivosNuevos()` en `js/app.js`, donde se
podría reemplazar `URL.createObjectURL(f)` por una llamada real de subida
(`fetch` a tu backend o SDK del servicio elegido).

## 6. Tecnologías utilizadas

- HTML5 semántico
- CSS3 (variables, grid, flexbox, animaciones)
- JavaScript (ES6, sin frameworks — fácil de mantener)
- Chart.js (gráficos)
- Font Awesome 6 (iconografía)
- Google Fonts: Playfair Display, Inter, JetBrains Mono
