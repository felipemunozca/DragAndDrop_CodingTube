
const TARJETAS = 10;

for (let i = 0; i < TARJETAS; i++) {
    let id = obtenerIdRandom(151);
    buscarPokemonPorId(id);
}

function obtenerIdRandom(max){
    return Math.floor(Math.random()*max)+1;
}

let arregloPokeImagen = [];
let arregloPokeNombre = [];
let puntos = 0;
let arrastrarElementos = document.querySelector('.drag-elements');
let soltarElementos = document.querySelector('.drop-elements');
let mensajeError = document.querySelector('.wrong');


async function buscarPokemonPorId(id){
    const resultado = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const data = await resultado.json();
    //console.log(data);

    arregloPokeImagen.push(data);
    arregloPokeNombre.push(data.name);
    arregloPokeNombre = arregloPokeNombre.sort(() => Math.random()-0.5);

    arrastrarElementos.innerHTML = '';
    soltarElementos.innerHTML = '';

    arregloPokeImagen.forEach(item => {
        //console.log(item);
        arrastrarElementos.innerHTML += `
        <div class="pokemon">
            <img id="${item.name}" draggable="true" class="image" src="${item.sprites.other['official-artwork'].front_default}" alt="">
        </div>`
    });

    arregloPokeNombre.forEach(item => {
        soltarElementos.innerHTML += `
        <div class="names">
            <p>${item}</p>
        </div>`
    });

    let arregloSprites = document.querySelectorAll('.image');
    arregloSprites = [...arregloSprites];
    arregloSprites.forEach(item => {
        item.addEventListener('dragstart', event => {
            //console.log('arrastro imagen');
            event.dataTransfer.setData('text', event.target.id)
        })
    })

    let arregloNames = document.querySelectorAll('.names');
    arregloNames = [...arregloNames];
    arregloNames.forEach(item => {

        item.addEventListener('dragover', event => {
            event.preventDefault();
            //console.log('tomo la imagen');
        });

        item.addEventListener('drop', event => {
             //console.log('suelto la imagen');
            const imagenElementData = event.dataTransfer.getData('text');

            let pokemonId = document.querySelector(`#${imagenElementData}`);

            if (event.target.innerText == imagenElementData) {
                //console.log('Si son iguales');
                mensajeError.innerHTML = '';
                event.target.innerHTML = '';
                event.target.appendChild(pokemonId);
                puntos++;

                if (puntos == TARJETAS) {
                    arrastrarElementos.innerHTML = `
                    <p class="win">¡Ganaste!</p>`
                }

            } else {
                //console.log('Error');
                mensajeError.innerHTML = 'El nombre no es correcto, vuelve a intentarlo';
            }
        });
    });

}