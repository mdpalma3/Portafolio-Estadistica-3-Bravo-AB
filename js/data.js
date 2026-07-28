/* =========================================================================
   data.js
   -------------------------------------------------------------------------
   TODO el contenido del portafolio vive en este archivo, en un solo objeto
   global llamado DATOS_PORTAFOLIO. Para personalizar el portafolio (añadir
   una unidad, un documento, una calificación, etc.) solo se necesita editar
   este archivo — no hay que tocar el HTML ni el resto del JavaScript.

   Ver la guía completa de personalización en README.md
   ========================================================================= */

const DATOS_PORTAFOLIO = {

  // ---------------------------------------------------------------------
  // Datos institucionales mostrados en la portada, la barra lateral y el pie
  // ---------------------------------------------------------------------
  institucion: {
    materia: "Estadística para Ciencias Navales",
    docente: "Ing. Margarita Palma, Mgtr.",
    curso: "3.º Bravo / AB",
    institucionNombre: "Escuela Superior Naval",
    periodo: "Periodo Académico 2026",
  },
  // ---------------------------------------------------------------------
  // 1. PLANIFICACIÓN ACADÉMICA
  // Cada objeto es una "carpeta". "archivos" es la lista de documentos o
  // enlaces que contiene. type: "pdf" | "word" | "enlace"
  // ---------------------------------------------------------------------
  planificacion: [
    {
      id: "silabo",
      icono: "fa-file-signature",
      titulo: "Sílabo",
      desc: "Documento oficial de la asignatura: objetivos, contenidos y evaluación.",
      archivos: [
        // "ruta" apunta a un archivo REAL dentro de la carpeta documentos/.
        // Si un archivo no tiene "ruta", el portafolio lo muestra como
        // "pendiente de carga" (ver README.md, sección "Subir archivos reales").
        { nombre: "for_silabo_v3_ESTADISTICA_Jul26_NRC-signed.pdf", tipo: "pdf", tam: "482 KB", fecha: "2026-03-02", ruta: "documentos/planificacion/for_silabo_v3_ESTADISTICA_Jul26_NRC-signed.pdf" },        
      ],
    },
    {
      id: "plan-micro",
      icono: "fa-diagram-project",
      titulo: "Programación académica",
      desc: "Desglose detallado de unidades, horas y estrategias didácticas.",
      archivos: [
        { nombre: "2.2. ESTADISTICA programacion academica 2026 2_NRC 2998 MPALMA-signed.pdf", tipo: "pdf", tam: "482 KB", fecha: "2026-03-02", ruta: "documentos/planificacion/2.2. ESTADISTICA programacion academica 2026 2_NRC 2998 MPALMA-signed.pdf" },
      ],
    },
    {
      id: "cronograma",
      icono: "fa-calendar-days",
      titulo: "Planes de clases ESSUNA",
      desc: "Planificación organizada de las sesiones de clase para el desarrollo efectivo de la asignatura.",
      archivos: [
        { nombre: "Plan de clases EST_UC1_0k.pdf", tipo: "pdf", tam: "66 KB", fecha: "2026-07-24", ruta: "documentos/planificacion/Plan de clases EST_UC1_0k.pdf" },
      ],
    },
    {
      id: "calendario",
      icono: "fa-calendar-check",
      titulo: "Calendario de Actividades",
      desc: "Fechas clave: entregas, exámenes parciales y proyecto final.",
      archivos: [
        { nombre: "Calendario_Actividades.pdf", tipo: "pdf", tam: "150 KB", fecha: "2026-03-05" },
      ],
    },
    {
      id: "resultados-aprendizaje",
      icono: "fa-bullseye",
      titulo: "Resultados de Aprendizaje",
      desc: "Logros esperados al finalizar la asignatura.",
      archivos: [
        { nombre: "Resultados_Aprendizaje.pdf", tipo: "pdf", tam: "120 KB", fecha: "2026-03-02" },
      ],
    },
    {
      id: "competencias",
      icono: "fa-medal",
      titulo: "Competencias",
      desc: "Competencias genéricas y específicas a desarrollar por el cadete.",
      archivos: [
        { nombre: "Matriz_Competencias.docx", tipo: "word", tam: "95 KB", fecha: "2026-03-02" },
      ],
    },
    {
      id: "bibliografia",
      icono: "fa-book",
      titulo: "Bibliografía",
      desc: "Textos base y complementarios de la asignatura.",
      archivos: [
        { nombre: "Bibliografia_APA.pdf", tipo: "pdf", tam: "80 KB", fecha: "2026-03-02" },
        { nombre: "Enlace: Biblioteca Virtual Naval", tipo: "enlace", tam: "—", fecha: "2026-03-02" },
      ],
    },
    {
      id: "recursos-apoyo",
      icono: "fa-life-ring",
      titulo: "Recursos de Apoyo",
      desc: "Material adicional de nivelación y tutorías.",
      archivos: [
        { nombre: "Guia_Nivelacion_Estadistica.pdf", tipo: "pdf", tam: "260 KB", fecha: "2026-03-08" },
      ],
    },
  ],
  // ---------------------------------------------------------------------
  // 2. MATERIAL DIDÁCTICO
  // Cada unidad tiene sub-carpetas fijas: presentaciones, guias, talleres,
  // videos, lecturas, complementario. "recursosAdicionales" es global.
  // ---------------------------------------------------------------------
  unidades: [
    {
      id: "unidad-1",
      numero: 1,
      titulo: "ESTADÍSTICA DESCRIPTIVA Y PROBABILIDAD APLICADAS A LAS CIENCIAS NAVALES",
      resumen: "Organiza, resume e interpreta información proveniente de operaciones navales mediante técnicas de estadística descriptiva y probabilidad para generar indicadores que apoyen la toma de decisiones.",
      carpetas: {
        Presentaciones: [{ nombre: "U1_Introduccion_Estadistica.pdf", tipo: "pdf", tam: "1.2 MB", fecha: "2026-03-09" }],
        Guias: [{ nombre: "U1_Guia_Medidas_Tendencia.docx", tipo: "word", tam: "220 KB", fecha: "2026-03-11" }],
        Talleres: [{ nombre: "U1_Taller_Frecuencias.pdf", tipo: "pdf", tam: "310 KB", fecha: "2026-03-13" }],
        Videos: [{ nombre: "Video: Medidas de tendencia central", tipo: "enlace", tam: "—", fecha: "2026-03-10" }],
        Lecturas: [{ nombre: "U1_Lectura_Aplicaciones_Navales.pdf", tipo: "pdf", tam: "540 KB", fecha: "2026-03-09" }],
        Complementario: [{ nombre: "U1_Ejercicios_Extra.pdf", tipo: "pdf", tam: "180 KB", fecha: "2026-03-14" }],
      },
    },
    {
      id: "unidad-2",
      numero: 2,
      titulo: "MODELOS ESTOCÁSTICOS PARA LA GESTIÓN DE OPERACIONES NAVALES",
      resumen: "Modela fenómenos aleatorios relacionados con operaciones marítimas mediante distribuciones de probabilidad para estimar riesgos y apoyar decisiones operacionales.",
      carpetas: {
        Presentaciones: [{ nombre: "U2_Fundamentos_Probabilidad.pdf", tipo: "pdf", tam: "1.4 MB", fecha: "2026-03-23" }],
        Guias: [{ nombre: "U2_Guia_Eventos_Independientes.docx", tipo: "word", tam: "200 KB", fecha: "2026-03-25" }],
        Talleres: [{ nombre: "U2_Taller_Probabilidad_Condicional.pdf", tipo: "pdf", tam: "290 KB", fecha: "2026-03-27" }],
        Videos: [{ nombre: "Video: Teorema de Bayes en navegación", tipo: "enlace", tam: "—", fecha: "2026-03-24" }],
        Lecturas: [{ nombre: "U2_Lectura_Riesgo_Maritimo.pdf", tipo: "pdf", tam: "480 KB", fecha: "2026-03-23" }],
        Complementario: [],
      },
    },
    {
      id: "unidad-3",
      numero: 3,
      titulo: "INFERENCIA ESTADÍSTICA Y MODELOS DE REGRESIÓN PARA LA TOMA DE DECISIONES NAVALES",
      resumen: "Aplica técnicas de inferencia estadística y modelos de regresión lineal para analizar datos y sustentar decisiones estratégicas y operacionales en el ámbito naval.",
      carpetas: {
        Presentaciones: [{ nombre: "U3_Distribuciones.pdf", tipo: "pdf", tam: "1.6 MB", fecha: "2026-04-06" }],
        Guias: [{ nombre: "U3_Guia_Distribucion_Normal.docx", tipo: "word", tam: "250 KB", fecha: "2026-04-08" }],
        Talleres: [{ nombre: "U3_Taller_Binomial_Poisson.pdf", tipo: "pdf", tam: "300 KB", fecha: "2026-04-10" }],
        Videos: [],
        Lecturas: [{ nombre: "U3_Lectura_Control_Calidad.pdf", tipo: "pdf", tam: "410 KB", fecha: "2026-04-06" }],
        Complementario: [{ nombre: "U3_Tablas_Estadisticas.pdf", tipo: "pdf", tam: "120 KB", fecha: "2026-04-06" }],
      },
    },
   },
  ],

  recursosAdicionales: [
    { nombre: "Simulador de distribuciones", icono: "fa-shuffle", tipo: "enlace", categoria: "Simuladores" },
    { nombre: "Calculadora estadística en línea", icono: "fa-calculator", tipo: "enlace", categoria: "Calculadoras" },
    { nombre: "Statistics for Naval Sciences (E-book)", icono: "fa-book-open", tipo: "enlace", categoria: "Libros" },
    { nombre: "Artículo: Estadística aplicada a logística naval", icono: "fa-file-lines", tipo: "enlace", categoria: "Artículos científicos" },
    { nombre: "Base de datos meteorológicos marítimos", icono: "fa-database", tipo: "enlace", categoria: "Bases de datos" },
    { nombre: "R / RStudio", icono: "fa-chart-simple", tipo: "enlace", categoria: "Software estadístico" },
    { nombre: "Portal INEC — Estadísticas nacionales", icono: "fa-link", tipo: "enlace", categoria: "Enlaces de interés" },
  ],

  // ---------------------------------------------------------------------
  // 3. PLAN DE MEJORAS
  // "estudiantes" alimenta tanto este módulo como el de Calificaciones.
  // ---------------------------------------------------------------------
  planMejoras: {
    diagnosticoInicial: "La prueba diagnóstica inicial evidenció un manejo adecuado de operaciones básicas, pero debilidades generalizadas en la lectura e interpretación de gráficos estadísticos y en el cálculo de medidas de dispersión.",
    dificultadesDetectadas: [
      "Confusión entre varianza y desviación estándar.",
      "Dificultad para interpretar resultados de pruebas de hipótesis en contexto real.",
      "Poca familiaridad con software estadístico (Excel avanzado / R).",
    ],
    accionesMejora: [
      "Talleres de nivelación los días viernes en horario de tutoría.",
      "Uso de simuladores interactivos para visualizar distribuciones.",
      "Rúbricas de retroalimentación detallada en cada entrega.",
    ],
    lineaTiempo: [
      { fecha: "2026-03-08", titulo: "Diagnóstico inicial aplicado", desc: "Se aplicó la prueba diagnóstica a los 24 cadetes del curso 3.º Bravo/AB." },
      { fecha: "2026-03-22", titulo: "Primer taller de nivelación", desc: "Refuerzo en medidas de tendencia central y dispersión." },
      { fecha: "2026-04-12", titulo: "Retroalimentación grupal", desc: "Revisión de resultados del primer parcial y plan de acción individual." },
      { fecha: "2026-05-03", titulo: "Segundo corte de seguimiento", desc: "Verificación de mejoras tras la implementación de tutorías." },
      { fecha: "2026-05-24", titulo: "Evaluación de cierre de unidad", desc: "Medición del progreso alcanzado frente al diagnóstico inicial." },
    ],
    observacionesDocente: "El grupo muestra una tendencia de mejora sostenida desde la segunda semana de abril, especialmente en la interpretación gráfica de datos.",
  },

  // ---------------------------------------------------------------------
  // 4. CALIFICACIONES
  // Cada estudiante tiene sus notas por rubro (escala 0-10) y comentarios.
  // ---------------------------------------------------------------------
  estudiantes: [
    { nombre: "Aguirre Torres, Bryan",  actividades: 8.5, talleres: 9.0, foros: 8.0, deberes: 9.2, examenes: 8.0, proyecto: 8.8, obs: "Buen desempeño constante." },
    { nombre: "Cevallos Ruiz, Doménica", actividades: 9.4, talleres: 9.6, foros: 9.0, deberes: 9.5, examenes: 9.2, proyecto: 9.6, obs: "Excelente rendimiento general." },
    { nombre: "Chalá Mina, Erick",       actividades: 6.8, talleres: 7.0, foros: 6.5, deberes: 7.2, examenes: 6.0, proyecto: 7.0, obs: "Requiere refuerzo en inferencia." },
    { nombre: "Espinoza Vera, Lucía",    actividades: 8.0, talleres: 8.2, foros: 7.8, deberes: 8.5, examenes: 7.6, proyecto: 8.3, obs: "Progreso notable en el 2.º parcial." },
    { nombre: "Freire Ponce, Mateo",     actividades: 7.2, talleres: 7.5, foros: 7.0, deberes: 7.8, examenes: 6.8, proyecto: 7.4, obs: "Asiste a tutorías de nivelación." },
    { nombre: "Guamán Salazar, Ariana",  actividades: 9.1, talleres: 8.8, foros: 9.0, deberes: 9.0, examenes: 8.7, proyecto: 9.0, obs: "Muy participativa en talleres." },
    { nombre: "Herrera Loor, Kevin",     actividades: 5.9, talleres: 6.2, foros: 6.0, deberes: 6.5, examenes: 5.5, proyecto: 6.3, obs: "En seguimiento por Plan de Mejoras." },
    { nombre: "Játiva Correa, Nicole",   actividades: 8.7, talleres: 8.9, foros: 8.4, deberes: 9.0, examenes: 8.3, proyecto: 8.9, obs: "Consistente en entregas." },
  ],
};

/* Lista de columnas de notas usada por el módulo de Calificaciones */
const RUBROS_CALIFICACION = [
  { clave: "actividades", etiqueta: "Actividades" },
  { clave: "talleres", etiqueta: "Talleres" },
  { clave: "foros", etiqueta: "Foros" },
  { clave: "deberes", etiqueta: "Deberes" },
  { clave: "examenes", etiqueta: "Exámenes" },
  { clave: "proyecto", etiqueta: "Proyecto Final" },
];
