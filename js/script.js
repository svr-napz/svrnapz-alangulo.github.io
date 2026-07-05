const formulario = document.querySelector("#form-opinion");

const inputNombre = document.querySelector("#nombre");

const inputEquipo = document.querySelector("#equipo");

const inputOpinion = document.querySelector("#opinion_texto");

const listaOpiniones = document.querySelector("#lista-opiniones");

const contador = document.querySelector("#contador-opiniones");

const opiniones = [];

function renderOpiniones(){
    contador.textContent =
    `Total de opiniones: ${opiniones.length}`;
    listaOpiniones.innerHTML = opiniones.map(function(opinion){
        return `
            <article class="card-opinion">
                <h4>${opinion.nombre}</h4>
                <p>
                    <strong>Equipo favorito:</strong>
                    ${opinion.equipo}
                </p>
                <p>
                    ${opinion.comentario}
                </p>
            </article>
        `;
    }).join("");
}

formulario.addEventListener("submit", function(event){

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