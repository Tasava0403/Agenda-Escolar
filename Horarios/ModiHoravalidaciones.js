/**
 * Función principal de validación para el formulario de materias
 * @returns {boolean} true si todo es válido, false si hay errores
 */
function validarFormularioMateria() {
    // Limpiar mensajes de error anteriores
    limpiarErrores();
    
    // 1. Obtener referencias a los campos
    const nombreMateria = document.getElementById('nombreMateria');
    const nombreProfesor = document.getElementById('nombreProfesor');
    const alertMateria = document.getElementById('alertMateria');
    const alertProfesor = document.getElementById('alertProfesor');
    const alertTabla = document.getElementById('alertTabla');
    
    let esValido = true;
    
    // Validar que existan los elementos
    if (!nombreMateria || !nombreProfesor) {
        console.error('No se encontraron los campos del formulario');
        return false;
    }
    
    const nombreMateriaValue = nombreMateria.value.trim();
    const nombreProfesorValue = nombreProfesor.value.trim();

    // 2. Validar nombre de materia
    if (nombreMateriaValue === "") {
        if (alertMateria) {
            alertMateria.innerHTML = "❌ Por favor, completa el nombre de la materia.";
            alertMateria.style.color = "red";
        }
        nombreMateria.style.borderColor = "red";
        nombreMateria.focus();
        esValido = false;
    } else if (nombreMateriaValue.length < 4) {
        if (alertMateria) {
            alertMateria.innerHTML = "❌ El nombre de la materia debe tener al menos 4 caracteres.";
            alertMateria.style.color = "red";
        }
        nombreMateria.style.borderColor = "red";
        nombreMateria.focus();
        esValido = false;
    } else {
        if (alertMateria) alertMateria.innerHTML = "";
        nombreMateria.style.borderColor = "green";
    }
    
    // 3. Validar nombre del profesor
    if (nombreProfesorValue === "") {
        if (alertProfesor) {
            alertProfesor.innerHTML = "❌ Por favor, completa el nombre del profesor.";
            alertProfesor.style.color = "red";
        }
        nombreProfesor.style.borderColor = "red";
        if (esValido) nombreProfesor.focus();
        esValido = false;
    } else if (nombreProfesorValue.length < 3) {
        if (alertProfesor) {
            alertProfesor.innerHTML = "❌ El nombre del profesor debe tener al menos 4 caracteres.";
            alertProfesor.style.color = "red";
        }
        nombreProfesor.style.borderColor = "red";
        if (esValido) nombreProfesor.focus();
        esValido = false;
    } else {
        if (alertProfesor) alertProfesor.innerHTML = "";
        nombreProfesor.style.borderColor = "green";
    }
    
    // Si los campos básicos no son válidos, terminar aquí
    if (!esValido) return false;

    // 4. Validar horarios
    const selectsInicio = document.querySelectorAll('.fila-hora-inicio .hora');
    const selectsFinal = document.querySelectorAll('.fila-hora-fin .hora');

    if (selectsInicio.length === 0 || selectsFinal.length === 0) {
        if (alertTabla) {
            alertTabla.innerHTML = "❌ Error: No se encontraron los selectores de hora";
            alertTabla.style.color = "red";
        }
        return false;
    }

    let tieneAlMenosUnHorario = false;
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    let erroresHorarios = [];

    // Validar cada día
    for (let i = 0; i < selectsInicio.length; i++) {
        const horaInicio = selectsInicio[i].value;
        const horaFinal = selectsFinal[i].value;
        const diaActual = diasSemana[i];

        // Caso A: Tiene inicio pero no fin, o viceversa
        if ((horaInicio && !horaFinal) || (!horaInicio && horaFinal)) {
            erroresHorarios.push(`⚠️ ${diaActual}: Debes seleccionar tanto hora de inicio como de fin.`);
            // Marcar los selects con error
            selectsInicio[i].style.borderColor = "red";
            selectsFinal[i].style.borderColor = "red";
        } 
        // Caso B: Ambos campos llenos
        else if (horaInicio && horaFinal) {
            // Convertir horas a minutos para comparar
            const [inicioHora, inicioMin] = horaInicio.split(':').map(Number);
            const [finHora, finMin] = horaFinal.split(':').map(Number);
            
            const inicioTotal = inicioHora * 60 + inicioMin;
            const finTotal = finHora * 60 + finMin;

            if (finTotal <= inicioTotal) {
                erroresHorarios.push(`⚠️ ${diaActual}: La hora final (${horaFinal}) debe ser posterior a la inicial (${horaInicio}).`);
                selectsInicio[i].style.borderColor = "red";
                selectsFinal[i].style.borderColor = "red";
            } else {
                // Horario válido
                tieneAlMenosUnHorario = true;
                selectsInicio[i].style.borderColor = "green";
                selectsFinal[i].style.borderColor = "green";
            }
        } else {
            // Restablecer colores si no hay selección
            selectsInicio[i].style.borderColor = "";
            selectsFinal[i].style.borderColor = "";
        }
    }

    // Mostrar errores de horarios
    if (erroresHorarios.length > 0) {
        if (alertTabla) {
            alertTabla.innerHTML = erroresHorarios.join('<br>');
            alertTabla.style.color = "red";
        }
        return false;
    }

    // Validar que haya al menos un horario
    if (!tieneAlMenosUnHorario) {
        if (alertTabla) {
            alertTabla.innerHTML = "⚠️ Debes ingresar al menos un horario para la materia.";
            alertTabla.style.color = "orange";
        }
        return false;
    }

    // Si todo es válido
    if (alertTabla) {
        alertTabla.innerHTML = "";
        alertTabla.style.color = "green";
    }
    
    return true;
}

// Función para limpiar todos los mensajes de error
function limpiarErrores() {
    // Limpiar labels de error
    const alertMateria = document.getElementById('alertMateria');
    const alertProfesor = document.getElementById('alertProfesor');
    const alertTabla = document.getElementById('alertTabla');
    
    if (alertMateria) alertMateria.innerHTML = '';
    if (alertProfesor) alertProfesor.innerHTML = '';
    if (alertTabla) alertTabla.innerHTML = '';
    
    // Limpiar bordes de inputs
    const nombreMateria = document.getElementById('nombreMateria');
    const nombreProfesor = document.getElementById('nombreProfesor');
    const todosSelects = document.querySelectorAll('.hora');
    
    if (nombreMateria) nombreMateria.style.borderColor = '';
    if (nombreProfesor) nombreProfesor.style.borderColor = '';
    todosSelects.forEach(select => {
        select.style.borderColor = '';
    });
}

// Función para construir el objeto de datos según el formato de la API
function construirDatosMateria() {
    // Obtener los valores del formulario
    const nombreMateria = document.getElementById('nombreMateria').value.trim();
    const nombreProfesor = document.getElementById('nombreProfesor').value.trim();
    const idUsuario = 1; // Obtener el ID del usuario actual
    
    // Construir el array de horarios
    const horariosrequest = [];
    
    // Mapeo de días (key del data-dia al nombre en español)
    const diasSemana = {
        'lunes': 'Lunes',
        'martes': 'Martes',
        'miercoles': 'Miércoles',
        'jueves': 'Jueves',
        'viernes': 'Viernes',
        'sabado': 'Sábado'
    };
    
    // Recorrer cada día para obtener los horarios
    for (const [diaKey, diaNombre] of Object.entries(diasSemana)) {
        const horaInicioSelect = document.querySelector(`.hora[data-dia="${diaKey}"][data-tipo="inicio"]`);
        const horaFinSelect = document.querySelector(`.hora[data-dia="${diaKey}"][data-tipo="fin"]`);
        
        if (horaInicioSelect && horaFinSelect) {
            let horaInicio = horaInicioSelect.value;
            let horaFin = horaFinSelect.value;
            
            // Solo agregar el horario si tiene hora de inicio y fin
            if (horaInicio && horaFin && horaInicio !== "" && horaFin !== "") {
                // Agregar segundos si no los tiene (formato HH:MM:SS)
                if (horaInicio.split(':').length === 2) horaInicio += ':00';
                if (horaFin.split(':').length === 2) horaFin += ':00';
                
                horariosrequest.push({
                    dia_horario: diaNombre,
                    horaInicio: horaInicio,
                    horaFin: horaFin
                });
            }
        }
    }
    
    // Construir el objeto final según el formato del ejemplo
    return {
        nombreMaterias: nombreMateria,
        nameProfesor: nombreProfesor,
        idUsuario: idUsuario,
        horariosrequest: horariosrequest
    };
}

// Función para limpiar el formulario completo
function limpiarFormulario() {
    // Limpiar inputs
    const nombreMateria = document.getElementById('nombreMateria');
    const nombreProfesor = document.getElementById('nombreProfesor');
    
    if (nombreMateria) {
        nombreMateria.value = '';
        nombreMateria.style.borderColor = '';
    }
    
    if (nombreProfesor) {
        nombreProfesor.value = '';
        nombreProfesor.style.borderColor = '';
    }
    
    // Limpiar selects
    const todosSelects = document.querySelectorAll('.hora');
    todosSelects.forEach(select => {
        select.value = '';
        select.style.borderColor = '';
    });
}

// Agregar validación en tiempo real mientras el usuario escribe
document.addEventListener('DOMContentLoaded', function() {
    const nombreMateria = document.getElementById('nombreMateria');
    const nombreProfesor = document.getElementById('nombreProfesor');
    
    if (nombreMateria) {
        nombreMateria.addEventListener('input', function() {
            const alertMateria = document.getElementById('alertMateria');
            if (this.value.trim().length >= 4) {
                alertMateria.innerHTML = "";
                alertMateria.style.color = "green";
                this.style.borderColor = "green";
            } else if (this.value.trim().length > 0) {
                alertMateria.innerHTML = "⚠️ Mínimo 3 caracteres";
                alertMateria.style.color = "orange";
                this.style.borderColor = "orange";
            } else {
                alertMateria.innerHTML = "";
                this.style.borderColor = "";
            }
        });
    }
    
    if (nombreProfesor) {
        nombreProfesor.addEventListener('input', function() {
            const alertProfesor = document.getElementById('alertProfesor');
            if (this.value.trim().length >= 4) {
                alertProfesor.innerHTML = "";
                alertProfesor.style.color = "green";
                this.style.borderColor = "green";
            } else if (this.value.trim().length > 0) {
                alertProfesor.innerHTML = "⚠️ Mínimo 3 caracteres";
                alertProfesor.style.color = "orange";
                this.style.borderColor = "orange";
            } else {
                alertProfesor.innerHTML = "";
                this.style.borderColor = "";
            }
        });
    }
});