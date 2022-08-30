const API_KEY =
  "live_FOeHChUkCQhNu2wqKiUbnXSbKIX7SmYtymORUh6GCc4M5rfbagsdUxLmK0KZJ08g";
const API = [
  "https://api.thecatapi.com/v1",
  "/images/search",
  "?limit=4",
  `&api_key=${API_KEY}`,
].join("");
// console.log(API);

const imageContainers = document.querySelectorAll(".card__image--main");

const btn = document.querySelector("button");

btn.addEventListener("click", nuevoGato);

async function fetchData(urlAPI) {
  try {
    const response = await fetch(urlAPI);
    const data = await response.json();

    return data;
  } catch (err) {
    console.log("ERROR: " + err);
  }
}

async function nuevoGato() {
  const images = await fetchData(API);
  const imageURL = images.map((image) => image.url);

  imageContainers.forEach((container, i) => {
    container.src = imageURL[i];
  });
}

nuevoGato();
