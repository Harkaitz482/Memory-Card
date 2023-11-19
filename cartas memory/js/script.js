////////// VARIABLES 
let bestAttempt = document.getElementById('bestAttempt');
// numero total de cartas que se van a crear 
const totalCards = 16;
// array de imagenes , con las imagenes de las cartas cuando estan bocaarriba 
const availableCards = [
   './images/imagenes/Charco Tacoron - El Hierro.jpg',
   './images/imagenes/La Graciosa G.png',
   './images/imagenes/La Maceta el Hierro.jpg',
   './images/imagenes/La Palma.jpg',
   './images/imagenes/La Palma2.jpg',
   './images/imagenes/Laurisilva La Gomera.png',
   './images/imagenes/Playa Cofete  FTV.png',
   './images/imagenes/Roque Nublo GC.png',
   './images/imagenes/Teide TNF.png',
   './images/imagenes/Timanfaya  LNZ.png'
];

const cards = [];
// Es una array que uso para llevar el registro de que carta/as estan seleccionadas 
const selectedCards = [];
// Es un array que uso  para llevar el registro de los valores de las cartas para poder comparar las parejas 
const valuesUsed = [];
//  Numero de movimientos que llevba el usuario 
let currentMove = 0;
// Numero de intentos que lleva el usuario 
let currentAttempts = 0;
//  div class back es el revers de la carta 
// div class face es la cara de la cara (Imagenes de las islas)
// div class card es una clase para señalizar la carta en el juego 
const cardTemplate = '<div class="card"><div class="back"></div><div class="face"></div></div>';
const gameContainer = document.querySelector('#game');
const statsContainer = document.querySelector('#stats');
// ///// FUNCIONES
//   funcion que "levanta" la carta 
function activate(e) {
   // Verifica si el número de movimientos actuales es menor que 2
   if (currentMove < 2) {
      // Verifica si no hay una primera tarjeta seleccionada o si la tarjeta actual no es igual a la primera
      if (!selectedCards[0] || selectedCards[0] !== e.target && !e.target.classList.contains('active')) {
         // Agrega la clase 'active' a la tarjeta actual
         e.target.classList.add('active');
         // Agrega la tarjeta actual al array de tarjetas seleccionadas
         selectedCards.push(e.target);
         // Incrementa el número de movimientos actuales
         currentMove++;

         // Si se han realizado 2 movimientos
         if (currentMove === 2) {
            // Incrementa el contador de intentos
            currentAttempts++;
            // Actualiza el elemento HTML con el contador de intentos
            statsContainer.innerHTML = `${currentAttempts} intentos`;

            // Obtiene las URLs de fondo de las dos tarjetas seleccionadas
            const [face1, face2] = selectedCards.map(card => card.querySelector('.face').style.backgroundImage);

            // Compara las URLs de fondo para verificar si las dos tarjetas son iguales
            if (face1 === face2) {
               // Si son iguales, se reinician las tarjetas seleccionadas y los movimientos actuales
               selectedCards.length = 0;
               currentMove = 0;
               checkAllCardsFlipped();
               

               if (localStorage.getItem('cowabonga') === null || localStorage.getItem('cowabonga') > currentAttempts) {
                  localStorage.removeItem('cowabonga');
                  localStorage.setItem('cowabonga', currentAttempts);
               }
               //  face1 contiene la URL de la isla
               const islandInfo = getIslandInfo(face1);
               // llamo a la funcion que abre el modal 
               openModal(face1, islandInfo.name, islandInfo.info);
            } else {
               // Si no son iguales, se espera  2 segundos y luego se ocultan las tarjetas seleccionadas
               setTimeout(() => {
                  selectedCards.forEach(card => card.classList.remove('active'));
                  selectedCards.length = 0;
                  currentMove = 0;

               }, 2000);
            }
         }
      }
   }
  
}

function checkAllCardsFlipped() {
   const allCardsFlipped = selectedCards.every(card => card.classList.contains('active'));

   if (allCardsFlipped) {
      console.log('¡Todas las cartas están dadas vuelta!');
      // Puedes realizar otras acciones aquí si es necesario
   }
}

//   funcion que cogue un valor random 
function randomValue() {
   let random;
   do {
      random = Math.floor(Math.random() * totalCards * 0.5);
   } while (valuesUsed.filter(value => value === random).length >= 2);
   valuesUsed.push(random);
}
//  funcion que agarra el valor de la carta cuando esta esta boca arriba 
function getFaceValue(value) {
   return availableCards[value] || value;
}
//  funcion que crea las cartas  y tambien compara el valor de las cartas por el url 
function createCard() {
   // Se crea un nuevo elemento div 
   const div = document.createElement('div');
   // Se estable el div con el template que le da la parte boca abajo y boca arriba 
   div.innerHTML = cardTemplate;
   // la tarjeta creada se manda al array 
   cards.push(div);
   // se manda al "game container"
   gameContainer.append(div);
   // llama a la funcion random value para sacar el valor 
   randomValue();
   //  se le manda el fondo de la carta y se le asigna el url 
   div.querySelector('.face').style.backgroundImage = `url("${getFaceValue(valuesUsed[cards.length - 1])}")`;
   // se agrega un evento de click , para llamar a la funcion activate 
   div.querySelector('.card').addEventListener('click', activate);
}
// bucle crea todas las tarjetas llamando repetidamente a la función 
for (let i = 0; i < totalCards; i++) {
   createCard();
}

function openModal(imageUrl, islandName, islandInfo) {
   const modal = document.getElementById('modal');
   const modalImage = document.getElementById('modalImage');
   const modalTitle = document.getElementById('modalTitle');
   const modalInfo = document.getElementById('modalInfo');

   const decodedUrl = decodeURIComponent(imageUrl.replace('url("', '').replace('")', ''));
   modalImage.src = decodedUrl;

   // Agrega una clase a la imagen del modal
   modalImage.classList.add('modal-image');

   modalTitle.innerText = islandName;
   modalInfo.innerText = islandInfo;

   modal.style.display = 'block';
}

// Función para cerrar la ventana modal
function closeModal() {
   const modal = document.getElementById('modal');
   modal.style.display = 'none';
}

function getIslandInfo(imageUrl) {
   // Suponemos que el nombre de la isla está en el formato "Nombre de la Isla.extensión"
   const islandName = imageUrl.split('/').pop().split('.')[0];

   // Mapea nombres de islas conocidos a información correspondiente
   const islandInfoMap = {
      'Charco Tacoron - El Hierro': { name: 'El Hierro', info: 'El Hierro ha sido declarada Reserva de la Biosfera por la UNESCO debido a su compromiso con la sostenibilidad y la conservación del medio ambiente. La isla ha implementado políticas ecológicas y de energía renovable, incluyendo un innovador sistema de generación de energía a partir de fuentes renovables.' },
      'La Graciosa G': { name: 'La Graciosa', info: 'La Graciosa es la isla más pequeña del archipiélago de las Islas Canarias y se encuentra al norte de Lanzarote, es famosa por su ambiente tranquilo y relajado. Al no permitirse el acceso de automóviles particulares en la isla (excepto vehículos de servicio), la contaminación y el ruido son prácticamente inexistentes.Está rodeada por una reserva marina, lo que la convierte en un lugar excepcional para el buceo, snorkel y la observación de la vida marina. Además forma parte de la Reserva de la Biosfera del Archipiélago Chinijo, que incluye varios islotes cercanos. Esta designación destaca su importancia ecológica y la conservación de su entorno natural.' },
      'La Maceta el Hierro': { name: 'El Hierro', info: 'El Sabinar es uno de los bosques de sabinas más antiguos de Europa. Estos árboles retorcidos por la acción de los vientos alisios son un elemento distintivo del paisaje de la isla.' },
      'La Palma': { name: 'La Palma', info: 'La Palma se conoce comúnmente como "La Isla Bonita" debido a su asombrosa belleza natural, que incluye impresionantes paisajes, acantilados y exuberante vegetación.La Palma es uno de los mejores lugares del mundo para la observación de estrellas, gracias a su cielo limpio y su baja contaminación lumínica. El Observatorio del Roque de los Muchachos es uno de los principales observatorios astronómicos del hemisferio norte.' },
      'La Palma2': { name: 'La Palma', info: 'El Bosque de los Tilos es un lugar mágico, conocido por su laurisilva y por el impresionante sendero de Los Tiles, que lleva a través de un paisaje de cuento de hadas con árboles cubiertos de musgo y helechos.' },
      'Laurisilva La Gomera': { name: 'La Gomera', info: 'La laurisilva es un bosque subtropical húmedo que se caracteriza por su exuberante vegetación, que incluye árboles perennes de hojas verdes brillantes, helechos, musgos y líquenes. Estos bosques suelen estar envueltos en niebla y reciben una cantidad significativa de lluvia, lo que contribuye a su biodiversidad. Ha sido declarado Patrimonio de la Humanidad por la UNESCO.' },
      'Playa Cofete  FTV': { name: 'Fuerteventura', info: 'Fuerteventura es famosa por sus impresionantes playas de arena dorada que se extienden a lo largo de la costa. Algunas de las más populares incluyen Playa de Corralejo, Playa de Sotavento y Playa de Cofete.Fuerteventura tiene un paisaje volcánico único, con vastas extensiones de lava petrificada que se asemejan a un desierto lunar.Gran parte de Fuerteventura ha sido declarada Reserva de la Biosfera por la UNESCO debido a su singularidad ecológica. Encontrarás una amplia variedad de ecosistemas, desde playas hasta dunas y zonas desérticas.La Isla de Lobos es una pequeña isla volcánica ubicada al norte de Fuerteventura, declarada Parque Natural para proteger su belleza y biodiversidad. Se caracteriza por su paisaje volcánico, playas vírgenes, aguas cristalinas y una gran cantidad de vida marina. Tiene su origen en la presencia de lobos marinos en la zona. Estos animales, conocidos como "lobos marinos," eran comunes en las aguas circundantes a la isla.' },
      'Roque Nublo GC': { name: 'Gran Canaria', info: 'Uno de los puntos destacados de la isla son las Dunas de Maspalomas, un paisaje de dunas de arena que se extiende hasta el mar y se asemeja a un desierto.En el centro de la isla se encuentra el Parque Nacional de Garajonay, declarado Patrimonio de la Humanidad por la UNESCO. Es un bosque de laurisilva subtropical con una gran biodiversidad.La ciudad de Las Palmas, la capital de la isla, cuenta con un casco antiguo encantador con arquitectura colonial bien conservada, como la Casa de Colón, un museo que rinde homenaje a Cristóbal Colón.La isla es conocida por tener una gran variedad de microclimas debido a su topografía diversa. Puedes encontrar desde zonas desérticas hasta áreas montañosas con temperaturas más frescas.' },
      'Teide TNF': { name: 'Tenerife', info: 'Tiene el Pico del Teide que es el pico más alto de España y uno de los volcanes más grandes del mundo. El Parque Nacional del Teide es un destino imprescindible para los amantes de la naturaleza y ofrece una gran variedad de senderos y vistas panorámicas espectaculares. Gran parte de la isla ha sido declarada Reserva de la Biosfera por la UNESCO debido a su diversidad natural y sus esfuerzos de conservación.Las aguas alrededor de Tenerife son un lugar importante para la observación de ballenas y delfines.' },
      'Timanfaya  LNZ': { name: 'Lanzarote', info: 'El Parque Nacional de Timanfaya es el parque nacional más destacado de la isla de Lanzarote, que forma parte de las Islas Canarias en España. Este parque nacional es famoso por su paisaje volcánico y lunar. Timanfaya se creó como resultado de una serie de erupciones volcánicas que ocurrieron entre 1730 y 1736, y aún se considera una zona geotérmica activa.En el Parque Nacional de Timanfaya, los visitantes pueden admirar una variedad de formaciones volcánicas, campos de lava, cráteres y cenizas. El suelo es cálido debido a la actividad geotérmica, lo que ha llevado a la creación del "Restaurante El Diablo", donde la comida se cocina utilizando el calor natural del subsuelo.' },
   };

   // Busca la información de la isla en el mapa
   const islandInfo = islandInfoMap[islandName] || {};

   return { name: islandInfo.name || 'Nombre Desconocido', info: islandInfo.info || 'Información no disponible.' };
}

window.addEventListener('DOMContentLoaded', () => {
   const bestAttemptElement = document.getElementById('bestAttempt');

   if (localStorage.getItem('cowabonga')) {
      let bestTry = localStorage.getItem('cowabonga');
      bestAttemptElement.innerText = `El menor número de intentos es ${bestTry}`;
   }
});