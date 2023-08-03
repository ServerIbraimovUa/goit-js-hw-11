import { Report } from 'notiflix/build/notiflix-report-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/search-api';
import createMarkup from './js/template/createMarkup';
import refs from './js/refs';

refs.formEl.addEventListener('submit', onSubmitSearch);
let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

async function onSubmitSearch(e) {
  e.preventDefault();
  const inputValue = e.currentTarget.elements.searchQuery.value.trim();
  if (!inputValue) {
    message('Please write correct data!');
    return;
  }
  fetchImages(inputValue)
    .then(resp => {
      if (resp.data.total === 0) {
        message('Please write correct data!');
      }
      return (refs.galleryWrapperEl.innerHTML = createMarkup(resp.data.hits));
    })
    .then(() => lightbox.refresh());
}

function message(sms) {
  Report.warning(`Warning!`, `${sms}`);
}
