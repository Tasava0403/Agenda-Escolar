let idMateriaEditando = null;

async function modificarMateria(idMateria) {
    if (!materiasGlobal || materiasGlobal.length === 0) {
        await cargarHorario();
    }

    const materia = materiasGlobal.find(m => m.idMateria === idMateria);
    if (!materia) return;

    idMateriaEditando = idMateria;

    // 1. Primero mostrar el modal (sin limpiar)
    mostrarModalHorario();

    // 2. Pequeña espera para que el DOM renderice el modal
    await new Promise(resolve => setTimeout(resolve, 50));

    // 3. Ahora sí llenar los campos
    document.getElementById("nombreMateria").value = materia.nombreMaterias;
    document.getElementById("nombreProfesor").value = materia.nombreProfesor;

    document.querySelectorAll(".hora").forEach(select => select.value = "");

    materia.horarios.forEach(horario => {
        const dia = horario.diaHorario
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const selectInicio = document.querySelector(`.hora[data-dia="${dia}"][data-tipo="inicio"]`);
        const selectFin    = document.querySelector(`.hora[data-dia="${dia}"][data-tipo="fin"]`);

        if (selectInicio) selectInicio.value = horario.horaInicio;
        if (selectFin)    selectFin.value    = horario.horaFin;
    });
}

function cerrarModalHorario() {
    const modalElement = document.getElementById('modalHorario');
    const instancia = bootstrap.Modal.getInstance(modalElement);
    if (instancia) instancia.hide();
}

function guardarMateria() {
    limpiarErrores();
    if (!validarFormularioMateria()) return false;

    const materiaData = construirDatosMateria();
    const alertTabla = document.getElementById('alertTabla');

    if (alertTabla) {
        alertTabla.innerHTML = "⏳ Guardando materia, por favor espere...";
        alertTabla.style.color = "#3E34CA";
        alertTabla.style.display = "block";
    }

    const esEdicion = idMateriaEditando !== null;
    const url    = esEdicion
        ? `http://localhost:8080/subjects/putMateria?id=${idMateriaEditando}`
        : 'http://localhost:8080/subjects/materias';
    const metodo = esEdicion ? 'PUT' : 'POST';

    console.log("📤 Método:", metodo, "| URL:", url); // ← para verificar en consola

    fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materiaData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Error ${response.status}: ${text || response.statusText}`);
            });
        }
        return response.json();
    })
    .then(() => {
        if (alertTabla) alertTabla.innerHTML = "";

        cerrarModalHorario();

        mostrarModal(esEdicion
            ? "✅ Materia modificada correctamente"
            : "✅ Materia agregada correctamente"
        );

        setTimeout(() => {
            limpiarFormulario();
            limpiarErrores();
            idMateriaEditando = null;
            cargarHorario();
        }, 1000);
    })
    .catch(error => {
        if (alertTabla) {
            alertTabla.innerHTML = `❌ Error al guardar: ${error.message}`;
            alertTabla.style.color = "red";
            alertTabla.style.display = "block";
        }
        mostrarModal(`❌ Error: ${error.message}`);
    });

    return true;
}