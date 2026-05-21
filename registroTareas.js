const API_URL = "http://localhost:8080/tareas";

document
  .getElementById("taskForm")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

    // Obtener valores
    const descripcion = document
      .getElementById("tarea")
      .value
      .trim();

    const fecha = document
      .getElementById("fecha")
      .value;

    const estado = document
      .getElementById("estado")
      .value;

    const nota = document
      .getElementById("nota")
      .value
      .trim();

    const materia = document
      .getElementById("materia")
      .value
      .trim();

    // VALIDACIONES
    if (!materia || !descripcion || !fecha) {

      mostrarModal("Completa todos los campos");

      return;
    }

    // Objeto tarea
    const tarea = {

      idUsuario: 1,
      idMateria: 4,

      descripcion: descripcion,
      fecha: fecha,
      estado: estado,
      nota: nota

    };

    try {

      const response = await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(tarea)

      });

      console.log("STATUS:", response.status);

      const texto = await response.text();
      console.log(texto);

      // SI TODO SALE BIEN
      if (response.ok) {

        mostrarModal("Tarea guardada correctamente");

        document
          .getElementById("taskForm")
          .reset();

        // Esperar antes de redireccionar
        setTimeout(() => {

          window.location.href = "MuestraTareas.html";

        }, 1500);

      } else {

        mostrarModal("Error al guardar tarea");

      }

    } catch (error) {

      console.error(error);

      mostrarModal("Error de conexión con Spring Boot");

    }

});