import AbstractView from './abstract-view.js';
import {getRank} from '../utils/statistics';

const createRankTemplate =(watchedFilms) => (
  `<p class="profile__rating">${getRank(watchedFilms)}</p>`
);

export default class RankView extends AbstractView {
  #watchedFilms = null;

  constructor(watchedFilms) {
    super();
    this.#watchedFilms = watchedFilms;
  }

  get template() {
    return createRankTemplate(this.#watchedFilms);
  }
}
