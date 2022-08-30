const API = 'https://api.thecatapi.com/v1/images/search';
const img1 = document.querySelector('.img1');
const img2 = document.querySelector('.img2');
const img3 = document.querySelector('.img3');
const img4 = document.querySelector('.img4');
const btn = document.querySelector('button');

btn.addEventListener('click', nuevoGato);

async function fetchData(urlAPI) {
  try {
    const response = await fetch(urlAPI);
    const data = await response.json();
    
    return data;
  } catch(err) {
    console.log("ERROR: " + err);
  }
}

async function nuevoGato() {
  const images = await fetchData(`${API}?limit=4`);
  const imageURL = images.map(image => image.url);
  
  img1.src = imageURL[0];
  img2.src = imageURL[1];
  img3.src = imageURL[2];
  img4.src = imageURL[3];
}

nuevoGato();