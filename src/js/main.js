
import imagesTemplate from '../template/gallery.hbs';
import ApiImagesService from './apiService.js';
import refs from './refs.js';
import { onErrorEmptyInput, onErrorNoSuchMatches } from './pnotify.js';

const { galleryEL, formEL, sentinelEL } = refs;

const apiImageService = new ApiImagesService();

formEL.addEventListener('submit', onImgSearch, 500);

function onImgSearch(e) {
  e.preventDefault();

  apiImageService.query = e.currentTarget.elements.query.value.trim();

  if (apiImageService.query === '') {
    return onErrorEmptyInput();
  }

  apiImageService.resetPage();
  onClearGallery();
  onFetchImages();
}

function onFetchImages() {
  apiImageService
    .onFetchImages()
    .then(images => renderImages(images.hits))
    .catch(onFetchError);
}

function onFetchError(error) {
  alert(error);
}

function renderImages(images) {
  if (images.length === 0) {
    return onErrorNoSuchMatches();
  }

  galleryEL.insertAdjacentHTML('beforeend', imagesTemplate(images));
}

function onClearGallery() {
  galleryEL.innerHTML = '';
}

function onLoadMoreBtnClick() {
  onFetchImages();

  const options = {
    top: null,
    behavior: 'smooth',
  };

  options.top = window.pageYOffset + document.documentElement.clientHeight;
  setTimeout(() => {
    window.scrollTo(options);
  }, 1000);
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && apiImageService.query !== '') {
      apiImageService.onFetchImages().then(images => {
        renderImages(images.hits);
        apiImageService.incrementPage();
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});

observer.observe(sentinelEL);