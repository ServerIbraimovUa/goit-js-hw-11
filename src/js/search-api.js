import axios from 'axios';

const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = '38613444-415ea31856756f0ffc19b62a0';

async function fetchImages(value) {
  axios.defaults.params = {
    key: API_KEY,
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 1,
  };
  return await axios.get(BASE_URL);
}

export { fetchImages };
