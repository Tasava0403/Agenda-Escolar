const API_URL = "http://localhost:8080/tareas";

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

// ==========================
// CARGAR DATOS
// ==========================
async function cargarTarea() {

  const response = await fetch(`${API_URL}/${id}`);

  const tarea = await response.json();

  document.getElementById("descripcion").value =
    tarea.descripcion;

  document.getElementById("fecha").value =
    tarea.fecha.split("T")[0];

  document.getElementById("estado").value =
    tarea.estado;

  document.getElementById("nota").value =
    tarea.nota;

}

cargarTarea();

// ==========================
// GUARDAR CAMBIOS
// ==========================
document.getElementById("formEditar")
  .addEventListener("submit", async e => {

    e.preventDefault();

    const tareaActualizada = {

      descripcion:
        document.getElementById("descripcion").value,

      fecha:
        document.getElementById("fecha").value,

      estado:
        document.getElementById("estado").value,

      nota:
        document.getElementById("nota").value,

      idUsuario: 1,
      idMateria: 4

    };

    await fetch(`${API_URL}/${id}`, {

      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(tareaActualizada)

    });

    alert("Tarea actualizada");

    window.location.href = "MuestraTareas.html";

});