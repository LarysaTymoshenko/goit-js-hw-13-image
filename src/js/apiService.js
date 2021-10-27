// import gallery from '../template/gallery.hbs';
const BASE_URL = 'https://pixabay.com/api/';
const MAIN_SEARCH_SETTINGS = '?image_type=photo&orientation=horizontal&';
const API_KEY = '24038047-704cc7956da07111e29f822f6';

export default class ApiImagesService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async onFetchImages() {
    const url = `${BASE_URL}${MAIN_SEARCH_SETTINGS}q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`;

    return await fetch(url).then(response => {
      this.incrementPage();
      return response.json();
    });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}