import AbstractView from './abstract-view.js';
import {ButtonStatus} from '../utils/constants';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);
const TEXT_LENGTH = 140;

const createCardTemplate =(film) => {
  const addToWatchClassName = film.isAddToWatchList
    ? 'film-card__controls-item--active'
    : '';
  const watchedClassName = film.isWatched
    ? 'film-card__controls-item--active'
    : '';
  const favoriteClassName = film.isFavorite
    ? 'film-card__controls-item--active'
    : '';
  return `<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${film.title}</h3>
            <p class="film-card__rating">${film.rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${dayjs(film.year).format('YYYY')}</span>
              <span class="film-card__duration">${dayjs.duration(film.duration, 'm').format('H[h] mm[m]')}</span>
              <span class="film-card__genre">${film.genre.slice(0, 1)}</span>
            </p>
            <img src="${film.poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${film.description.length > TEXT_LENGTH ? film.description.slice(0, (TEXT_LENGTH - 1)).concat('...') : film.description}</p>
            <span class="film-card__comments">${film.comments.length} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addToWatchClassName}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export default class CardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createCardTemplate(this.#film);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__poster').addEventListener('click', this.#clickHandler);
    this.element.querySelector('.film-card__comments').addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  #buttonsClickHandler = (value) => () => this._callback.buttonsClick(value);

  setButtonsClickHandler = (callback) => {
    this._callback.buttonsClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#buttonsClickHandler(ButtonStatus.WATCHLIST));
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#buttonsClickHandler(ButtonStatus.WATCHED));
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#buttonsClickHandler(ButtonStatus.FAVORITE));
  }
}
