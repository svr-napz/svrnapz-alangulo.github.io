const formulario = document.querySelector("#form-opinion");

const inputNombre = document.querySelector("#nombre");

const inputEquipo = document.querySelector("#equipo");

const inputOpinion = document.querySelector("#opinion_texto");

const listaOpiniones = document.querySelector("#lista-opiniones");

const contador = document.querySelector("#contador-opiniones");

const opiniones = [];

const buscador = document.querySelector("#buscador");

const noticias = document.querySelectorAll(".card-noticia");

const contadorNoticias = document.querySelector("#contador-noticias");

const menu = document.querySelector("#menu-toggle");

const nav = document.querySelector(".nav-menu");

menu.addEventListener("click", () => {
    nav.classList.toggle("active");
    if (nav.classList.contains("active")) {
        menu.textContent = "✕";
        menu.setAttribute("aria-expanded", "true");
    } else {
        menu.textContent = "☰";
        menu.setAttribute("aria-expanded", "false");
    }
});

function renderOpiniones() {
    contador.textContent =
        `Total de opiniones: ${opiniones.length}`;
    listaOpiniones.innerHTML = opiniones.map(function (opinion, indice) {
        return `
        <article class="card-opinion">
        <h4>${opinion.nombre}</h4>
        <p><strong>Equipo favorito:</strong>${opinion.equipo}</p>
        <p>${opinion.comentario}</p>
        <button class="btn-eliminar" data-id="${indice}"> Eliminar</button>
        </article>
`;
    }).join("");
}

formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    const nombre = inputNombre.value;
    const equipo = inputEquipo.value;
    const comentario = inputOpinion.value;
    const nuevaOpinion = {
        nombre: nombre,
        equipo: equipo,
        comentario: comentario
    };
    opiniones.push(nuevaOpinion);
    renderOpiniones();
    console.log(opiniones);
    formulario.reset();
});

listaOpiniones.addEventListener("click", function (event) {
    const boton = event.target.closest(".btn-eliminar");
    if (!boton) {
        return;
    }
    const indice = boton.dataset.id;
    opiniones.splice(indice, 1);
    renderOpiniones();
});

buscador.addEventListener("input", function () {
    const texto = buscador.value.toLowerCase();
    let visibles = 0;
    noticias.forEach(function (noticia) {
        const contenido =
            noticia.textContent.toLowerCase();
        if (contenido.includes(texto)) {
            noticia.style.display = "block";
            visibles++;
        } else {
            noticia.style.display = "none";
        }

    });
    contadorNoticias.textContent =
        `Noticias encontradas: ${visibles}`;
});


const slides = document.querySelectorAll(".slide");

let indice = 0;

function cambiarSlide() {

    slides[indice].classList.remove("activo");

    indice++;

    if (indice >= slides.length) {
        indice = 0;
    }

    slides[indice].classList.add("activo");

}
setInterval(cambiarSlide, 4000);


const botonesFavoritos = document.querySelectorAll(".btn-favorito");
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
botonesFavoritos.forEach(boton => {
    const id = boton.dataset.id;
    if (favoritos.includes(id)) {
        boton.classList.add("activo");
        boton.textContent = "♡ Guardado";
    }
    boton.addEventListener("click", () => {
        if (favoritos.includes(id)) {
            favoritos = favoritos.filter(f => f !== id);
            boton.classList.remove("activo");
            boton.textContent = "♡ Favorito";
        } else {
            favoritos.push(id);
            boton.classList.add("activo");
            boton.textContent = "♡ Guardado";
        }
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    });
});

async function cargarJugador(nombre, ids) {
    try {
        const respuesta = await fetch(
            `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(nombre)}`
        );
        const datos = await respuesta.json();
        const jugador = datos.player[0];
        document.getElementById(ids.img).src = jugador.strThumb;
        document.getElementById(ids.equipo).textContent = jugador.strTeam;
        document.getElementById(ids.pais).textContent = jugador.strNationality;
        document.getElementById(ids.posicion).textContent = jugador.strPosition;
    } catch (error) {

        console.error(error);
    }
}
cargarJugador("Lionel Messi", {
    img: "messi-img",
    equipo: "messi-equipo",
    pais: "messi-pais",
    posicion: "messi-posicion"
});

cargarJugador("Cristiano Ronaldo", {
    img: "cr7-img",
    equipo: "cr7-equipo",
    pais: "cr7-pais",
    posicion: "cr7-posicion"
});