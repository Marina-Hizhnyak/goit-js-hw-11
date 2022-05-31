import axios from 'axios';
export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getImage () {
    const URL = 'https://pixabay.com/api/';
    const API_KEY = '27655726-21f64e42587d1295f8299f45c';
    const params = {
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: 40,
    };
    try {
      const response = await axios.get(URL, { params });

      this.incrementPage();
      return response;
    } catch (error) {
      console.error(error);
    }
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