import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/main.css';
import ApiService from './API';
import pictureCard from './template.hbs';

const refs = {
  searchForm: document.querySelector('.search-image-form'),
  galleryEl: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', searchImage);

const apiService = new ApiService();

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  enableKeyboard: true,
});
lightbox.refresh();


function searchImage(e) {
  e.preventDefault();
  inputClear();
  apiService.resetPage();
  apiService.params.q = e.currentTarget.elements.searchQuery.value;
  if (apiService.params.q.trim() === '') {
    Notiflix.Notify.failure('Please fill in the field');
    return;
  }


  apiService.getImage().then(data => {
    appendImage(data.hits);
    lightbox.refresh();
    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again',
      );
      return;
    }
    if (data.totalHits !== 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images!`);
    }

  });
}

function inputClear() {
  refs.galleryEl.innerHTML = '';
}
function appendImage(card) {
  refs.galleryEl.insertAdjacentHTML('beforeend', pictureCard(card));

}

window.addEventListener('scroll', infiniteScroll);

function infiniteScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 100) {
    apiService
      .getImage()
      .then(({ hits }) => {
        if (hits.length === 0) {
          Notiflix.Notify.failure('We're sorry, but you've reached the end of search results.');
          return;
        }
        appendImage(hits);
        lightbox.refresh();
      })
      .catch(error => {
        console.log(error);
        return;
      });
  }
}

