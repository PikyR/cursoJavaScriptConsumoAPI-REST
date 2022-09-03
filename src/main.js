const API_KEY =
  "live_FOeHChUkCQhNu2wqKiUbnXSbKIX7SmYtymORUh6GCc4M5rfbagsdUxLmK0KZJ08g";
//
const BASE_API_URL = "https://api.thecatapi.com/v1";

const API_RANDOM = [
  BASE_API_URL,
  "/images/search",
  "?limit=4",
  `&api_key=${API_KEY}`,
].join("");

const API_FAVOURITES = [
  BASE_API_URL,
  "/favourites",
  `?api_key=${API_KEY}`,
].join("");

const API_FAVOURITES_DELETE = (id) => {
  return `${BASE_API_URL}/favourites/${id}?api_key=${API_KEY}`
};
// console.log(1111,API_FAVOURITES_DELETE('11ELID22'));

const imagesContainers = document.querySelectorAll(".card__image--main");
const favouritesContainer = document.querySelector(".favourites-container");
const spanError = document.querySelector(".spanError");

const btn = document.querySelector(".main__button");
const btnFavourites = document.querySelectorAll(".add-favourite");
// console.log(btnFavourite);

btn.addEventListener("click", loadRandomCats);
// btnFavourite[0].addEventListener("click", addFavourite);

async function fetchData(urlAPI) {
  try {
    const response = await fetch(urlAPI);
    const data = await response.json();    

    return data;
  } catch (err) {
    console.log("Error name: " + err.name);
    console.log("Error mesage: " + err.message);
    return (spanError.innerText = `Algo a salido mal, inténtalo más tarde...`);
  }
}

async function addFavourite(id) {
  const response = await fetch(API_FAVOURITES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // API-KEY
    },
    body: JSON.stringify({
      image_id: id,
    }),
  });

  loadFavourites();

  // falta manejar el error res.status / .message
  // const favorites = await response.json();

  // console.log('Add favourite func', favorites);
}

async function deleteFavourite(id) {
  const response = await fetch(API_FAVOURITES_DELETE(id), {
    method: 'DELETE'    
  });
  console.log('delete fav',response);

  loadFavourites()
}

async function loadFavourites() {
  const favourites = await fetchData(API_FAVOURITES);
  const favouritesURL = favourites.map(item => item.image.url);
  const favouriteID = favourites.map(item => item.id);  
  console.log('loadFav: ', favourites);


  favouritesContainer.innerHTML = "";

  favouritesURL.forEach( (imageURL, i) => {

    const article = document.createElement('article');
    article.classList.add('card');

    const img = document.createElement('img');
    img.classList.add('card__image')
    img.src = imageURL;
    
    const button = document.createElement('button');
    button.classList.add('card__button');
    button.addEventListener('click', () => deleteFavourite(favouriteID[i]));

    const buttonText = document.createTextNode('Delete');

    button.appendChild(buttonText);
    article.append(img, button);

    return favouritesContainer.appendChild(article);
  });

  console.log('favoritos', favourites);
  console.log('favoritos URL', favouritesURL);
}

async function loadRandomCats() {
  const images = await fetchData(API_RANDOM);
  const imagesURL = images.map((image) => image.url);
  const randomCatsIDs = images.map(image => image.id);
  console.log('desde load cats lista IDs ',randomCatsIDs);

  imagesContainers.forEach((container, i) => {
    container.src = imagesURL[i];
  });

  btnFavourites.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      addFavourite(randomCatsIDs[i])
      console.log('desde load cats IDs, que tiene que ser una ',randomCatsIDs[i]);
    });
  })

  // loadFavourites();
  // console.log('images data', images);
  // console.log('id', randomCatsIDs);
}



loadRandomCats();
loadFavourites();
