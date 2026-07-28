/* =========================================================================
   app.js — Lógica de la aplicación del Portafolio Virtual
   -------------------------------------------------------------------------
   Índice:
     1. Utilidades generales
     2. Portada -> Dashboard
     3. Tema claro / oscuro
     4. Navegación lateral, breadcrumbs, buscador
     5. Render de cada módulo (Planificación, Material, Plan de Mejoras, Calif.)
     6. Zona de carga de archivos (simulada, en memoria)
     7. Modal de vista previa
     8. Gráficos (Chart.js)
     9. Inicialización
   ========================================================================= */

/* ---------------------------- 1. Utilidades ---------------------------- */

const iconoPorTipo = (tipo) => {
  if (tipo === "pdf") return "fa-file-pdf";
  if (tipo === "word") return "fa-file-word";
  if (tipo === "enlace") return "fa-link";
  return "fa-file";
};

const formatearFecha = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
};

const claseNota = (n) => (n >= 8 ? "nota-alta" : n >= 7 ? "nota-media" : "nota-baja");

const promedioEstudiante = (est) => {
  const vals = RUBROS_CALIFICACION.map((r) => est[r.clave]);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
};

/* Archivos añadidos manualmente por el usuario en esta sesión (en memoria) */
const archivosSubidosPorZona = {};

/* --------------------- 2. Portada -> Dashboard -------------------------- */

function ingresarAlPortafolio() {
  document.getElementById("portada").style.display = "none";
  const shell = document.getElementById("app-shell");
  shell.classList.add("activo");
  navegarA("inicio");
}

/* ------------------------- 3. Tema claro/oscuro ------------------------- */

function alternarTema() {
  const raiz = document.documentElement;
  const actual = raiz.getAttribute("data-tema") === "oscuro" ? "claro" : "oscuro";
  raiz.setAttribute("data-tema", actual === "oscuro" ? "oscuro" : "");
  const icono = document.getElementById("icono-tema");
  icono.className = actual === "oscuro" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

/* ------------------- 4. Navegación / breadcrumbs / buscador ------------- */

const TITULOS_SECCION = {
  inicio: { titulo: "Panel General", icono: "fa-gauge-high", desc: "Resumen general del curso 3.º Bravo/AB." },
  planificacion: { titulo: "Planificación Académica", icono: "fa-clipboard-list", desc: "Documentos de organización curricular de la asignatura." },
  material: { titulo: "Material Didáctico", icono: "fa-layer-group", desc: "Contenido de las 3 unidades y recursos adicionales." },
  mejoras: { titulo: "Plan de Mejoras", icono: "fa-chart-line", desc: "Seguimiento al desempeño académico y acciones de refuerzo." },
  calificaciones: { titulo: "Calificaciones", icono: "fa-table-list", desc: "Registro de notas y desempeño del curso." },
};

let seccionActual = "inicio";
let unidadActiva = "unidad-1";

function navegarA(seccion, opts = {}) {
  seccionActual = seccion;
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.toggle("activo", el.dataset.seccion === seccion);
  });

  const info = TITULOS_SECCION[seccion];
  document.getElementById("crumb-actual").textContent = info.titulo;

  const main = document.getElementById("area-principal");
  main.innerHTML = "";
  main.appendChild(construirEncabezado(info));

  const renderers = {
    inicio: renderInicio,
    planificacion: renderPlanificacion,
    material: renderMaterial,
    mejoras: renderMejoras,
    calificaciones: renderCalificaciones,
  };
  main.appendChild(renderers[seccion](opts));

  // cerrar sidebar en móvil tras navegar
  document.getElementById("sidebar").classList.remove("movil-visible");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function construirEncabezado({ titulo, icono, desc }) {
  const div = document.createElement("div");
  div.className = "encabezado-seccion";
  div.innerHTML = `
    <div>
      <h2><i class="fa-solid ${icono}"></i> ${titulo}</h2>
      <p>${desc}</p>
    </div>
  `;
  return div;
}

function manejarBusqueda(valor) {
  const q = valor.trim().toLowerCase();
  if (!q) return;
  // Búsqueda simple sobre nombres de archivo en todo el portafolio
  const resultados = [];
  DATOS_PORTAFOLIO.planificacion.forEach((c) =>
    c.archivos.forEach((a) => a.nombre.toLowerCase().includes(q) && resultados.push({ ...a, origen: `Planificación / ${c.titulo}` }))
  );
  DATOS_PORTAFOLIO.unidades.forEach((u) =>
    Object.entries(u.carpetas).forEach(([carpeta, archivos]) =>
      archivos.forEach((a) => a.nombre.toLowerCase().includes(q) && resultados.push({ ...a, origen: `${u.titulo} / ${carpeta}` }))
    )
  );
  mostrarResultadosBusqueda(q, resultados);
}

function mostrarResultadosBusqueda(q, resultados) {
  const main = document.getElementById("area-principal");
  main.innerHTML = "";
  main.appendChild(construirEncabezado({ titulo: `Resultados para "${q}"`, icono: "fa-magnifying-glass", desc: `${resultados.length} documento(s) encontrado(s) en el portafolio.` }));
  const cont = document.createElement("div");
  if (resultados.length === 0) {
    cont.innerHTML = `<div class="texto-vacio"><i class="fa-solid fa-folder-open"></i>No se encontraron documentos que coincidan con la búsqueda.</div>`;
  } else {
    cont.className = "lista-archivos";
    cont.innerHTML = resultados
      .map(
        (r) => `
      <div class="item-archivo">
        <i class="fa-solid ${iconoPorTipo(r.tipo)} tipo"></i>
        <div class="nombre-archivo">${r.nombre}<br><small style="color:var(--texto-suave)">${r.origen}</small></div>
        <span class="tam">${r.tam}</span>
        <button title="Vista previa" onclick='abrirVistaPrevia(${JSON.stringify(r.nombre)}, ${JSON.stringify(r.tipo)})'><i class="fa-solid fa-eye"></i></button>
      </div>`
      )
      .join("");
  }
  main.appendChild(cont);
  document.getElementById("crumb-actual").textContent = "Búsqueda";
}

/* --------------------------- 5a. Panel Inicio ---------------------------- */

function renderInicio() {
  const frag = document.createDocumentFragment();

  const promedios = DATOS_PORTAFOLIO.estudiantes.map(promedioEstudiante);
  const promedioGeneral = (promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(1);
  const totalDocs =
    DATOS_PORTAFOLIO.planificacion.reduce((a, c) => a + c.archivos.length, 0) +
    DATOS_PORTAFOLIO.unidades.reduce((a, u) => a + Object.values(u.carpetas).flat().length, 0);

  const kpis = document.createElement("div");
  kpis.className = "kpis";
  kpis.innerHTML = `
    ${kpiHTML("fa-user-graduate", DATOS_PORTAFOLIO.estudiantes.length, "Cadetes matriculados", null)}
    ${kpiHTML("fa-star", promedioGeneral, "Promedio general del curso", promedioGeneral >= 7.5 ? "arriba" : "abajo")}
    ${kpiHTML("fa-folder-open", totalDocs, "Documentos publicados", null)}
    ${kpiHTML("fa-layer-group", "4", "Unidades activas", null)}
  `;
  frag.appendChild(kpis);

  const paneles = document.createElement("div");
  paneles.className = "paneles-graficos";
  paneles.innerHTML = `
    <div class="panel-grafico">
      <h4>Rendimiento por actividad</h4>
      <span class="sub">Promedio del curso por rubro de evaluación</span>
      <canvas id="grafico-inicio-actividad"></canvas>
    </div>
    <div class="panel-grafico">
      <h4>Distribución de notas</h4>
      <span class="sub">Cadetes por rango de promedio final</span>
      <canvas id="grafico-inicio-distribucion"></canvas>
    </div>
  `;
  frag.appendChild(paneles);

  const accesos = document.createElement("div");
  accesos.innerHTML = `<h3 style="font-family:var(--fuente-cuerpo);font-size:15px;margin:6px 0 14px;">Accesos rápidos</h3>`;
  const rejilla = document.createElement("div");
  rejilla.className = "rejilla-tarjetas";
  rejilla.innerHTML = `
    ${accesoRapidoHTML("planificacion", "fa-clipboard-list", "Planificación Académica", "Sílabo, cronograma y competencias.")}
    ${accesoRapidoHTML("material", "fa-layer-group", "Material Didáctico", "Contenido de las 3 unidades del curso.")}
    ${accesoRapidoHTML("mejoras", "fa-chart-line", "Plan de Mejoras", "Diagnóstico, seguimiento y evidencias.")}
    ${accesoRapidoHTML("calificaciones", "fa-table-list", "Calificaciones", "Notas, promedios y evolución del curso.")}
  `;
  accesos.appendChild(rejilla);
  frag.appendChild(accesos);

  // Pintar gráficos tras insertar el DOM
  setTimeout(() => {
    graficoRendimientoActividad("grafico-inicio-actividad");
    graficoDistribucionNotas("grafico-inicio-distribucion");
  }, 0);

  return frag;
}

function kpiHTML(icono, valor, etiqueta, tendencia) {
  const tendenciaHTML =
    tendencia === "arriba"
      ? `<div class="kpi-tendencia tendencia-arriba"><i class="fa-solid fa-arrow-trend-up"></i> Sobre el objetivo</div>`
      : tendencia === "abajo"
      ? `<div class="kpi-tendencia tendencia-abajo"><i class="fa-solid fa-arrow-trend-down"></i> Bajo el objetivo</div>`
      : "";
  return `
    <div class="kpi">
      <div class="kpi-top"><span class="kpi-etiqueta" style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;">General</span><i class="fa-solid ${icono} kpi-icono"></i></div>
      <div class="kpi-valor">${valor}</div>
      <div class="kpi-etiqueta">${etiqueta}</div>
      ${tendenciaHTML}
    </div>`;
}

function accesoRapidoHTML(seccion, icono, titulo, desc) {
  return `
    <div class="tarjeta" onclick="navegarA('${seccion}')">
      <div class="icono-tarjeta"><i class="fa-solid ${icono}"></i></div>
      <h3>${titulo}</h3>
      <p class="desc">${desc}</p>
      <div class="meta-tarjeta"><span>Ir al módulo</span><i class="fa-solid fa-arrow-right"></i></div>
    </div>`;
}

/* ----------------------- 5b. Planificación Académica ---------------------- */

function renderPlanificacion() {
  const frag = document.createDocumentFragment();
  const rejilla = document.createElement("div");
  rejilla.className = "rejilla-tarjetas";
  rejilla.innerHTML = DATOS_PORTAFOLIO.planificacion
    .map(
      (c) => `
    <div class="tarjeta" onclick="abrirCarpeta('planificacion', '${c.id}')">
      <div class="icono-tarjeta"><i class="fa-solid ${c.icono}"></i></div>
      <h3>${c.titulo}</h3>
      <p class="desc">${c.desc}</p>
      <div class="meta-tarjeta">
        <span><i class="fa-regular fa-folder"></i> ${c.archivos.length} archivo(s)</span>
        <span class="badge badge-azul">Ver</span>
      </div>
    </div>`
    )
    .join("");
  frag.appendChild(rejilla);
  return frag;
}

function abrirCarpeta(origen, carpetaId) {
  const carpeta = DATOS_PORTAFOLIO.planificacion.find((c) => c.id === carpetaId);
  const main = document.getElementById("area-principal");
  main.innerHTML = "";
  main.appendChild(
    construirEncabezado({ titulo: carpeta.titulo, icono: carpeta.icono, desc: carpeta.desc })
  );

  const volver = botonVolver(() => navegarA("planificacion"));
  main.appendChild(volver);

  main.appendChild(bloqueListaYCarga(carpeta.archivos, `plan-${carpeta.id}`));
  document.getElementById("crumb-actual").textContent = `Planificación / ${carpeta.titulo}`;
}

function botonVolver(cb) {
  const btn = document.createElement("button");
  btn.className = "btn btn-fantasma";
  btn.style.marginBottom = "18px";
  btn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Volver`;
  btn.onclick = cb;
  return btn;
}

/* -------------------------- 5c. Material Didáctico ------------------------ */

const SUBCARPETAS = [
  { clave: "presentaciones", etiqueta: "Presentaciones", icono: "fa-display" },
  { clave: "guias", etiqueta: "Guías", icono: "fa-map" },
  { clave: "talleres", etiqueta: "Talleres", icono: "fa-pen-ruler" },
  { clave: "videos", etiqueta: "Videos", icono: "fa-circle-play" },
  { clave: "lecturas", etiqueta: "Lecturas", icono: "fa-book-open-reader" },
  { clave: "complementario", etiqueta: "Material complementario", icono: "fa-layer-group" },
];

function renderMaterial() {
  const frag = document.createDocumentFragment();

  const tabs = document.createElement("div");
  tabs.className = "tabs";
  tabs.id = "tabs-material";
  tabs.innerHTML =
    DATOS_PORTAFOLIO.unidades
      .map((u) => `<button class="tab-btn ${u.id === unidadActiva ? "activo" : ""}" data-unidad="${u.id}">Unidad ${u.numero}</button>`)
      .join("") + `<button class="tab-btn ${unidadActiva === "adicionales" ? "activo" : ""}" data-unidad="adicionales">Recursos adicionales</button>`;
  frag.appendChild(tabs);

  const cuerpo = document.createElement("div");
  cuerpo.id = "cuerpo-material";
  frag.appendChild(cuerpo);

  setTimeout(() => {
    document.querySelectorAll("#tabs-material .tab-btn").forEach((b) =>
      b.addEventListener("click", () => {
        unidadActiva = b.dataset.unidad;
        document.querySelectorAll("#tabs-material .tab-btn").forEach((x) => x.classList.remove("activo"));
        b.classList.add("activo");
        pintarCuerpoMaterial();
      })
    );
    pintarCuerpoMaterial();
  }, 0);

  return frag;
}

function pintarCuerpoMaterial() {
  const cuerpo = document.getElementById("cuerpo-material");
  if (!cuerpo) return;

  if (unidadActiva === "adicionales") {
    document.getElementById("crumb-actual").textContent = "Material Didáctico / Recursos adicionales";
    const categorias = [...new Set(DATOS_PORTAFOLIO.recursosAdicionales.map((r) => r.categoria))];
    cuerpo.innerHTML = categorias
      .map(
        (cat) => `
      <h4 style="font-family:var(--fuente-cuerpo);font-size:13.5px;color:var(--texto-suave);margin:20px 0 10px;text-transform:uppercase;letter-spacing:.5px;">${cat}</h4>
      <div class="rejilla-tarjetas">
        ${DATOS_PORTAFOLIO.recursosAdicionales
          .filter((r) => r.categoria === cat)
          .map(
            (r) => `
          <div class="tarjeta" onclick="abrirVistaPrevia('${r.nombre.replace(/'/g, "\\'")}', 'enlace')">
            <div class="icono-tarjeta"><i class="fa-solid ${r.icono}"></i></div>
            <h3 style="font-size:14px;">${r.nombre}</h3>
            <div class="meta-tarjeta"><span class="badge badge-azul">Enlace</span><i class="fa-solid fa-up-right-from-square"></i></div>
          </div>`
          )
          .join("")}
      </div>`
      )
      .join("");
    return;
  }

  const u = DATOS_PORTAFOLIO.unidades.find((x) => x.id === unidadActiva);
  document.getElementById("crumb-actual").textContent = `Material Didáctico / Unidad ${u.numero}`;
  const resumen = document.createElement("div");
  cuerpo.innerHTML = `<p style="color:var(--texto-suave);font-size:13.5px;margin-bottom:20px;max-width:680px;">${u.resumen}</p>
    <div class="rejilla-tarjetas">
      ${SUBCARPETAS.map(
        (s) => `
        <div class="tarjeta" onclick="abrirSubcarpeta('${u.id}', '${s.clave}')">
          <div class="icono-tarjeta"><i class="fa-solid ${s.icono}"></i></div>
          <h3>${s.etiqueta}</h3>
          <div class="meta-tarjeta">
            <span><i class="fa-regular fa-folder"></i> ${u.carpetas[s.clave].length} archivo(s)</span>
            <span class="badge badge-azul">Ver</span>
          </div>
        </div>`
      ).join("")}
    </div>`;
}

function abrirSubcarpeta(unidadId, subClave) {
  const u = DATOS_PORTAFOLIO.unidades.find((x) => x.id === unidadId);
  const sub = SUBCARPETAS.find((s) => s.clave === subClave);
  const main = document.getElementById("area-principal");
  main.innerHTML = "";
  main.appendChild(
    construirEncabezado({ titulo: `Unidad ${u.numero} — ${sub.etiqueta}`, icono: sub.icono, desc: u.titulo })
  );
  main.appendChild(botonVolver(() => navegarA("material")));
  main.appendChild(bloqueListaYCarga(u.carpetas[subClave], `${unidadId}-${subClave}`));
  document.getElementById("crumb-actual").textContent = `Unidad ${u.numero} / ${sub.etiqueta}`;
}

/* --------------------------- 5d. Plan de Mejoras --------------------------- */

function renderMejoras() {
  const pm = DATOS_PORTAFOLIO.planMejoras;
  const frag = document.createDocumentFragment();

  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "1.1fr 0.9fr";
  grid.style.gap = "18px";
  grid.style.marginBottom = "22px";
  grid.className = "responsive-grid-mejoras";
  grid.innerHTML = `
    <div class="panel-grafico">
      <h4><i class="fa-solid fa-stethoscope" style="color:var(--dorado)"></i> Diagnóstico inicial</h4>
      <span class="sub">Aplicado en la primera semana del periodo</span>
      <p style="font-size:13.5px;color:var(--texto);line-height:1.6;">${pm.diagnosticoInicial}</p>
    </div>
    <div class="panel-grafico">
      <h4><i class="fa-solid fa-triangle-exclamation" style="color:var(--dorado)"></i> Dificultades detectadas</h4>
      <span class="sub">Principales brechas identificadas</span>
      <ul style="margin:0;padding-left:18px;font-size:13.5px;color:var(--texto);line-height:1.8;">
        ${pm.dificultadesDetectadas.map((d) => `<li>${d}</li>`).join("")}
      </ul>
    </div>
  `;
  frag.appendChild(grid);

  const acciones = document.createElement("div");
  acciones.className = "panel-grafico";
  acciones.style.marginBottom = "22px";
  acciones.innerHTML = `
    <h4><i class="fa-solid fa-list-check" style="color:var(--dorado)"></i> Acciones de mejora</h4>
    <span class="sub">Estrategias implementadas durante el periodo</span>
    <div class="rejilla-tarjetas" style="margin-top:6px;">
      ${pm.accionesMejora
        .map(
          (a, i) => `
        <div class="tarjeta" style="cursor:default;">
          <div class="icono-tarjeta"><i class="fa-solid fa-anchor"></i></div>
          <h3 style="font-size:13.5px;">Acción ${i + 1}</h3>
          <p class="desc">${a}</p>
        </div>`
        )
        .join("")}
    </div>
  `;
  frag.appendChild(acciones);

  const evidenciasWrap = document.createElement("div");
  evidenciasWrap.className = "panel-grafico";
  evidenciasWrap.style.marginBottom = "22px";
  evidenciasWrap.innerHTML = `<h4><i class="fa-solid fa-box-archive" style="color:var(--dorado)"></i> Evidencias</h4>
    <span class="sub">Sube evidencias del seguimiento (informes, capturas, listas de asistencia)</span>`;
  evidenciasWrap.appendChild(bloqueListaYCarga([], "mejoras-evidencias"));
  frag.appendChild(evidenciasWrap);

  const timelinePanel = document.createElement("div");
  timelinePanel.className = "panel-grafico";
  timelinePanel.style.marginBottom = "22px";
  timelinePanel.innerHTML = `
    <h4><i class="fa-solid fa-timeline" style="color:var(--dorado)"></i> Seguimiento — Línea de tiempo</h4>
    <span class="sub">Progreso del curso a lo largo del periodo</span>
    <div class="linea-tiempo">
      ${pm.lineaTiempo
        .map(
          (e) => `
        <div class="evento-tiempo">
          <div class="fecha">${formatearFecha(e.fecha)}</div>
          <h4>${e.titulo}</h4>
          <p>${e.desc}</p>
        </div>`
        )
        .join("")}
    </div>
  `;
  frag.appendChild(timelinePanel);

  const retro = document.createElement("div");
  retro.className = "panel-grafico";
  retro.innerHTML = `
    <h4><i class="fa-solid fa-comments" style="color:var(--dorado)"></i> Retroalimentación y observaciones del docente</h4>
    <span class="sub">Notas registradas por ${DATOS_PORTAFOLIO.institucion.docente}</span>
    <p style="font-size:13.5px;line-height:1.6;">${pm.observacionesDocente}</p>
    <textarea placeholder="Agregar nueva observación..." style="width:100%;margin-top:10px;padding:12px;border-radius:10px;border:1px solid var(--borde);background:var(--bg);color:var(--texto);font-family:var(--fuente-cuerpo);font-size:13px;min-height:70px;resize:vertical;"></textarea>
    <button class="btn btn-dorado" style="margin-top:10px;" onclick="alert('Observación registrada (demostración).')"><i class="fa-solid fa-floppy-disk"></i> Guardar observación</button>
  `;
  frag.appendChild(retro);

  return frag;
}

/* --------------------------- 5e. Calificaciones ---------------------------- */

function renderCalificaciones() {
  const frag = document.createDocumentFragment();

  const paneles = document.createElement("div");
  paneles.className = "paneles-graficos";
  paneles.innerHTML = `
    <div class="panel-grafico">
      <h4>Promedio general</h4>
      <span class="sub">Promedio consolidado del curso</span>
      <canvas id="g-promedio-general"></canvas>
    </div>
    <div class="panel-grafico">
      <h4>Rendimiento por actividad</h4>
      <span class="sub">Promedio del curso por rubro</span>
      <canvas id="g-rendimiento-actividad"></canvas>
    </div>
    <div class="panel-grafico">
      <h4>Distribución de notas</h4>
      <span class="sub">Cadetes por rango de promedio</span>
      <canvas id="g-distribucion-notas"></canvas>
    </div>
    <div class="panel-grafico">
      <h4>Evolución del curso</h4>
      <span class="sub">Promedio acumulado por rubro (secuencia de evaluación)</span>
      <canvas id="g-evolucion-curso"></canvas>
    </div>
  `;
  frag.appendChild(paneles);

  const tablaWrap = document.createElement("div");
  tablaWrap.className = "tabla-wrapper";
  tablaWrap.innerHTML = `
    <table class="tabla-datos">
      <thead>
        <tr>
          <th>Estudiante</th>
          ${RUBROS_CALIFICACION.map((r) => `<th>${r.etiqueta}</th>`).join("")}
          <th>Promedio</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>
        ${DATOS_PORTAFOLIO.estudiantes
          .map((e) => {
            const prom = promedioEstudiante(e);
            return `
            <tr>
              <td class="nombre-celda">${e.nombre}</td>
              ${RUBROS_CALIFICACION.map((r) => `<td>${e[r.clave].toFixed(1)}</td>`).join("")}
              <td><span class="nota ${claseNota(prom)}">${prom.toFixed(1)}</span></td>
              <td style="font-family:var(--fuente-cuerpo);color:var(--texto-suave);">${e.obs}</td>
            </tr>`;
          })
          .join("")}
      </tbody>
    </table>
  `;
  frag.appendChild(tablaWrap);

  setTimeout(() => {
    graficoPromedioGeneral("g-promedio-general");
    graficoRendimientoActividad("g-rendimiento-actividad");
    graficoDistribucionNotas("g-distribucion-notas");
    graficoEvolucionCurso("g-evolucion-curso");
  }, 0);

  return frag;
}

/* ------------------- 6. Zona de carga de archivos (simulada) -------------- */

function bloqueListaYCarga(archivosIniciales, zonaId) {
  if (!archivosSubidosPorZona[zonaId]) archivosSubidosPorZona[zonaId] = [...archivosIniciales];

  const cont = document.createElement("div");
  cont.innerHTML = `
    <div class="zona-carga" id="zona-${zonaId}">
      <i class="fa-solid fa-cloud-arrow-up"></i>
      <p><strong>Arrastra tus archivos aquí</strong> o haz clic para seleccionarlos</p>
      <p style="font-size:11.5px;">Formatos permitidos: PDF, Word (.docx) — también puedes registrar enlaces</p>
      <button class="btn btn-primario" style="margin-top:10px;" type="button">
        <i class="fa-solid fa-plus"></i> Seleccionar archivo
      </button>
      <input type="file" id="input-${zonaId}" accept=".pdf,.doc,.docx" />
    </div>
    <div style="display:flex; gap:10px; margin: 14px 0 4px; flex-wrap:wrap; align-items:center;">
      <input type="text" id="filtro-${zonaId}" placeholder="Filtrar documentos..." style="flex:1;min-width:160px;padding:9px 14px;border-radius:30px;border:1px solid var(--borde);background:var(--bg-elevada);color:var(--texto);font-size:13px;">
      <select id="orden-${zonaId}" style="padding:9px 14px;border-radius:30px;border:1px solid var(--borde);background:var(--bg-elevada);color:var(--texto);font-size:13px;">
        <option value="reciente">Más reciente</option>
        <option value="antiguo">Más antiguo</option>
        <option value="az">Nombre A-Z</option>
      </select>
    </div>
    <div class="lista-archivos" id="lista-${zonaId}"></div>
  `;

  setTimeout(() => {
    const zona = document.getElementById(`zona-${zonaId}`);
    const input = document.getElementById(`input-${zonaId}`);
    zona.addEventListener("click", () => input.click());
    ["dragenter", "dragover"].forEach((ev) =>
      zona.addEventListener(ev, (e) => { e.preventDefault(); zona.classList.add("resaltada"); })
    );
    ["dragleave", "drop"].forEach((ev) =>
      zona.addEventListener(ev, (e) => { e.preventDefault(); zona.classList.remove("resaltada"); })
    );
    zona.addEventListener("drop", (e) => manejarArchivosNuevos(zonaId, e.dataTransfer.files));
    input.addEventListener("change", (e) => manejarArchivosNuevos(zonaId, e.target.files));

    document.getElementById(`filtro-${zonaId}`).addEventListener("input", () => pintarListaArchivos(zonaId));
    document.getElementById(`orden-${zonaId}`).addEventListener("change", () => pintarListaArchivos(zonaId));

    pintarListaArchivos(zonaId);
  }, 0);

  return cont;
}

function manejarArchivosNuevos(zonaId, fileList) {
  const hoy = new Date().toISOString().slice(0, 10);
  Array.from(fileList).forEach((f) => {
    const ext = f.name.split(".").pop().toLowerCase();
    const tipo = ext === "pdf" ? "pdf" : ext === "doc" || ext === "docx" ? "word" : "otro";
    // Se guarda el archivo real (File) y se genera una URL de objeto en el
    // propio navegador -> la vista previa y la descarga son 100% reales
    // (no simuladas) mientras dure esta sesión/pestaña del navegador.
    archivosSubidosPorZona[zonaId].unshift({
      nombre: f.name,
      tipo,
      tam: `${(f.size / 1024).toFixed(0)} KB`,
      fecha: hoy,
      urlObjeto: URL.createObjectURL(f),
    });
  });
  pintarListaArchivos(zonaId);
}

function eliminarArchivo(zonaId, idx) {
  archivosSubidosPorZona[zonaId].splice(idx, 1);
  pintarListaArchivos(zonaId);
}

function pintarListaArchivos(zonaId) {
  const lista = document.getElementById(`lista-${zonaId}`);
  if (!lista) return;
  const filtroEl = document.getElementById(`filtro-${zonaId}`);
  const ordenEl = document.getElementById(`orden-${zonaId}`);
  const filtro = filtroEl ? filtroEl.value.toLowerCase() : "";
  const orden = ordenEl ? ordenEl.value : "reciente";

  let archivos = [...archivosSubidosPorZona[zonaId]].filter((a) => a.nombre.toLowerCase().includes(filtro));
  if (orden === "reciente") archivos.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  if (orden === "antiguo") archivos.sort((a, b) => (a.fecha > b.fecha ? 1 : -1));
  if (orden === "az") archivos.sort((a, b) => a.nombre.localeCompare(b.nombre));

  if (archivos.length === 0) {
    lista.innerHTML = `<div class="texto-vacio" style="padding:30px;"><i class="fa-solid fa-folder-open"></i>Aún no hay documentos en esta carpeta.</div>`;
    return;
  }

  lista.innerHTML = archivos
    .map((a, i) => {
      const idxReal = archivosSubidosPorZona[zonaId].indexOf(a);
      // Un archivo es "real" (descargable de verdad) si tiene:
      //  - "ruta": un archivo del proyecto (subido por el docente a documentos/)
      //  - "urlObjeto": un archivo que el propio usuario acaba de arrastrar/seleccionar
      const urlReal = a.ruta || a.urlObjeto;
      const nombreEscapado = a.nombre.replace(/'/g, "\\'");
      const botonDescarga = urlReal
        ? `<a class="btn-descarga-real" title="Descargar" href="${urlReal}" download="${a.nombre}"><i class="fa-solid fa-download"></i></a>`
        : `<button title="Aún no se ha cargado el archivo real" onclick="alert('Este documento es un marcador de posición: aún no tiene un archivo real asociado. Súbelo desde esta misma carpeta, o añade su \\'ruta\\' en data.js (ver README).')" style="opacity:.45;"><i class="fa-solid fa-download"></i></button>`;
      const botonVista = urlReal
        ? `<button title="Vista previa" onclick='abrirVistaPrevia(${JSON.stringify(a.nombre)}, ${JSON.stringify(a.tipo)}, ${JSON.stringify(urlReal)})'><i class="fa-solid fa-eye"></i></button>`
        : `<button title="Vista previa" onclick='abrirVistaPrevia(${JSON.stringify(a.nombre)}, ${JSON.stringify(a.tipo)}, null)'><i class="fa-solid fa-eye"></i></button>`;
      const insignia = urlReal ? "" : `<span class="badge badge-ambar" style="margin-right:6px;">Pendiente de carga</span>`;
      return `
      <div class="item-archivo">
        <i class="fa-solid ${iconoPorTipo(a.tipo)} tipo"></i>
        <div class="nombre-archivo">${a.nombre}</div>
        <span class="tam">${a.tam} · ${formatearFecha(a.fecha)}</span>
        ${insignia}
        ${botonVista}
        ${botonDescarga}
        <button title="Eliminar" onclick="eliminarArchivo('${zonaId}', ${idxReal})"><i class="fa-solid fa-trash"></i></button>
      </div>`;
    })
    .join("");
}

/* --------------------------- 7. Modal de vista previa ----------------------- */

function abrirVistaPrevia(nombre, tipo, url) {
  const modal = document.getElementById("modal-preview");
  document.getElementById("modal-titulo").textContent = nombre;
  const iconoTipo = tipo === "pdf" ? "fa-file-pdf" : tipo === "word" ? "fa-file-word" : "fa-link";
  const nombreEscapado = nombre.replace(/'/g, "\\'");

  let cuerpoVista;
  if (url && tipo === "pdf") {
    // PDF real: se incrusta el visor nativo del navegador
    cuerpoVista = `<iframe src="${url}" style="width:100%;height:60vh;border:1px solid var(--borde);border-radius:10px;"></iframe>`;
  } else if (url) {
    // Word/enlace real: el navegador no puede previsualizar .docx de forma nativa,
    // así que se ofrece abrir/descargar el archivo real directamente.
    cuerpoVista = `
      <div class="vista-doc">
        <i class="fa-solid ${iconoTipo}"></i>
        <p style="margin-top:12px;font-weight:600;color:var(--texto);">${nombre}</p>
        <p style="font-size:12.5px;">Este tipo de archivo no tiene vista previa dentro del navegador — ábrelo o descárgalo con el botón de abajo.</p>
      </div>`;
  } else {
    // Sin archivo real asociado todavía (marcador de posición del docente)
    cuerpoVista = `
      <div class="vista-doc">
        <i class="fa-solid ${iconoTipo}"></i>
        <p style="margin-top:12px;font-weight:600;color:var(--texto);">${nombre}</p>
        <p style="font-size:12.5px;">Aún no se ha cargado el archivo real de este documento. El docente puede subirlo desde esta carpeta o enlazarlo en <code>js/data.js</code> (campo "ruta").</p>
      </div>`;
  }

  const botonesFinales = url
    ? `<a class="btn btn-dorado" href="${url}" download="${nombre}"><i class="fa-solid fa-download"></i> Descargar</a>`
    : `<button class="btn btn-dorado" style="opacity:.5;" onclick="alert('Todavía no hay un archivo real que descargar para: ${nombreEscapado}')"><i class="fa-solid fa-download"></i> Descargar</button>`;

  document.getElementById("modal-cuerpo-contenido").innerHTML = `
    ${cuerpoVista}
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;">
      <button class="btn btn-fantasma" onclick="cerrarModal()">Cerrar</button>
      ${botonesFinales}
    </div>
  `;
  modal.classList.add("activo");
}
function cerrarModal() {
  document.getElementById("modal-preview").classList.remove("activo");
}

/* -------------------------------- 8. Gráficos -------------------------------- */

let instanciasGraficos = {};
function destruirSiExiste(id) {
  if (instanciasGraficos[id]) { instanciasGraficos[id].destroy(); delete instanciasGraficos[id]; }
}

function coloresTema() {
  const oscuro = document.documentElement.getAttribute("data-tema") === "oscuro";
  return {
    texto: oscuro ? "#93A6C2" : "#5B6B82",
    grid: oscuro ? "rgba(255,255,255,0.06)" : "rgba(11,37,69,0.06)",
    dorado: "#C9A227",
    doradoClaro: "#E7C766",
    azul: "#123B6D",
    azulClaro: "#1B4A82",
    verde: "#1E7A46",
    ambar: "#9A6B0C",
    rojo: "#B3372C",
  };
}

function graficoRendimientoActividad(id) {
  const el = document.getElementById(id);
  if (!el) return;
  destruirSiExiste(id);
  const c = coloresTema();
  const promedios = RUBROS_CALIFICACION.map(
    (r) => DATOS_PORTAFOLIO.estudiantes.reduce((a, e) => a + e[r.clave], 0) / DATOS_PORTAFOLIO.estudiantes.length
  );
  instanciasGraficos[id] = new Chart(el, {
    type: "bar",
    data: {
      labels: RUBROS_CALIFICACION.map((r) => r.etiqueta),
      datasets: [{ label: "Promedio", data: promedios.map((p) => p.toFixed(2)), backgroundColor: c.dorado, borderRadius: 6, maxBarThickness: 34 }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 10, ticks: { color: c.texto }, grid: { color: c.grid } },
        x: { ticks: { color: c.texto }, grid: { display: false } },
      },
    },
  });
}

function graficoDistribucionNotas(id) {
  const el = document.getElementById(id);
  if (!el) return;
  destruirSiExiste(id);
  const c = coloresTema();
  const proms = DATOS_PORTAFOLIO.estudiantes.map(promedioEstudiante);
  const rangos = { "9 - 10": 0, "7.5 - 8.9": 0, "7 - 7.4": 0, "< 7": 0 };
  proms.forEach((p) => {
    if (p >= 9) rangos["9 - 10"]++;
    else if (p >= 7.5) rangos["7.5 - 8.9"]++;
    else if (p >= 7) rangos["7 - 7.4"]++;
    else rangos["< 7"]++;
  });
  instanciasGraficos[id] = new Chart(el, {
    type: "doughnut",
    data: {
      labels: Object.keys(rangos),
      datasets: [{ data: Object.values(rangos), backgroundColor: [c.verde, c.dorado, c.ambar, c.rojo], borderWidth: 0 }],
    },
    options: { responsive: true, plugins: { legend: { position: "bottom", labels: { color: c.texto, boxWidth: 12, font: { size: 11 } } } } },
  });
}

function graficoPromedioGeneral(id) {
  const el = document.getElementById(id);
  if (!el) return;
  destruirSiExiste(id);
  const c = coloresTema();
  const promedios = DATOS_PORTAFOLIO.estudiantes.map((e) => ({ n: e.nombre.split(",")[0], p: promedioEstudiante(e) }));
  instanciasGraficos[id] = new Chart(el, {
    type: "bar",
    data: {
      labels: promedios.map((x) => x.n),
      datasets: [{
        label: "Promedio",
        data: promedios.map((x) => x.p.toFixed(2)),
        backgroundColor: promedios.map((x) => (x.p >= 8 ? c.verde : x.p >= 7 ? c.dorado : c.rojo)),
        borderRadius: 6,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, max: 10, ticks: { color: c.texto }, grid: { color: c.grid } },
        y: { ticks: { color: c.texto, font: { size: 10.5 } }, grid: { display: false } },
      },
    },
  });
}

function graficoEvolucionCurso(id) {
  const el = document.getElementById(id);
  if (!el) return;
  destruirSiExiste(id);
  const c = coloresTema();
  instanciasGraficos[id] = new Chart(el, {
    type: "line",
    data: {
      labels: RUBROS_CALIFICACION.map((r) => r.etiqueta),
      datasets: [{
        label: "Promedio acumulado",
        data: RUBROS_CALIFICACION.map(
          (r) => DATOS_PORTAFOLIO.estudiantes.reduce((a, e) => a + e[r.clave], 0) / DATOS_PORTAFOLIO.estudiantes.length
        ).map((v) => v.toFixed(2)),
        borderColor: c.azulClaro,
        backgroundColor: "rgba(27,74,130,0.15)",
        tension: 0.35,
        fill: true,
        pointBackgroundColor: c.dorado,
        pointRadius: 4,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 10, ticks: { color: c.texto }, grid: { color: c.grid } },
        x: { ticks: { color: c.texto }, grid: { display: false } },
      },
    },
  });
}

function repintarGraficosVisibles() {
  // Vuelve a pintar los gráficos de la sección actual al cambiar el tema
  navegarA(seccionActual);
}

/* ------------------------------ 9. Inicialización ---------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  // Datos institucionales en portada / sidebar / pie
  document.querySelectorAll("[data-campo=materia]").forEach((el) => (el.textContent = DATOS_PORTAFOLIO.institucion.materia));
  document.querySelectorAll("[data-campo=docente]").forEach((el) => (el.textContent = DATOS_PORTAFOLIO.institucion.docente));
  document.querySelectorAll("[data-campo=curso]").forEach((el) => (el.textContent = DATOS_PORTAFOLIO.institucion.curso));
  document.querySelectorAll("[data-campo=periodo]").forEach((el) => (el.textContent = DATOS_PORTAFOLIO.institucion.periodo));
  document.querySelectorAll("[data-campo=institucion]").forEach((el) => (el.textContent = DATOS_PORTAFOLIO.institucion.institucionNombre));

  document.getElementById("btn-ingresar").addEventListener("click", ingresarAlPortafolio);
  document.getElementById("btn-tema").addEventListener("click", () => { alternarTema(); repintarGraficosVisibles(); });
  document.getElementById("btn-colapsar").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("colapsada"));
  document.getElementById("btn-menu-movil").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("movil-visible"));
  document.getElementById("btn-inicio-topbar").addEventListener("click", () => navegarA("inicio"));

  document.querySelectorAll(".nav-item").forEach((el) =>
    el.addEventListener("click", () => navegarA(el.dataset.seccion))
  );

  document.getElementById("campo-busqueda").addEventListener("keydown", (e) => {
    if (e.key === "Enter") manejarBusqueda(e.target.value);
  });

  document.getElementById("modal-preview").addEventListener("click", (e) => {
    if (e.target.id === "modal-preview") cerrarModal();
  });

  const btnArriba = document.getElementById("btn-arriba");
  window.addEventListener("scroll", () => btnArriba.classList.toggle("visible", window.scrollY > 400));
  btnArriba.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  document.getElementById("anio-actual").textContent = new Date().getFullYear();
});
