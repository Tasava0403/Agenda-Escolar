const API_URL = "http://localhost:8080/tareas";

let tareas = [];

// =======================
// CARGAR TAREAS
// =======================
async function cargarTareas() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Error al obtener tareas");
        }

        tareas = await response.json();

        renderTabla();

    } catch (error) {

        console.error("Error cargando tareas:", error);

        mostrarMensaje("Error cargando tareas");

    }
}

// =======================
// MOSTRAR TABLA
// =======================
function renderTabla(filtro = "") {

    const tbody = document.getElementById("tablaTareasBody");

    const filtroLower = filtro.toLowerCase();

    const tareasFiltradas = tareas.filter(t =>

        t.descripcion.toLowerCase().includes(filtroLower)

    );

    tbody.innerHTML = "";

    tareasFiltradas.forEach(t => {

        tbody.innerHTML += `

            <tr>

                <td>${t.idMateria}</td>

                <td>${t.descripcion}</td>

                <td>${formatearFecha(t.fecha)}</td>

                <td>
                    ${badgeEstado(t.estado)}
                </td>

                <td class="text-nowrap">

                    <!-- VER -->
                    <button
                        class="btn btn-primary btn-sm"
                        onclick="verTarea(${t.idTarea})"
                        data-bs-toggle="modal"
                        data-bs-target="#modalVer">

                        Ver

                    </button>

                    <!-- EDITAR -->
                    <button
                        class="btn btn-warning btn-sm ms-2"
                        onclick="editarTarea(${t.idTarea})">

                        Editar

                    </button>

                    <!-- ELIMINAR -->
                    <button
                        class="btn btn-danger btn-sm ms-2"
                        onclick="eliminarTarea(${t.idTarea})">

                        Borrar

                    </button>

                </td>

            </tr>

        `;
    });

    mostrarSinTareas(tareasFiltradas.length === 0);
}

// =======================
// BADGE ESTADO
// =======================
function badgeEstado(estado) {

    return estado === "Hecho" || estado === "Completado"

        ? '<span class="badge bg-success">Hecho</span>'

        : '<span class="badge bg-warning text-dark">Pendiente</span>';
}

// =======================
// FORMATEAR FECHA
// =======================
function formatearFecha(fecha) {

    const d = new Date(fecha);

    return d.toLocaleDateString();
}

// =======================
// MOSTRAR MENSAJE VACÍO
// =======================
function mostrarSinTareas(visible) {

    document
        .getElementById("sinTareas")
        .classList.toggle("d-none", !visible);
}

// =======================
// VER TAREA
// =======================
function verTarea(id) {

    const tarea = tareas.find(t => t.idTarea === id);

    if (!tarea) return;

    document.getElementById("verMateria").textContent =
        tarea.idMateria;

    document.getElementById("verTarea").textContent =
        tarea.descripcion;

    document.getElementById("verFecha").textContent =
        formatearFecha(tarea.fecha);

    document.getElementById("verEstado").textContent =
        tarea.estado;
}

// =======================
// EDITAR
// =======================
function editarTarea(id) {

    window.location.href =
        `editarTarea.html?id=${id}`;
}

// =======================
// ELIMINAR
// =======================
async function eliminarTarea(id) {

    const confirmar = confirm("¿Eliminar tarea?");

    if (!confirmar) return;

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });

        if (response.ok) {

            mostrarMensaje("Tarea eliminada");

            cargarTareas();

        } else {

            mostrarMensaje("No se pudo eliminar");

        }

    } catch (error) {

        console.error("Error eliminando:", error);

        mostrarMensaje("Error eliminando tarea");

    }
}

// =======================
// MENSAJE SIMPLE
// =======================
function mostrarMensaje(texto) {

    alert(texto);
}

// =======================
// BUSCADOR
// =======================
document.addEventListener("DOMContentLoaded", () => {

    cargarTareas();

    // BUSCADOR
    document
        .getElementById("buscador")
        .addEventListener("input", e => {

            renderTabla(e.target.value);

        });

    // MENU
    fetch("menuModal.html")
        .then(res => res.text())
        .then(html => {

            document.getElementById("menu-container").innerHTML = html;

        });

});