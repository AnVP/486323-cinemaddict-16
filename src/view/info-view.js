import he from 'he';
import {createTemplateFromArray} from '../utils/util';
import SmartView from './smart-view.js';
import {ButtonStatus, EMOJIES, Key} from '../utils/constants';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);

const createInfoTemplate =(data, comments) => {
  const { isEmojiChecked, isEmoji, message, isDisabled} = data;
  const addToWatchClassName = data.isAddToWatchList
    ? 'film-details__control-button--active'
    : '';
  const watchedClassName = data.isWatched
    ? 'film-details__control-button--active'
    : '';
  const favoriteClassName = data.isFavorite
    ? 'film-details__control-button--active'
    : '';
  const createGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;
  const createCommentTemplate = (comment) => `<li class="film-details__comment"">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${dayjs(comment.date).format('DD MMMM YYYY HH:mm')}</span>
                <button data-comment="${comment.id}" class="film-details__comment-delete" ${isDisabled ? 'disabled' : ''}>Delete</button>
              </p>
            </div>
          </li>`;

  const createCommentsListTemplate = () => comments.map((comment) => createCommentTemplate(comment)).join('');

  const createEmojiTemplate = (emoji) => `<input class="film-details__emoji-item visually-hidden" name="comment-${emoji}" type="radio" id="emoji-${emoji}" value="${emoji}" ${isEmojiChecked === emoji ? 'checked' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emoji}">
     <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
  </label>`;

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${data.poster}" alt="">
          <p class="film-details__age">${data.age}</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${data.title}</h3>
              <p class="film-details__title-original">Original: ${data.origin}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${data.rating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${data.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${data.writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${data.actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(data.year).format('DD MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${dayjs.duration(data.duration, 'm').format('H[h] mm[m]')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${data.country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${data.genre.length > 1 ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell">
                ${createTemplateFromArray(data.genre, createGenreTemplate)}
            </tr>
          </table>
          <p class="film-details__film-description">
            ${data.description}
          </p>
        </div>
      </div>
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${addToWatchClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${watchedClassName} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.comments.length}</span></h3>
        <ul class="film-details__comments-list">
          ${createCommentsListTemplate()}
        </ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${isEmoji !== '' ? `<img src="images/emoji/${isEmoji}.png" width="55" height="55" alt="emoji-${isEmoji}">` : ''}
</div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${he.encode(message)}</textarea>
          </label>
          <div class="film-details__emoji-list">
            ${createTemplateFromArray(EMOJIES, createEmojiTemplate)}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>
`;
};

export default class InfoView extends SmartView {
  constructor(film, comments) {
    super();
    this._data = InfoView.parseFilmToData(film);
    this._comments = [...comments];
    this.#setInnerHandlers();
  }

  get template() {
    return createInfoTemplate(this._data, this._comments);
  }

  get filmData() {
    return this._data.film;
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    InfoView.parseDataToFilm(this._data);
    this._callback.click();
  }

  #buttonsClickHandler = (value) => () => this._callback.buttonsClick(value);

  setButtonsClickHandler = (callback) => {
    this._callback.buttonsClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#buttonsClickHandler(ButtonStatus.WATCHLIST));
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#buttonsClickHandler(ButtonStatus.WATCHED));
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#buttonsClickHandler(ButtonStatus.FAVORITE));
  }

  setCommentDeleteHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((item) => item.addEventListener('click', this.#commentDeleteHandler));

  }

  #commentDeleteHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.dataset.comment) {
      const commentId = evt.target.dataset.comment;
      this._callback.deleteClick(commentId);
      const deleteButton = document.querySelector(`[data-comment="${commentId}"]`);
      deleteButton.disabled = true;
      deleteButton.textContent = 'Deleting...';
    }
  }

  reset = (film) => {
    this.updateData(
      InfoView.parseFilmToData(film),
    );
  }


  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setButtonsClickHandler(this._callback.buttonsClick);
    this.setClickHandler(this._callback.click);
    this.setCommentDeleteHandler(this._callback.deleteClick);
    this.setCommentFormSubmit(this._callback.formSubmit);
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-item').forEach((emoji) => emoji.addEventListener('change', this.#emojiChangeHandler));
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#messageInputHandler);
  }

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      isEmoji: evt.target.value,
      isEmojiChecked: evt.target.id,
    });
  }

  #messageInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      message: evt.target.value,
    }, true);
  }

  setCommentFormSubmit = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#commentFormKeydownHandler);
  }

  #commentFormKeydownHandler = (evt) => {
    if (evt.key === Key.ENTER) {
      if (!this._data.isEmoji || !this._data.message) {
        return;
      }
      const newComment = {
        text: this._data.message,
        emoji: this._data.isEmoji,
      };
      this._callback.formSubmit(newComment);
    }
  }

  static parseFilmToData = (film) => ({...film,
    isEmoji: '',
    isEmojiChecked: '',
    message: '',
    isDisabled: false,
    isDeleting: false,
  });

  static parseDataToFilm = (data) => {
    const film = {...data};
    film.isEmoji = '';
    film.isEmojiChecked = '';
    film.message = '';

    delete film.isEmoji;
    delete film.isEmojiChecked;
    delete film.message;
    delete film.isDisabled;
    delete film.isDeleting;
    return film;
  }
}
