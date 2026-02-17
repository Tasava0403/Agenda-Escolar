// ======= Helpers de storage =======
const STORAGE_KEY = "tareas_agenda";

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ======= Utilidades =======
function formatDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function badgeHtml(estado) {
  if (estado === "Hecho") return `<span class="badge text-bg-success">Hecho</span>`;
  return `<span class="badge text-bg-warning">Pendiente</span>`;
}

// ======= LISTA (index.html) =======
function initIndex() {
  const tasksBody = document.getElementById("tasksBody");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");

  if (!tasksBody) return; // no estamos en index

  let tasks = loadTasks();

  // Si no hay nada guardado, mete 2 ejemplos (solo la primera vez)
  if (tasks.length === 0) {
    tasks = [
      { id: crypto.randomUUID(), materia: "Matemáticas", tarea: "Ejercicios pág 20", fecha: "2026-02-10", estado: "Pendiente", nota: "" },
      { id: crypto.randomUUID(), materia: "Inglés", tarea: "Reading", fecha: "2026-02-12", estado: "Hecho", nota: "" }
    ];
    saveTasks(tasks);
  }

  // Modales
  const modalVerEl = document.getElementById("modalVer");
  const modalDeleteEl = document.getElementById("modalDelete");
  const modalVer = modalVerEl ? new bootstrap.Modal(modalVerEl) : null;
  const modalDelete = modalDeleteEl ? new bootstrap.Modal(modalDeleteEl) : null;

  let deleteId = null;

  function render(list) {
    tasksBody.innerHTML = "";

    if (!list.length) {
      emptyState.classList.remove("d-none");
      return;
    }
    emptyState.classList.add("d-none");

    for (const t of list) {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td class="fw-semibold">${t.materia}</td>
        <td>${t.tarea}</td>
        <td>${formatDate(t.fecha)}</td>
        <td>${badgeHtml(t.estado)}</td>
        <td class="text-end">
          <button class="btn btn-primary btn-sm me-2" data-action="ver" data-id="${t.id}">
            Ver
          </button>
          <button class="btn btn-danger btn-sm" data-action="borrar" data-id="${t.id}">
            Borrar
          </button>
        </td>
      `;
      tasksBody.appendChild(tr);
    }
  }

  function getFiltered() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(t =>
      t.materia.toLowerCase().includes(q) || t.tarea.toLowerCase().includes(q)
    );
  }

  // Eventos tabla (delegación)
  tasksBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;
    const task = tasks.find(x => x.id === id);
    if (!task) return;

    if (action === "ver") {
      document.getElementById("vMateria").textContent = task.materia;
      document.getElementById("vTarea").textContent = task.tarea;
      document.getElementById("vFecha").textContent = formatDate(task.fecha);
      document.getElementById("vEstado").textContent = task.estado;
      document.getElementById("vNota").textContent = task.nota ? task.nota : "—";
      modalVer?.show();
    }

    if (action === "borrar") {
      deleteId = id;
      modalDelete?.show();
    }
  });

  // Confirmar borrar
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  confirmDeleteBtn?.addEventListener("click", () => {
    if (!deleteId) return;
    tasks = tasks.filter(t => t.id !== deleteId);
    saveTasks(tasks);
    deleteId = null;
    modalDelete?.hide();
    render(getFiltered());
  });

  // Buscar
  searchInput?.addEventListener("input", () => render(getFiltered()));
  clearSearch?.addEventListener("click", () => {
    searchInput.value = "";
    render(tasks);
  });

  // Render inicial
  render(tasks);
}

// ======= REGISTRO (registro.html) =======
function initRegistro() {
  const form = document.getElementById("taskForm");
  if (!form) return; // no estamos en registro

  const materia = document.getElementById("materia");
  const tarea = document.getElementById("tarea");
  const fecha = document.getElementById("fecha");
  const estado = document.getElementById("estado");
  const nota = document.getElementById("nota");

  const modalSavedEl = document.getElementById("modalSaved");
  const modalSaved = modalSavedEl ? new bootstrap.Modal(modalSavedEl) : null;

  // Fecha por defecto = hoy
  if (fecha && !fecha.value) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    fecha.value = `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validación Bootstrap
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const tasks = loadTasks();

    const newTask = {
      id: crypto.randomUUID(),
      materia: materia.value.trim(),
      tarea: tarea.value.trim(),
      fecha: fecha.value,
      estado: estado.value,
      nota: (nota.value || "").trim()
    };

    tasks.unshift(newTask);
    saveTasks(tasks);

    // Modal "guardado"
    modalSaved?.show();

  });
}

// ======= Init según página =======
document.addEventListener("DOMContentLoaded", () => {
  initIndex();
  initRegistro();
});
