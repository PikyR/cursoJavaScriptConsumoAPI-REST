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
  // `?api_key=${API_KEY}`,
].join("");
// console.log(API_FAVOURITES);

const imagesContainers = document.querySelectorAll(".card__image--main");
const spanError = document.querySelector(".spanError");

const btn = document.querySelector("button");

btn.addEventListener("click", loadRandomCats);

async function fetchData(urlAPI) {
  try {
    const response = await fetch(urlAPI);
    const data = await response.json();

    if (response.status !== 200) {
      spanError.inner = `Error: ${response.status}`;
    }

    return data;
  } catch (err) {
    console.log("Error name: " + err.name);
    console.log("Error mesage: " + err.message);    
    return spanError.innerText = `Algo a salido mal, inténtalo más tarde...`;
  }
}

async function loadRandomCats() {
  const images = await fetchData(API_RANDOM);
  const imagesURL = images.map((image) => image.url);

  imagesContainers.forEach((container, i) => {
    container.src = imagesURL[i];
  });
}

async function loadFavourites() {
  const favourites = await fetchData(API_FAVOURITES);
  
  // console.log('favoritos', favourites.length);
}

loadRandomCats();
loadFavourites();
