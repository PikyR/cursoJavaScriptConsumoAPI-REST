const API_KEY =
  "live_FOeHChUkCQhNu2wqKiUbnXSbKIX7SmYtymORUh6GCc4M5rfbagsdUxLmK0KZJ08g";
//
const BASE_API_URL = "https://api.thecatapi.com/v1";

const API_RANDOM = [BASE_API_URL, "/images/search", "?limit=4"].join("");

const API_FAVOURITES = [BASE_API_URL, "/favourites"].join("");

const API_UPLOAD = [BASE_API_URL, "/images/upload"].join("");

const API_MY_IMAGES = [BASE_API_URL, "/images", "?limit=4"].join("");

console.log(API_FAVOURITES);

const API_FAVOURITES_DELETE = (imageID) => {
  return `${BASE_API_URL}/favourites/${imageID}`;
};

const API_MY_IMAGES_DELETE = (imageID) => {
  return `${BASE_API_URL}/images/${imageID}`;
};

let favouritesImagesIDs = [];
let myImagesIDs = [];

// Icons
const favouriteActive = '';

const spanError = document.querySelector(".spanError");
// containers
const randomCatsContainer = document.querySelector("#random-cats-container");
const favouritesContainer = document.querySelector(".favourites-container");
const myImagesContainer = document.querySelector(".my-images-container");
// buttons
const btn = document.querySelector(".main__button");
const btnUpload = document.querySelector("#button-upload");
// add event listener
btn.addEventListener("click", loadRandomCats);
btnUpload.addEventListener("click", uploadImage);


async function fetchData(urlAPI, options) {
  try {
    const response = await fetch(urlAPI, options);
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
  btnAddFav.classList.add("card__button", "card__button--random");

  const iconFavourite = document.createElement('span')
  iconFavourite.classList.add('icon-favorite_outline')
  btnAddFav.append(iconFavourite);  

  article.append(img, btnAddFav);

  btnAddFav.addEventListener("click", () => {
    if (!(favouritesImagesIDs.some(favID => favID === data.id))) {
      iconFavourite.classList.remove('icon-favorite_outline');  
      iconFavourite.classList.add('icon-favorite');
    }
    
    checkDuplicated(data.id);
  });

  randomCatsContainer.appendChild(article);
}

function renderMyCats(data, imageID) {
  const article = document.createElement("article");
  article.classList.add("card");

  const img = document.createElement("img");
  img.classList.add("card__image");
  img.src = data.url;

  const btnDeleteImage = document.createElement("button");
  btnDeleteImage.classList.add("card__button");

  const btnDeleteText = document.createTextNode("Del");
  btnDeleteImage.appendChild(btnDeleteText);

  article.append(img, btnDeleteImage);

  btnDeleteImage.addEventListener("click", () => {
    deleteImage(imageID)    
  });

  myImagesContainer.appendChild(article);
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
  const response = await fetchData(API_FAVOURITES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
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
  const response = await fetchData(API_FAVOURITES_DELETE(id), {
    method: "DELETE",
    headers: {
      "X-API-KEY": API_KEY,
    },
  });

  loadFavourites();
}

// UPLOAD IMAGE
async function uploadImage() {
  const inputImage = document.getElementById("form-upload");
  const image = new FormData(inputImage);

  const imagePost = await fetchData(API_UPLOAD, {
    method: "POST",
    headers: {
      "X-API-KEY": API_KEY,
    },
    body: image,
  });

  loadMyCats();
}
// DELETE IMAGE
async function deleteImage(id) {
  const response = await fetchData(API_MY_IMAGES_DELETE(id), {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
    }
  });

  loadMyCats();
}

async function loadFavourites() {
  const favourites = await fetchData(API_FAVOURITES, {
    method: "GET",
    headers: {
      "X-API-KEY": API_KEY,
    },
  });

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
}

async function loadMyCats() {
  const myCats = await fetchData(API_MY_IMAGES, {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
    },
  });

  myImagesIDs = myCats.map((cat => cat.id));
  myImagesContainer.innerHTML = "";

  myCats.map((cat,i) => {
    renderMyCats(cat, myImagesIDs[i]);
  });

  console.log(myCats);
}

loadMyCats();
loadFavourites();
loadRandomCats();
