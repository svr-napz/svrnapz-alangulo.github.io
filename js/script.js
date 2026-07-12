// --- 1. SELECCIÓN DE ELEMENTOS DEL DOM ---
const menu = document.querySelector("#menu-toggle");
const nav = document.querySelector(".nav-menu");
const formulario = document.querySelector("#form-opinion");
const inputNombre = document.querySelector("#nombre");
const inputEquipo = document.querySelector("#equipo");
const inputOpinion = document.querySelector("#opinion_texto");
const listaOpiniones = document.querySelector("#lista-opiniones");
const contadorOpiniones = document.querySelector("#contador-opiniones");
const buscador = document.querySelector("#buscador");
const noticias = document.querySelectorAll(".card-noticia");
const contadorNoticias = document.querySelector("#contador-noticias");
const botonesFiltro = document.querySelectorAll(".btn-filtro");

// Elementos de la Ventana Modal
const modal = document.querySelector("#modal-noticia");
const contenidoModal = document.querySelector("#contenido-modal");
const cerrarModal = document.querySelector("#cerrar-modal");

// --- 2. BASE DE DATOS LOCAL PARA NOTICIAS EXTENDIDAS ---
const baseNoticias = {
    "0": "El FC Barcelona consolida su liderato en La Liga tras una jornada redonda. Mientras los azulgranas vencieron con autoridad en su encuentro, el Real Madrid tropezó inesperadamente como visitante, dejando escapar 3 puntos vitales. Analistas deportivos sugieren que la rotación de plantilla y la solidez defensiva impuesta por el cuerpo técnico son las claves de este éxito rotundal.",
    "1": "Las noches mágicas de la Champions League están de regreso. Los emparejamientos de cuartos de final prometen ser de los más reñidos de la década, con choques directos entre los máximos favoritos del torneo. Los equipos ingleses y españoles buscan imponer su hegemonía en una competición europea donde nunca se puede dar nada por sentado.",
    "2": "¡Arranque electrizante en la NBA! Los Playoffs han comenzado con sorpresas mayúsculas en la conferencia oeste. El juego físico en la pintura y una efectividad superior al 45% en tiros de tres puntos le permitieron a los Lakers asegurar el primer partido de la serie, desatando la euforia de sus aficionados de cara al campeonato."
};

// --- 3. ESTADO DE LA APLICACIÓN (Carga inicial desde LocalStorage) ---
let opiniones = JSON.parse(localStorage.getItem("opiniones_alangulo")) || [];

// --- 4. FUNCIONES MODULARES ---

// Renderizar la tribuna de opiniones
function renderOpiniones() {
    contadorOpiniones.textContent = `Total de opiniones: ${opiniones.length}`;

    if (opiniones.length === 0) {
        listaOpiniones.innerHTML = `<p class="no-comments">Sé el primero en dejar tu análisis en la tribuna...</p>`;
        return;
    }

    listaOpiniones.innerHTML = opiniones.map((opinion, indice) => `
        <article class="card-opinion">
            <h4>${escapeHTML(opinion.nombre)}</h4>
            <p><strong>Equipo favorito:</strong> ${escapeHTML(opinion.equipo)}</p>
            <p>${escapeHTML(opinion.comentario)}</p>
            <button class="btn-eliminar" data-id="${indice}">❌ Eliminar</button>
        </article>
    `).join("");
}

// Guardar datos persistentemente
function guardarEnLocalStorage() {
    localStorage.setItem("opiniones_alangulo", JSON.stringify(opiniones));
}

// Función de seguridad para evitar inyección de código (XSS)
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
}

// --- 5. MANEJADORES DE EVENTOS (LISTENERS) ---

// Menú Responsive Activo
menu.addEventListener("click", () => {
    const isActive = nav.classList.toggle("active");
    menu.setAttribute("aria-expanded", isActive);
    menu.innerHTML = isActive ? "✖" : "☰";
});

// Enviar Opinión (Formulario)
formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const nuevaOpinion = {
        nombre: inputNombre.value.trim(),
        equipo: inputEquipo.value.trim(),
        comentario: inputOpinion.value.trim()
    };

    opiniones.push(nuevaOpinion);
    guardarEnLocalStorage();
    renderOpiniones();
    formulario.reset();
});

// Eliminar Opinión (Delegación de Eventos)
listaOpiniones.addEventListener("click", (event) => {
    const boton = event.target.closest(".btn-eliminar");
    if (!boton) return;

    const indice = boton.dataset.id;
    opiniones.splice(indice, 1);
    guardarEnLocalStorage();
    renderOpiniones();
});

// Buscador de Noticias en tiempo real
buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase();
    let visibles = 0;

    noticias.forEach(noticia => {
        const contenido = noticia.textContent.toLowerCase();
        // Verifica si cumple con el texto buscado
        if (contenido.includes(texto)) {
            noticia.style.display = "block";
            visibles++;
        } else {
            noticia.style.display = "none";
        }
    });

    // Reiniciar los botones de filtro si se realiza una búsqueda general
    botonesFiltro.forEach(b => b.classList.remove("active"));
    botonesFiltro[0].add("active"); // Activa el botón 'Todos'

    contadorNoticias.textContent = `Noticias encontradas: ${visibles}`;
});

// Filtros / Cambios de Vista Opcionales (Multideporte)
botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        botonesFiltro.forEach(b => b.classList.remove("active"));
        boton.classList.add("active");

        const deporteSeleccionado = boton.dataset.deporte;
        let visibles = 0;

        noticias.forEach(noticia => {
            const deporteNoticia = noticia.dataset.deporte;

            if (deporteSeleccionado === "todos" || deporteNoticia === deporteSeleccionado) {
                noticia.style.display = "block";
                visibles++;
            } else {
                noticia.style.display = "none";
            }
        });

        contadorNoticias.textContent = `Noticias encontradas: ${visibles}`;
        if (buscador) buscador.value = ""; // Limpia el buscador al cambiar de vista
    });
});

// Control de la Ventana Modal (Leer Más)
document.querySelector("#noticias").addEventListener("click", (event) => {
    const link = event.target.closest(".read-more");
    if (!link) return;

    event.preventDefault();
    const idNoticia = link.dataset.noticia;

    if (baseNoticias[idNoticia]) {
        contenidoModal.textContent = baseNoticias[idNoticia];
        modal.showModal(); // Método nativo de HTML5 Dialog
    }
});

cerrarModal.addEventListener("click", () => {
    modal.close();
});

// --- 6. EJECUCIÓN INICIAL ---
// Cuenta cuántas noticias hay al abrir la página y carga los comentarios guardados
contadorNoticias.textContent = `Noticias encontradas: ${noticias.length}`;
renderOpiniones();