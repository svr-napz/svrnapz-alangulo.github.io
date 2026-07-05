const formulario = document.querySelector("#form-opinion");

const inputNombre = document.querySelector("#nombre");

const inputEquipo = document.querySelector("#equipo");

const inputOpinion = document.querySelector("#opinion_texto");

const opiniones = [];

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

    console.log(opiniones);

    formulario.reset();

});