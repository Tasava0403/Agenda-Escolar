const API_URL = "http://localhost:8080/tareas";

// ==========================
// GUARDAR TAREA
// ==========================
document
  .getElementById("taskForm")
  .addEventListener("submit", async function (e) {

    e.preventDefault();

    // Obtener datos del formulario
    const materia = document.getElementById("materia").value;
    const fecha = document.getElementById("fecha").value;
    const tarea = document.getElementById("tarea").value;
    const estado = document.getElementById("estado").value;
    const nota = document.getElementById("nota").value;

    // Crear objeto
    const nuevaTarea = {
      idUsuario: 1,
      idMateria: 1,
      descripcion: tarea,
      fecha: fecha,
      estado: estado,
      nota: nota
    };

    try {

      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaTarea)
      });

      if (!respuesta.ok) {
        throw new Error("Error al guardar");
      }

      mostrarModal("Tarea agregada correctamente");

      // limpiar formulario
      document.getElementById("taskForm").reset();

      // redireccionar
      setTimeout(() => {
        window.location.href = "MuestraTareas.html";
      }, 1500);

    } catch (error) {

      console.error(error);

      mostrarModal("Error al guardar tarea");
    }
});