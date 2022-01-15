import CardView from '../view/card-view';
import InfoView from '../view/info-view';
import {remove, render, RenderPosition} from '../utils/render';
import {replace} from '../utils/util';
import CardListView from '../view/card-list-view';

export default class FilmPresenter {
  #container = null;
  #siteFooterTemplate = null;

  #filmsListComponent = new CardListView();

  #infoComponent = null;
  #cardComponent = null;
  #changeData = null;

  #film = null;

  constructor(container, changeData) {
    this.#container = container;
    this.#changeData = changeData;
    this.#siteFooterTemplate = document.querySelector('.footer');
  }

  init = (film) => {
    this.#film = film;
    const prevFilmCardComponent = this.#cardComponent;
    const prevFilmPopupComponent = this.#infoComponent;

    this.#cardComponent = new CardView(film);
    this.#infoComponent = new InfoView(film);

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
      replace(this.#infoComponent, prevFilmPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  }

  #removePopup = () => {
    this.#infoComponent.element.remove();
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
    document.body.classList.remove('hide-overflow');
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
    this.#cardComponent.setAddToWatchClickHandler(this.#handleAddToWatchClick);
    this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#cardComponent.setWatchedClickHandler(this.#handleWatchedClick);
  }

  #setInfoPopupComponentHandlers = () => {
    this.#infoComponent.setClickHandler(this.#closePopup);
    this.#infoComponent.setAddToWatchClickHandler(this.#handleAddToWatchClick);
    this.#infoComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#infoComponent.setWatchedClickHandler(this.#handleWatchedClick);
  }

  #handleAddToWatchClick = () => {
    this.#film.isAddToWatchList = !this.#film.isAddToWatchList;
    this.#changeData({...this.#film, isAddToWatchList: !this.#film.isAddToWatchList});
  }

  #handleWatchedClick = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  }

  destroy = () => {
    remove(this.#cardComponent);
    remove(this.#infoComponent);
  }
}
