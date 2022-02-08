import AbstractView from './abstract-view.js';
import {getRank} from '../utils/statistics';

const createRankTemplate =(watchedFilms) => {
  if (watchedFilms.length) {
    return (`<section class="header__profile profile">
    <p class="profile__rating">${getRank(watchedFilms)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
  }
  return ('<section class="header__profile profile"></section>');
};

class RankView extends AbstractView {
  #watchedFilms = null;

  constructor(watchedFilms) {
    super();
    this.#watchedFilms = watchedFilms;
  }

  get template() {
    return createRankTemplate(this.#watchedFilms);
  }
}

export default RankView;
