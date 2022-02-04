import AbstractView from './abstract-view.js';
import {getRank} from '../utils/statistics';

const createProfileTemplate =(watchedFilms) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getRank(watchedFilms)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileView extends AbstractView {
  #films = null;
  #watchedFilms = null;

  constructor(films) {
    super();
    this.#films = films;
    this.#watchedFilms = this.#films.filter((film) => film.isWatched);
  }

  get template() {
    return createProfileTemplate(this.#watchedFilms);
  }
}
