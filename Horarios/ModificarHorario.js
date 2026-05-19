let materiasGlobal = []
const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

async function cargarHorario() {
    try {
        const res = await fetch("http://localhost:8080/subjects/horariosbyUsuario?id=1");
        const data = await res.json();

        materiasGlobal = data.materiasResponses;

        const tbody = document.querySelector(".table-container table tbody");
        if (!tbody) return;
        
        tbody.innerHTML = "";

        materiasGlobal.forEach(materia => {
            const tr = document.createElement("tr");

            const tdMateria = document.createElement("td");
            tdMateria.innerHTML = `
                <strong>${materia.nombreMaterias}</strong>
                <br>
                <small>${materia.nombreProfesor}</small>
            `;
            tr.appendChild(tdMateria);

            dias.forEach(dia => {
                const td = document.createElement("td");
                const horariosDia = materia.horarios.filter(h => h.diaHorario === dia);

                if (horariosDia.length > 0) {
                    td.innerHTML = horariosDia
                        .map(h => `${h.horaInicio.slice(0,5)} - ${h.horaFin.slice(0,5)}`)
                        .join("<br>");
                    td.classList.add("table-success");
                } else {
                    td.textContent = "—";
                    td.classList.add("text-muted");
                }
                tr.appendChild(td);
            });

            const tdAcciones = document.createElement("td");
            tdAcciones.innerHTML = `
                <div class="d-flex flex-column gap-2">
                    <button class="btn btn-primary btn-sm" onclick="irAModificar(${materia.idMateria})">
                        ✏️ Modificar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarMateria(${materia.idMateria})">
                        🗑️ Eliminar
                    </button>
                </div>
            `;
            tr.appendChild(tdAcciones);
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error al cargar el horario:", error);
    }
}

cargarHorario();

async function irAModificar(idMateria) {
    // Si materiasGlobal está vacío, recargar primero
    if (!materiasGlobal || materiasGlobal.length === 0) {
        await cargarHorario();
    }

    const selectsListos = document.querySelectorAll(".hora option").length > 0;
    if (!selectsListos) {
        llenarSelectsHora();
    }

    await modificarMateria(idMateria);
}

// Abre el modal limpio para registros nuevos
function abrirModalNuevo() {
    idMateriaEditando = null;
    limpiarFormulario();
    limpiarErrores();
    mostrarModalHorario();
}


// Función eliminar con modal de confirmación
async function eliminarMateria(idMateria) {
    // Mostrar modal de confirmación
    mostrarModalEliminar();
    
    // Configurar el botón de confirmar
    document.getElementById("btnConfirmarEliminar").onclick = async () => {
        // Cerrar el modal
        const modalElement = document.getElementById("modalConfirmarEliminar");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();

        try {
            const response = await fetch(
                `http://localhost:8080/subjects/deleteMateria?id_materia=${idMateria}&id_usuario=1`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("No se pudo eliminar la materia");
            }

            mostrarModal("✅ Materia eliminada correctamente");
            cargarHorario();

        } catch (error) {
            console.error("Error al eliminar:", error);
            mostrarModal(`❌ ${error.message}`);
        }
    };
}