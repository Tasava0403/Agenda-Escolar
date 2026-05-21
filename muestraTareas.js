const API_URL = "http://localhost:8080/tareas";

// ==========================
// FORMATEAR FECHA
// ==========================
function formatearFecha(fechaISO) {

  const fecha = new Date(fechaISO);

  return fecha.toLocaleDateString("es-MX");

}

// ==========================
// BADGE ESTADO
// ==========================
function badgeEstado(estado) {

  return estado === "Hecho" || estado === "Completado"
    ? '<span class="badge text-bg-success">Completado</span>'
    : '<span class="badge text-bg-warning">Pendiente</span>';

}

// ==========================
// MENSAJE SIN TAREAS
// ==========================
function mostrarSinTareas(visible) {

  document.getElementById("sinTareas")
    .classList.toggle("d-none", !visible);

}

// ==========================
// CARGAR TAREAS
// ==========================
async function cargarTareas() {

  try {

    const response = await fetch(API_URL);

    const tareas = await response.json();

    console.log(tareas);

    renderTabla(tareas);

  } catch (error) {

    console.error("Error al cargar tareas:", error);

  }
}

// ==========================
// RENDER TABLA
// ==========================
function renderTabla(tareas, filtro = "") {

  const tbody = document.getElementById("tablaTareasBody");

  const filtroLower = filtro.toLowerCase();

  const tareasFiltradas = tareas.filter(t =>

    (t.descripcion || "")
      .toLowerCase()
      .includes(filtroLower)

  );

  tbody.innerHTML = tareasFiltradas.map(t => `

    <tr>

      <td>${t.idMateria}</td>

      <td>${t.descripcion}</td>

      <td>${formatearFecha(t.fecha)}</td>

      <td>${badgeEstado(t.estado)}</td>

      <td class="text-nowrap">

  <!-- BOTON VER -->
  <button
    class="btn btn-primary btn-sm btn-ver"
    data-id="${t.idTarea}"
    data-descripcion="${t.descripcion}"
    data-fecha="${formatearFecha(t.fecha)}"
    data-estado="${t.estado}"
    data-materia="${t.idMateria}"
    data-bs-toggle="modal"
    data-bs-target="#modalVer">

    Ver

  </button>

  <!-- BOTON EDITAR -->
  <a
    href="editarTarea.html?id=${t.idTarea}"
    class="btn btn-warning btn-sm ms-2">

    Editar

  </a>

  <!-- BOTON BORRAR -->
  <button
    class="btn btn-danger btn-sm ms-2 btn-borrar"
    data-id="${t.idTarea}">

    Borrar

  </button>

</td>

    </tr>

  `).join("");

  mostrarSinTareas(tareas.length === 0);

  // ==========================
  // BOTON VER
  // ==========================
  document.querySelectorAll(".btn-ver").forEach(btn => {

    btn.addEventListener("click", () => {

      document.getElementById("verMateria").textContent =
        btn.dataset.materia;

      document.getElementById("verTarea").textContent =
        btn.dataset.descripcion;

      document.getElementById("verFecha").textContent =
        btn.dataset.fecha;

      document.getElementById("verEstado").textContent =
        btn.dataset.estado;

    });

  });

  // ==========================
  // BOTON BORRAR
  // ==========================
  document.querySelectorAll(".btn-borrar").forEach(btn => {

    btn.addEventListener("click", async () => {

      const id = btn.dataset.id;

      try {

        await fetch(`${API_URL}/${id}`, {
          method: "DELETE"
        });

        cargarTareas();

      } catch (error) {

        console.error("Error al borrar tarea:", error);

      }

    });

  });

}

// ==========================
// DOM READY
// ==========================
document.addEventListener("DOMContentLoaded", () => {

  cargarTareas();

  document.getElementById("buscador")
    .addEventListener("input", async e => {

      const response = await fetch(API_URL);

      const tareas = await response.json();

      renderTabla(tareas, e.target.value);

    });

  // ==========================
  // MENU MODAL
  // ==========================
  fetch("menuModal.html")
    .then(res => res.text())
    .then(html => {

      document.getElementById("menu-container")
        .innerHTML = html;

    });

});