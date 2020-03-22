'use-strict';

//VARIABLES SOLO DE JS
let tvShows = [];
let favShows = [];


// VARIABLES DE JS Y HTML
const showsEl = document.querySelector('.js-tvShowDataList');
const favShowsEl = document.querySelector('.js-favListItems');
const textShowEl = document.querySelector('.js-inputText');



//Me traigo la API
const getApiData = function () {
  const inputTextValue = textShowEl.value;
  console.log(inputTextValue);
  console.log('me han clickado y el evento es:', event);
  fetch('http://api.tvmaze.com/search/shows?q=' + inputTextValue) //aquí meto url de api que está especificada en documentación según me espefique en ella.
    .then(response => response.json())
    .then(data => {
      tvShows = data;
      // console.log(data); // es para comprobar que me funciona y cómo recibo la info
      paintTvShows(); // ejecutamos aquí paint products porque es donde se ha generado el array products. y lo pongo debajo del console.log por la asincronía.
      // las dos siguientes líneas son fake
      paintFavShows();

    });
};

//función handler getApiData cuando clicko en Search:

const listenClickSearchBtn = function () {
  const btnSearchEl = document.querySelector('.js-btn');
  btnSearchEl.addEventListener('click', getApiData);
};

const getHTMLShows = function (serie) {
  let accHTML = '';
  // es vacío para que se reinicie cada vez que pase por aquí.
  accHTML += `<li class="js-tvShowDataListItem" id="${serie.show.id}">`;
  //accHTML += `<img src=${serie.show.image.medium} class="js-ShowDataImage" alt="Carátula de ${serie.show.name}" />`;
  accHTML += `<h3>${serie.show.name}</h3>`;
  accHTML += `</li>`;
  return accHTML; //ojo que no se te olvide el return porque sino no te lo pinta.
};

const paintTvShows = function () {
  let accTvShow = '';
  for (let index = 0; index < tvShows.length; index++) {
    accTvShow += getHTMLShows(tvShows[index]);
  }
  showsEl.innerHTML = accTvShow;
  listenClickShowList();

};

//funcion handler shows:
const handlerShowsList = function (event) {
  // console.log('me han clickado y el evento es:', event);
  // console.log('me han clickado y el evento es:', event.currentTarget, event.currentTarget.id);
  // AQUÍ EMPIEZA TU CÓDIGO
  const tvShowClickedId = parseInt(event.currentTarget.id); //traduzco a numero con el parceInt
  const tvShowClickedIndex = tvShows.findIndex(tvShows => tvShows.show.id === tvShowClickedId);
  const tvFavClickedIndex = favShows.findIndex(favShows => favShows.show.id === tvShowClickedId);
  console.log(tvShowClickedIndex, tvFavClickedIndex);

  if (tvFavClickedIndex === -1) { // si no está en fav meto
    // meto con push el tvShow clickado
    // Patri tienes que escribir aquí una sola línea
    favShows.push(tvShows[tvShowClickedIndex])
    console.log(favShows); // para saber que te funciona el siguiente console tiene que [{...}]
  } else {
    favShows.splice(tvFavClickedIndex, 1); // si está en fav saco con splice
  }

  // AQUÍ ACABA TU CÓDIGO
  paintTvShows();
  paintFavShows();
  setInLocalStorage();
};

const listenClickShowList = function () {
  const showsListListenerEl = document.querySelectorAll('.js-tvShowDataListItem');
  // console.log('Cuántos LI he encontrado:', showsListListenerEl)
  for (let index = 0; index < showsListListenerEl.length; index++) {
    showsListListenerEl[index].addEventListener('click', handlerShowsList);
  }
};

const getHTMLfavShows = function (serie) {
  let codeHTML = '';
  codeHTML += `<li class="js-tvShowDataListFavItem">`;
  codeHTML += `<h3>${serie.show.name}</h3>`;
  //codeHTML += `<img src=${serie.show.image.medium} class="js-ShowDataImage" alt="Carátula de ${serie.show.name}" />`;
  codeHTML += `</li>`;
  return codeHTML;
};

const paintFavShows = function () {
  let accFavTvShow = '';
  for (let index = 0; index < favShows.length; index++) {
    accFavTvShow += getHTMLfavShows(favShows[index]);
  }
  favShowsEl.innerHTML = accFavTvShow;
  listenClickFavList();
};

//funcion handler favShows:
const handlerFavList = function (event) {
  console.log('me han clickado y el evento es:', event.currentTarget);
  // aquí estoy borrando la primera serie de favoritos de manera fake
  if (favShows.length) {
    favShows.splice(0, 1);
  }
  paintTvShows();
  paintFavShows();
  setInLocalStorage();
};

const listenClickFavList = function () {
  const favListListenerEl = document.querySelectorAll('.js-tvShowDataListFavItem');
  for (let index = 0; index < favListListenerEl.length; index++) {
    favListListenerEl[index].addEventListener('click', handlerFavList);
  }
};

//función local storage

const setInLocalStorage = function () {
  const stringifyFavShows = JSON.stringify(favShows);
  localStorage.setItem('favShows', stringifyFavShows);
};

const getFromLocalStorage = function () {
  const localStorageFavShows = localStorage.getItem('favShows');
  if (localStorageFavShows != null) {
    favShows = JSON.parse(localStorageFavShows);
    paintFavShows();
  }
};

// ARRANCAMOS LA PÁGINA
// getApiData();
getFromLocalStorage();
listenClickSearchBtn();
// paintFavShows();