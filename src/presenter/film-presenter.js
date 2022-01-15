import CardView from '../view/card-view';
import InfoView from '../view/info-view';
import {remove, render, RenderPosition} from '../utils/render';
import {replace} from '../utils/util';

export default class FilmPresenter {
  #container = null;
  #siteFooterTemplate = null;

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
    this.#cardComponent.setButtonsClickHandler(this.#handleAddToButtonsControlClick);
  }

  #setInfoPopupComponentHandlers = () => {
    this.#infoComponent.setClickHandler(this.#closePopup);
    this.#infoComponent.setButtonsClickHandler(this.#handleAddToButtonsControlClick);
  }

  #handleAddToButtonsControlClick = (value) => {
    switch (value) {
      case 'watchlist':
        this.#changeData({...this.#film, isAddToWatchList: !this.#film.isAddToWatchList});
        break;
      case 'watched':
        this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
        break;
      case 'favorite':
        this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
        break;
    }
  }

  destroy = () => {
    remove(this.#cardComponent);
    remove(this.#infoComponent);
  }
}
