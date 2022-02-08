import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../utils/constants';

class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  }

  getFilmById = (filmId) => {
    const index = this.#films.findIndex((film) => film.id === filmId);

    if (index === -1) {
      throw new Error('Can\'t get unexisting film');
    }

    return this.films[index];
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        update,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }

    this._notify(updateType, update);
  }

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      actors: film['film_info']['actors'],
      age: film['film_info']['age_rating'],
      origin: film['film_info']['alternative_title'],
      description: film['film_info']['description'],
      director: film['film_info']['director'],
      genre: film['film_info']['genre'],
      poster: film['film_info']['poster'],
      year: film['film_info']['release']['date'],
      country: film['film_info']['release']['release_country'],
      duration: film['film_info']['runtime'],
      title: film['film_info']['title'],
      rating: film['film_info']['total_rating'],
      writers: film['film_info']['writers'],
      isWatched: film['user_details']['already_watched'],
      isFavorite: film['user_details']['favorite'],
      watchedDate: film.user_details['watching_date'] !== null ? new Date(film.user_details['watching_date']) : film.user_details['watching_date'],
      isAddToWatchList: film['user_details']['watchlist'],
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];
    return adaptedFilm;
  }
}

export default FilmsModel;
