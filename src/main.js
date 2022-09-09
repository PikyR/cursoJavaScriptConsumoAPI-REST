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
  return `${BASE_API_URL}/favourites/${id}?api_key=${API_KEY}`;
};

let favouritesImagesIDs = [];

const randomCatsContainer = document.querySelector("#random-cats-container");
const favouritesContainer = document.querySelector(".favourites-container");
const spanError = document.querySelector(".spanError");
const btn = document.querySelector(".main__button");

btn.addEventListener("click", loadRandomCats);

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

function renderRandomCats(data) {
  const article = document.createElement("article");
  article.classList.add("card");

  const img = document.createElement("img");
  img.classList.add("card__image");
  img.src = data.url;

  const btnAddFav = document.createElement("button");
  btnAddFav.classList.add("card__button");

  const btnAddFavText = document.createTextNode("Fav");
  btnAddFav.appendChild(btnAddFavText);

  article.append(img, btnAddFav);
  //
  btnAddFav.addEventListener("click", () => {
    checkDuplicated(data.id);
  });
  //
  randomCatsContainer.appendChild(article);
}

function renderFavourites(data, favouriteID) {
  const article = document.createElement("article");
  article.classList.add("card");

  const img = document.createElement("img");
  img.classList.add("card__image");
  img.src = data.image.url;

  const button = document.createElement("button");
  button.classList.add("card__button");
  button.addEventListener("click", () => deleteFavourite(favouriteID));

  const buttonText = document.createTextNode("Delete");

  button.appendChild(buttonText);
  article.append(img, button);

  favouritesContainer.appendChild(article);
}

function checkDuplicated(id) {
  if (favouritesImagesIDs.some((favID) => favID === id)) {
    alert("Ya esta en favoritos");
    return;
  } else {
    addFavourite(id);
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
    method: "DELETE",
  });
  console.log("delete fav", response);

  loadFavourites();
}

async function loadFavourites() {
  const favourites = await fetchData(API_FAVOURITES);
  const favouritesIDs = favourites.map((item) => item.id);
  favouritesImagesIDs = favourites.map((item) => item.image.id);

  favouritesContainer.innerHTML = "";

  favourites.forEach((favourite, i) => {
    renderFavourites(favourite, favouritesIDs[i]);
  });
}

async function loadRandomCats() {
  const randomCats = await fetchData(API_RANDOM);
  randomCatsContainer.innerHTML = "";

  randomCats.forEach((cat) => {
    renderRandomCats(cat);
  });

  loadFavourites();
}

loadRandomCats();
