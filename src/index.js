import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import OnlyScroll from 'only-scrollbar';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
import { fetchImages, PER_PAGE, API_KEY, BASE_URL } from './js/search-api';
import createMarkup from './js/template/createMarkup';
import refs from './js/refs';

refs.formEl.addEventListener('submit', onSubmitSearch);

let currentPage = 1;
let value = '';
let total = 0;
// loading image
async function onload() {
  currentPage += 1;
  try {
    const resp = await fetchImages(currentPage, value);
    refs.galleryWrapperEl.insertAdjacentHTML(
      'beforeend',
      createMarkup(resp.hits)
    );
    lightbox.refresh();
    // console.log(total);
    if (total === resp.totalHits) {
      // message('Were sorry, but you ve reached the end of search results.', '');
      refs.spanEl.textContent =
        'Were sorry, but you ve reached the end of search results.';
      return;
    }
    total += resp.hits.length;
  } catch (error) {
    Report.failure('404', '');
    console.error(error);
  }
}

//search form
async function onSubmitSearch(e) {
  e.preventDefault();
  currentPage = 1;
  value = e.currentTarget.elements.searchQuery.value.trim();
  if (!value) {
    message('Please write correct data!');
    return;
  }

  try {
    const resp = await fetchImages(currentPage, value);
    console.log(resp);
    //создание разметки
    refs.galleryWrapperEl.innerHTML = createMarkup(resp.hits);

    //если неправильный запрос
    if (resp.total === 0) {
      message('Please write correct data!');
    }

    //библиотека лайбокс и уведомление
    lightbox.refresh();
    total = resp.hits.length;
    Notify.success(`"Hooray! We found ${resp.totalHits} images."`);
  } catch (error) {
    Report.failure('404', '');
    console.error(error);
  }
}

//infiniti scroll
const infiniteScroll = new InfiniteScroll(refs.galleryWrapperEl, {
  responseType: 'json',
  history: false,
  status: '.scroll-status',
  path: function () {
    return `${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${currentPage}`;
  },
});

infiniteScroll.on('load', onload);

infiniteScroll.on('error', () => {
  Report.failure('404', '');
});

function message(sms) {
  Report.warning(`Warning!`, `${sms}`);
}
let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
