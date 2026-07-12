// --- 1. REFERENCIAS DEL DOM ---
const menuToggle = document.querySelector("#menu-toggle");
const navMenu = document.querySelector("#nav-menu");
const vistaHome = document.querySelector("#vista-home");
const vistaArticulo = document.querySelector("#vista-articulo");
const btnVolver = document.querySelector("#btn-volver");

// Elementos del Artículo Dinámico
const artBadge = document.querySelector("#art-badge");
const artTitulo = document.querySelector("#art-titulo");
const artContenido = document.querySelector("#art-contenido");

// Elementos de Opiniones y Filtros
const formulario = document.querySelector("#form-opinion");
const listaOpiniones = document.querySelector("#lista-opiniones");
const contadorOpiniones = document.querySelector("#contador-opiniones");
const buscador = document.querySelector("#buscador");
const noticias = document.querySelectorAll(".card-noticia");
const contadorNoticias = document.querySelector("#contador-noticias");

// CORRECCIÓN: Seleccionamos solo los botones de filtro que están dentro de la sección de vistas-deporte
const botonesFiltro = document.querySelectorAll(".vistas-deporte .btn-filtro");

// --- 2. BASE DE DATOS LOCAL PARA "LEER MÁS" ---
const articulosCompletos = {
    "0": {
        categoria: "Fútbol - La Liga",
        titulo: "El FC Barcelona apunta al título tras tropiezo del Real Madrid",
        cuerpo: "El FC Barcelona se consolida como el candidato número uno para llevarse el trofeo liguero esta temporada. Tras la última derrota del Real Madrid en su visita andaluza, los blaugranas mantienen una ventaja de 7 puntos limpios. El esquema táctico basado en la presión alta y la madurez de sus canteranos ha transformado las flaquezas del inicio de torneo en una máquina coordinada de hacer goles."
    },
    "1": {
        categoria: "Fútbol - Champions League",
        titulo: "Se definen los cuartos de final en noches mágicas de Europa",
        cuerpo: "La UEFA Champions League entra en su fase más electrizante. Los emparejamientos de cuartos de final han dejado llaves históricas: el fútbol inglés medirá sus fuerzas directamente contra la mística de los clubes españoles. Expertos estiman que los plateau de juego de posesión serán puestos a prueba frente a las contras letales que caracterizan este tramo definitivo de la competición."
    },
    "2": {
        categoria: "Básquet - NBA",
        titulo: "Los Lakers dominan en el inicio de los Playoffs de la NBA",
        cuerpo: "Arrancó la verdadera postemporada del baloncesto norteamericano. Con un juego imponente en la pintura y un acierto letal desde la línea de tres puntos, los Angeles Lakers se llevaron el primer juego de la serie frente a sus eternos rivales. El control de los tiempos en el último cuarto evidencia que la experiencia en campeonatos pesa más que la velocidad juvenil en estas instancias."
    },
    "3": {
        categoria: "Fórmula 1 - GP de Mónaco",
        titulo: "GP de Mónaco: Estrategias extremas bajo la lluvia del Principado",
        cuerpo: "Las calles de Montecarlo vivieron una de las carreras más caóticas y espectaculares de los últimos años. La aparición sorpresiva de un fuerte diluvio a mitad de carrera obligó a los ingenieros de pista a tomar decisiones drásticas con los neumáticos intermedios. Los adelantamientos milimétricos rozando las barreras demostraron el talento puro de la parrilla actual de la F1."
    }
};

// --- 3. PERSISTENCIA DE DATOS (LocalStorage) ---
let opiniones = JSON.parse(localStorage.getItem("alangulo_opiniones")) || [];

// --- 4. FUNCIONES MODULARES ---

// Alternar entre la vista principal y la vista del artículo técnico
function cambiarVista(noticiaId) {
    if (noticiaId !== null && articulosCompletos[noticiaId]) {
        // Cargar datos en la sección de artículo
        artBadge.textContent = articulosCompletos[noticiaId].categoria;
        artTitulo.textContent = articulosCompletos[noticiaId].titulo;
        artContenido.textContent = articulosCompletos[noticiaId].cuerpo;

        // Mutar vistas
        vistaHome.style.display = "none";
        vistaArticulo.style.display = "block";
        window.scrollTo(0, 0);
    } else {
        // Regresar al Home
        vistaArticulo.style.display = "none";
        vistaHome.style.display = "block";
    }
}

// Pintar comentarios guardados
function renderOpiniones() {
    if (!contadorOpiniones || !listaOpiniones) return;

    contadorOpiniones.textContent = `Total de opiniones: ${opiniones.length}`;
    if (opiniones.length === 0) {
        listaOpiniones.innerHTML = `<p style="color: grey; font-style: italic;">La tribuna está vacía. ¡Sé el primero en comentar!</p>`;
        return;
    }
    listaOpiniones.innerHTML = opiniones.map((op, i) => `
        <article class="card-opinion" style="border-left: 5px solid #1a2536; margin-bottom: 15px; padding: 10px; background: #fafafa;">
            <h4>${escapeHTML(op.nombre)}</h4>
            <p><strong>Equipo:</strong> ${escapeHTML(op.equipo)}</p>
            <p>${escapeHTML(op.comentario)}</p>
            <button class="btn-eliminar" data-id="${i}" style="background:crimson; color:white; border:none; padding:3px 8px; cursor:pointer; border-radius:4px;">Eliminar</button>
        </article>
    `).join("");
}

function escapeHTML(text) {
    return text.replace(/[&<>'"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[m]));
}

// --- 5. LOGICA DE EVENTOS ---

// Corrección Menú Hamburguesa
if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const expandido = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", !expandido);
        navMenu.classList.toggle("active");
    });
}

// Cerrar menú móvil automáticamente al hacer clic en un enlace de navegación
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        if (navMenu) navMenu.classList.remove("active");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    });
});

// Enrutamiento mediante delegación de eventos al hacer clic en "Leer más"
document.addEventListener("click", (e) => {
    const tarjetaLeerMas = e.target.closest(".read-more");
    if (tarjetaLeerMas) {
        e.preventDefault();
        const id = tarjetaLeerMas.dataset.noticia;
        cambiarVista(id);
    }
});

if (btnVolver) {
    btnVolver.addEventListener("click", (e) => {
        e.preventDefault();
        cambiarVista(null);
    });
}

// Filtros de Vistas (Multideporte)
botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        botonesFiltro.forEach(b => b.classList.remove("active"));
        boton.classList.add("active");

        const deporte = boton.dataset.deporte;
        let contador = 0;

        noticias.forEach(noticia => {
            if (deporte === "todos" || noticia.dataset.deporte === deporte) {
                noticia.style.display = "block";
                contador++;
            } else {
                noticia.style.display = "none";
            }
        });
        if (contadorNoticias) contadorNoticias.textContent = `Noticias encontradas: ${contador}`;
        if (buscador) buscador.value = "";
    });
});

// Buscador Inteligente
if (buscador) {
    buscador.addEventListener("input", () => {
        const termino = buscador.value.toLowerCase();
        let contador = 0;

        // Al buscar, reiniciamos el estado activo de los botones de filtro al botón "Todos"
        botonesFiltro.forEach(b => b.classList.remove("active"));
        const btnTodos = document.querySelector(".vistas-deporte .btn-filtro[data-deporte='todos']");
        if (btnTodos) btnTodos.classList.add("active");

        noticias.forEach(noticia => {
            if (noticia.textContent.toLowerCase().includes(termino)) {
                noticia.style.display = "block";
                contador++;
            } else {
                noticia.style.display = "none";
            }
        });
        if (contadorNoticias) contadorNoticias.textContent = `Noticias encontradas: ${contador}`;
    });
}

// Guardar Comentarios en Formulario
if (formulario) {
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        const nuevaOpinion = {
            nombre: document.querySelector("#nombre").value,
            equipo: document.querySelector("#equipo").value,
            comentario: document.querySelector("#opinion_texto").value
        };
        opiniones.push(nuevaOpinion);
        localStorage.setItem("alangulo_opiniones", JSON.stringify(opiniones));
        renderOpiniones();
        formulario.reset();
    });
}

// Eliminar Comentario
if (listaOpiniones) {
    listaOpiniones.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-eliminar")) {
            const id = e.target.dataset.id;
            opiniones.splice(id, 1);
            localStorage.setItem("alangulo_opiniones", JSON.stringify(opiniones));
            renderOpiniones();
        }
    });
}

// --- 6. ARRANQUE INICIAL ---
renderOpiniones();