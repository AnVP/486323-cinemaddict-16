import CardView from '../view/card-view';
import InfoView from '../view/info-view';
import {remove, render, RenderPosition} from '../utils/render';
import {replace} from '../utils/util';
import {
  AUTHORIZATION,
  ButtonStatus,
  END_POINT, FilterType, Key,
  Mode,
  State,
  UpdateType,
  UserAction
} from '../utils/constants';
import CommentsModel from '../model/comments-model';
import ApiService from '../api-service';

export default class FilmPresenter {
  #container = null;

  #infoComponent = null;
  #cardComponent = null;
  #changeData = null;

  #commentsModel = null;
  #api = null;

  #film = null;
  #currentFilter = null;
  #mode = Mode.DEFAULT;

  constructor(container, changeData, currentFilter) {
    this.#container = container;
    this.#changeData = changeData;
    this.#currentFilter = currentFilter;
    this.#api = new ApiService(END_POINT, AUTHORIZATION);

    this.#commentsModel = new CommentsModel(this.#api);
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

    if (prevFilmCardComponent === null) {
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
      remove(prevFilmPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  }

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#infoComponent.updateData({
        isDisabled: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#infoComponent.updateData({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this.#infoComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#infoComponent.shake(resetFormState);
        break;
    }
  }

  #removePopup = () => {
    this.#mode = Mode.DEFAULT;
    this.#infoComponent.reset(this.#film);
    this.#infoComponent.element.remove();
    document.body.classList.remove('hide-overflow');
  };

  #handleEscKeyDown = (evt) => {
    if (evt.key === Key.ESCAPE || evt.key === Key.ESC) {
      evt.preventDefault();
      this.#removePopup();
      document.removeEventListener('keydown', this.#handleEscKeyDown);
    }
  };

  #closePopup = () => {
    this.#removePopup();
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    this.#handleModelEvent(UserAction.CLOSE_POPUP);
  }

  #openPopup = async () => {
    this.#mode = Mode.POPUP;
    await this.#commentsModel.init(this.#film.id);
    this.#infoComponent = new InfoView(this.#film, this.#commentsModel.comments);
    this.#setInfoPopupComponentHandlers();
    document.body.appendChild(this.#infoComponent.element);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#handleEscKeyDown);
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
          this.#currentFilter !== FilterType.HISTORY ? UpdateType.ADD_WATCHED : UpdateType.MINOR,
          {...this.#film, isWatched: !this.#film.isWatched});
        break;
      case ButtonStatus.FAVORITE:
        this.#changeData(
          UserAction.UPDATE_FILM,
          (this.#currentFilter !== FilterType.FAVORITES) || (this.#mode === Mode.POPUP) ? UpdateType.PATCH : UpdateType.MINOR,
          {...this.#film, isFavorite: !this.#film.isFavorite});
        break;
    }
  }

  #handleViewAction = async (actionType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.setViewState(State.SAVING);
        try {
          await this.#commentsModel.addComment(actionType, this.#film.id, update);
        } catch (err) {
          this.setViewState(State.ABORTING, update);
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.setViewState(State.DELETING, update);
        try {
          await this.#commentsModel.deleteComment(actionType, update);
        } catch (err) {
          this.setViewState(State.ABORTING);
        }
        break;
    }
  }

  #handleModelEvent = (actionType, data) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#changeData(
          UserAction.ADD_COMMENT, UpdateType.PATCH,
          { ...this.#film, comments: data.comments.map((comment) => comment.id) });
        break;
      case UserAction.DELETE_COMMENT:
        this.#changeData(
          UserAction.DELETE_COMMENT, UpdateType.PATCH,
          { ...this.#film, comments: this.#film.comments.filter((comment) => comment !== data.toString()) });
        break;
      case UserAction.CLOSE_POPUP:
        if (this.#currentFilter !== FilterType.ALL) {
          this.#changeData(
            UserAction.CLOSE_POPUP, UpdateType.MINOR,
            { ...this.#film });
        }
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
    if (this.#mode === Mode.POPUP) {
      this.#removePopup();
    }
  }
}
