import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] =
  'live_DZcaAozB92PqYP3hMDymLxjL4J2dv7qN31GCLyYZPFSQDBkIBdphrtCIdKsss2or';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const errorParagraph = document.querySelector('.error');
const catInfoDiv = document.querySelector('.cat-info');

async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    const breeds = response.data;
    breedSelect.innerHTML = breeds
      .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
      .join('');
    breedSelect.disabled = false;
    loader.style.display = 'none';
  } catch (error) {
    console.error('Error fetching breeds: ', error);
    Notiflix.Notify.failure(
      'Oops! Something went wrong while fetching breeds!'
    );
    loader.style.display = 'none';
    errorParagraph.style.display = 'block';
  }
}

async function fetchCatByBreed(breedId) {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );
    const catData = response.data[0];
    catInfoDiv.innerHTML = `
      <img src="${catData.url}" alt="Cat image" style="max-width: 300px;">
      <p>Name: ${catData.breeds[0].name}</p>
      <p>Description: ${catData.breeds[0].description}</p>
      <p>Temperament: ${catData.breeds[0].temperament}</p>
    `;
    loader.style.display = 'none';
  } catch (error) {
    console.error('Error fetching cat info: ', error);
    Notiflix.Notify.failure(
      'Oops! Something went wrong while fetching cat info!'
    );
    loader.style.display = 'none';
    errorParagraph.style.display = 'block';
  }
}

breedSelect.addEventListener('change', () => {
  const selectedBreedId = breedSelect.value;
  fetchCatByBreed(selectedBreedId);
});

function showLoader() {
  loader.style.display = 'block';
  errorParagraph.style.display = 'none';
  catInfoDiv.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  showLoader();
  fetchBreeds();
});
