// ════════════════════════════════════════════════════════
//  api.js — Módulo compartido entre calendario y eventos
//  Incluir con: <script src="api.js"></script>
// ════════════════════════════════════════════════════════

const API_BASE = 'http://127.0.0.1:8081/api';
const USUARIO_ID = 1; // ← Cambia por el ID del usuario en sesión

// ── Helpers HTTP ─────────────────────────────────────────
async function apiGet(url) {
    const res = await fetch(API_BASE + url);
    if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
    return res.json();
}
async function apiPost(url, body) {
    const res = await fetch(API_BASE + url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`POST ${url} → ${res.status}`);
    return res.json();
}
async function apiPut(url, body) {
    const res = await fetch(API_BASE + url, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`PUT ${url} → ${res.status}`);
    return res.json();
}
async function apiDelete(url) {
    const res = await fetch(API_BASE + url, { method: 'DELETE' });
    if (!res.ok) throw new Error(`DELETE ${url} → ${res.status}`);
}

// ── Endpoints de Eventos ─────────────────────────────────
const EventosAPI = {
    todos:        ()         => apiGet(`/eventos/usuario/${USUARIO_ID}`),
    porId:        (id)       => apiGet(`/eventos/${id}`),
    importantes:  ()         => apiGet(`/eventos/usuario/${USUARIO_ID}/importantes`),
    porCategoria: (cat)      => apiGet(`/eventos/usuario/${USUARIO_ID}/categoria?valor=${cat}`),
    porTipo:      (tipo)     => apiGet(`/eventos/usuario/${USUARIO_ID}/tipo?valor=${tipo}`),
    crear:        (body)     => apiPost('/eventos', body),
    actualizar:   (id, body) => apiPut(`/eventos/${id}`, body),
    eliminar:     (id)       => apiDelete(`/eventos/${id}`)
};

// ── Utilidades de fecha ──────────────────────────────────
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_CORTOS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

function fmtHora(dt)       { return new Date(dt).toTimeString().substring(0,5); }
function fmtFechaCorta(dt) {
    const d = new Date(dt);
    return `${DIAS_CORTOS[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')} ${MESES[d.getMonth()].substring(0,3)}`;
}
function fmtFechaLarga(dt) {
    const d = new Date(dt);
    return `${d.getDate()} de ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}
function isoLocal(dt)      { return new Date(dt).toISOString().slice(0,16); }
function inicioSemana(ref) {
    const d = new Date(ref); d.setDate(d.getDate()-d.getDay()); d.setHours(0,0,0,0); return d;
}
function finSemana(ref) {
    const d = inicioSemana(ref); d.setDate(d.getDate()+6); d.setHours(23,59,59,999); return d;
}

// ── Color de evento ──────────────────────────────────────
function colorClass(color) {
    const mapa = { rojo:'ev-color-rojo', azul:'ev-color-azul', verde:'ev-color-verde',
                   amarillo:'ev-color-amarillo', morado:'ev-color-morado', naranja:'ev-color-naranja' };
    return mapa[color] || 'ev-color-default';
}

// ── Toast compartido ─────────────────────────────────────
function mostrarToast(tipo, msg) {
    const id  = tipo === 'exito' ? 'toastExito' : 'toastError';
    const mid = tipo === 'exito' ? 'toastExitoMsg' : 'toastErrorMsg';
    const el  = document.getElementById(mid);
    if (el) el.textContent = msg;
    const toast = document.getElementById(id);
    if (toast) new bootstrap.Toast(toast, { delay: 3000 }).show();
}

// ── Navegación entre páginas ─────────────────────────────
function irAProximosEventos(idEvento) {
    window.location.href = idEvento 
        ? `proximos-eventos.html?id=${idEvento}` 
        : 'proximos-eventos.html';
}
function irACalendario(fecha) {
    window.location.href = fecha 
        ? `calendario.html?fecha=${fecha}` 
        : 'calendario.html';
}