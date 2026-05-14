const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

async function cargarHorario() {
  try {
    const res = await fetch("http://localhost:8080/subjects/horariosbyUsuario?id=1");
    const data = await res.json();
    const materias = data.materiasResponses;
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    materias.forEach(materia => {
      const tr = document.createElement("tr");

      // Columna de materia
      const tdMateria = document.createElement("td");
      tdMateria.innerHTML = `<strong>${materia.nombreMaterias}</strong><br><small>${materia.nombreProfesor}</small>`;
      tr.appendChild(tdMateria);

      // Una columna por día
      dias.forEach(dia => {
        const td = document.createElement("td");
        const horariosDia = materia.horarios.filter(h => h.diaHorario === dia);

        if (horariosDia.length > 0) {
          td.innerHTML = horariosDia
            .map(h => `${h.horaInicio.slice(0,5)} - ${h.horaFin.slice(0,5)}`)
            .join("<br>");
          td.classList.add("table-success"); // verde si hay clase
        } else {
          td.textContent = "—";
          td.classList.add("text-muted");
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error al cargar el horario:", error);
  }
}

cargarHorario();