/**
 * Para este ejercicio se utilizará la pokeApi sacada directamente desde su página web https://pokeapi.co/
 * Para consumir la API se debe utilizar un fetch (significa búsqueda).
 * 
 * Ejemplo de cómo consumir la API:
 * fetch('https://pokeapi.co/api/v2/pokemon/1/')
 * .then(res => res.json())
 * .then(data => console.log(data)) 
 */

/**
 * Se define una constante para indicar la cantidad de pokemon que se traerán desde la API.
 * Para este ejercicio, es recomendable colocar el nombre de la constante en mayúsculas.
 */
const TARJETAS = 10;

/**
 * Se crea un ciclo for para recorrer un arreglo en base a la cantidad de tarjetas de pokemon que se quiera imprimir en pantalla.
 * Se pasa como parámetro la cantidad máxima de ids (nombres de pokemon) que se traerán desde la API. Para la primera generación son 151.
 * se declara una nueva función que sera asincronica, a la que se le pasara el id.
 */
for (let i = 0; i < TARJETAS; i++) {
    let id = obtenerIdRandom(151);
    buscarPokemonPorId(id);
}

/**
 * Se crea una función obtenerIdRandom utilizando:
 * método math.random() para traer de forma aleatoria un numero dentro de un rango definido entre 0 y 1.
 * método math.floor redondea un numero con decimales al entero que este mas abajo.
 */
function obtenerIdRandom(max){
    return Math.floor(Math.random()*max)+1;
}


/**
 * Declaracion de variables.
 * arregloPokeImagen: arreglo vacío en donde se agregara la data de los pokemones buscados.
 * arregloPokeNombre: arreglo vacío para almacenar los nombres de cada pokemon.
 * puntos: variable para llevar el conteo de aciertos del jugador.
 * arrastrarElementos: variable para conectar con la clase del html de las imágenes.
 * soltarElementos: variable para conectar con la clase del html de los nombres.
 * mensajeError: variable para agregar un mensaje cuando el usuario se equivoque al arrastrar una imagen a un nombre.
 */
let arregloPokeImagen = [];
let arregloPokeNombre = [];
let puntos = 0;
let arrastrarElementos = document.querySelector('.drag-elements');
let soltarElementos = document.querySelector('.drop-elements');
let mensajeError = document.querySelector('.wrong');

/**
 * Se declara la función para buscar Pokemon por id, la cual será asincrónica.
 * La constante resultado espera a que se produzcan la conexión hacia la API. Además se declara entre ${} el id que se está recibiendo.
 * La constante data espera la información obtenida desde resultado, la cual se convertirá posteriormente en un json().
 */
async function buscarPokemonPorId(id){
    const resultado = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const data = await resultado.json();
    //console.log(data);

    /**
     * Se agrega la data a los arreglos vacíos utilizando el método .push()
     * Otra forma de agregar la data a un arreglo vacío, es escribiendo directamente la información que se necesita, evitando recargar toda la data cuando solo se necesita un valor, por ejemplo, solo cargar el nombre (name).
     * Si se imprimen los nombres en el html en este momento, estarán en el mismo orden que las imágenes, ya que están siendo llamados por el orden del id desde la API.
     * La idea es que los nombres aparezcan desordenados, para esto se debe utilizar el método .sort().
     */
    arregloPokeImagen.push(data);
    arregloPokeNombre.push(data.name);
    arregloPokeNombre = arregloPokeNombre.sort(() => Math.random()-0.5);

    /**
     * El arreglo se repetirá tantas veces como la cantidad de id designados, por lo que para evitar que se repitan las imágenes, 
     * se debe indicar al html que limpie la pantalla y que solo agregue las imágenes de la última iteración del ciclo.
     */
    arrastrarElementos.innerHTML = '';
    soltarElementos.innerHTML = '';

    /**
     * Se utiliza un forEach() para recorrer el arreglo.
     * "item" es el parámetro que se usara para obtener los valores obtenidos de recorrer la información.
     * Mediante la propiedad innerHTML se agrega código html directamente a la página.
     * Si se utiliza innerHTML junto al signo = la imagen se imprimirá solo 1 vez ya que el diseño se ira sobrescribiendo, para lograr que se impriman todas las imágenes del arreglo, se debe agregar +=
     * DATO: dentro de la etiqueta img, se debe agregar el atributo draggable como "true", para poder arrastrar el contenido de la etiqueta.
     * Se debe agregar la propiedad id a la etiqueta img, para rescatar el nombre del pokemon. Esta opción será útil después a la hora de comparar la data.
     * DATO IMPORTANTE: cuando una propiedad de la API tiene un guion medio, por ejemplo official-artwork, para poder llamarlo desde JavaScript se debe hacer dentro de corchetes con comilla simple [''].
     */
    arregloPokeImagen.forEach(item => {
        //console.log(item);
        arrastrarElementos.innerHTML += `
        <div class="pokemon">
            <img id="${item.name}" draggable="true" class="image" src="${item.sprites.other['official-artwork'].front_default}" alt="">
        </div>`
    });

    /**
     * Se utiliza un forEach() para recorrer el arreglo.
     * En este caso, los ítem se imprimen directo en el html ya que el arreglo fue llenado desde antes solo con los nombres que es la única información que se necesita en este caso.
     */
    arregloPokeNombre.forEach(item => {
        soltarElementos.innerHTML += `
        <div class="names">
            <p>${item}</p>
        </div>`
    });

    /**
     * Se crea una nueva variable, la cual será igual a la clase “image” de la etiqueta img.
     * Se convierten las imágenes en un arreglo utilizando spread operator [...] esto es una BUENA PRACTICA.
     * Se vuelve a recorrer el nuevo arreglo y por cada uno de los elementos, se agregara un evento dragstart.
     * Se define un evento de transferencia de data, al cual se le debe setear la data para que sea de tipo texto. Luego, el evento debe apuntar al target id. 
     */
    let arregloSprites = document.querySelectorAll('.image');
    arregloSprites = [...arregloSprites];
    arregloSprites.forEach(item => {
        item.addEventListener('dragstart', event => {
            //console.log('arrastro imagen');
            event.dataTransfer.setData('text', event.target.id)
        })
    })

    /**
     * Se crea una nueva variable, la cual será igual a la clase “names” del div donde irán los nombres.
     * Se convierten los nombres en un arreglo utilizando el operador spread [...] esto es una BUENA PRACTICA.
     */
    let arregloNames = document.querySelectorAll('.names');
    arregloNames = [...arregloNames];
    arregloNames.forEach(item => {
        
        /**
         * Se agrega el evento dragover para arrastrar la imagen.
         * Se utiliza preventDefault() para evitar que el evento se sobrecargue al tener la imagen clickeada por mucho tiempo.
         */
        item.addEventListener('dragover', event => {
            event.preventDefault();
            //console.log('tomo la imagen');
        });

        /**
         * Se agrega el evento drop para soltar la imagen.
         * Para poder utilizar el evento drop, primero se debe cancelar el evento dragover.
         * Se crea una nueva constante, para capturar la data que esta llegando con la imagen, la cual se almacenara en formato de texto.
         */
        item.addEventListener('drop', event => {
            //console.log('suelto la imagen');
            const imagenElementData = event.dataTransfer.getData('text');

            /**
             * Se crea una nueva variable, esta apuntara al id que se esta recibiendo desde imagenElementData. 
             * El queryselector ira con backtild `` ya que estara utilizando un numeral# para obtener el valor del id.
             */
            let pokemonId = document.querySelector(`#${imagenElementData}`);

            /**
             * Se crea una validación para determinar si la información obtenida es igual o no.
             * Lo primero es limpiar cualquier mensaje de error que pueda venir desde alguna jugada anterior.
             * Se debe crear una regla para borrar el nombre del pokemon de la casilla una vez que se acierte.
             * Otra regla será agregar la imagen dentro de la casilla. Para esto se utilizara .appendChild() para reemplazar el valor del elemento hijo.
             * Se sumará 1 al contador de puntos por cada jugada correcta.
             * En el caso en que la jugada sea incorrecta, se mostrara un mensaje de error, utilizando la clase error de un párrafo.
             */
            if (event.target.innerText == imagenElementData) {
                //console.log('Si son iguales');
                mensajeError.innerHTML = '';
                event.target.innerHTML = '';
                event.target.appendChild(pokemonId);
                puntos++;

                /**
                 * Si la cantidad de puntos es igual a la cantidad de tarjetas. 
                 * Se agrega un párrafo en la sección de las imágenes indicándole al jugador que gano.
                 */
                if (puntos == TARJETAS) {
                    dragElements.innerHTML = `
                    <p class="win">¡Ganaste!</p>`
                }

            } else {
                //console.log('Error');
                mensajeError.innerHTML = 'El nombre no es correcto, vuelve a intentarlo';
            }
        });
    });

}