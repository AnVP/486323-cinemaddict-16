import CardView from '../view/card-view';
import InfoView from '../view/info-view';
import {remove, render, RenderPosition} from '../utils/render';
import {replace} from '../utils/util';
import {ButtonStatus, FilterType, UpdateType, UserAction} from '../utils/constants';
import CommentsModel from '../model/comments-model';

export default class FilmPresenter {
  #container = null;
  #siteFooterTemplate = null;

  #infoComponent = null;
  #cardComponent = null;
  #changeData = null;

  #commentsModel = null;

  #film = null;
  #currentFilter = null;

  constructor(container, changeData, comments, currentFilter) {
    this.#container = container;
    this.#changeData = changeData;
    this.#siteFooterTemplate = document.querySelector('.footer');
    this.#currentFilter = currentFilter;

    this.#commentsModel = new CommentsModel();
    this.#commentsModel.comments = comments;
    this.#commentsModel.addObserver(this.#handleModelEvent);

  }

  init = (film) => {
    this.#film = film;
    const prevFilmCardComponent = this.#cardComponent;
    const prevFilmPopupComponent = this.#infoComponent;

    this.#cardComponent = new CardView(film);
    this.#infoComponent = new InfoView(film, this.#commentsModel.comments);

    this.#setCardComponentHandlers();
    this.#setInfoPopupComponentHandlers();

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this.#container, this.#cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#container.contains(prevFilmCardComponent.element)) {
      replace(this.#cardComponent, prevFilmCardComponent);
    }

    if (document.body.contains(prevFilmPopupComponent.element)) {
      const scrollPosition = prevFilmPopupComponent.element.scrollTop;
      replace(this.#infoComponent, prevFilmPopupComponent);
      this.#infoComponent.element.scrollTop = scrollPosition;
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  }

  #removePopup = () => {
    this.#infoComponent.reset(this.#film);
    this.#infoComponent.element.remove();
    document.body.classList.remove('hide-overflow');
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #closePopup = () => {
    this.#removePopup();
    // document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #openPopup = () => {
    this.#infoComponent = this.#infoComponent || new InfoView(this.#film);
    document.body.appendChild(this.#infoComponent.element);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #setCardComponentHandlers = () => {
    this.#cardComponent.setClickHandler(this.#openPopup);
    this.#cardComponent.setButtonsClickHandler(this.#handleAddToButtonsControlClick);
  }

  #setInfoPopupComponentHandlers = () => {
    this.#infoComponent.setClickHandler(this.#closePopup);
    this.#infoComponent.setButtonsClickHandler(this.#handleAddToButtonsControlClick);
    this.#infoComponent.setCommentDeleteHandler(this.#handleCommentDelete);
    this.#infoComponent.setCommentFormSubmit(this.#handleCommentAdd);
  }

  #handleAddToButtonsControlClick = (value) => {
    switch (value) {
      case ButtonStatus.WATCHLIST:
        this.#changeData(
          UserAction.UPDATE_FILM,
          this.#currentFilter !== FilterType.WATCHLIST ? UpdateType.PATCH : UpdateType.MINOR,
          {...this.#film, isAddToWatchList: !this.#film.isAddToWatchList});
        break;
      case ButtonStatus.WATCHED:
        this.#changeData(
          UserAction.UPDATE_FILM,
          this.#currentFilter !== FilterType.HISTORY ? UpdateType.PATCH : UpdateType.MINOR,
          {...this.#film, isWatched: !this.#film.isWatched});
        break;
      case ButtonStatus.FAVORITE:
        this.#changeData(
          UserAction.UPDATE_FILM,
          this.#currentFilter !== FilterType.FAVORITES ? UpdateType.PATCH : UpdateType.MINOR,
          {...this.#film, isFavorite: !this.#film.isFavorite});
        break;
    }
  }

  #handleViewAction = (actionType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(actionType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(actionType, update);
        break;
    }
  }

  #handleModelEvent = (actionType, data) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#changeData(
          UserAction.ADD_COMMENT, UpdateType.PATCH,
          {...this.#film, comments: this.#film.comments.concat([data])});
        break;
      case UserAction.DELETE_COMMENT:
        this.#changeData(
          UserAction.DELETE_COMMENT, UpdateType.PATCH,
          { ...this.#film, comments: this.#film.comments.filter((comment) => comment.id !== data) });
        break;
    }
  }

  #handleCommentDelete = (update) => {
    this.#handleViewAction(UserAction.DELETE_COMMENT, update);
  }

  #handleCommentAdd = (update) => {
    this.#handleViewAction(UserAction.ADD_COMMENT, update);
  }

  destroy = () => {
    remove(this.#cardComponent);
    remove(this.#infoComponent);
  }
}
