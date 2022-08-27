const API = 'https://api.thecatapi.com/v1/images/search';
const img = document.querySelector('img');
const btn = document.querySelector('button');

btn.addEventListener('click', nuevoGato);

async function fetchData(urlAPI) {
  try {
    const response = await fetch(urlAPI);
    const data = await response.json();
    const dataURL = data[0].url;
  
    return img.src = dataURL;
  } catch(err) {
    console.log("ERROR: " + err);
  }
}

function nuevoGato() {
  fetchData(API);
}