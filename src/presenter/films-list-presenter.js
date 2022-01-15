import FilmsView from '../view/films-view';
import CardListView from '../view/card-list-view';
import NoFilmsView from '../view/no-films-view';
import {remove, render, RenderPosition} from '../utils/render';
import ButtonShowMoreView from '../view/button-show-more-view';
import TopRatedListView from '../view/top-rated-list';
import MostCommentedListView from '../view/most-commented-list';
import {updateItem} from '../utils/util';
import FilmPresenter from './film-presenter';
import FiltersView from '../view/filters-view';
import {SortType} from '../utils/constants';

const CARDS_COUNT_PER_STEP = 5;
const CARDS_COUNT_MIN = 2;

export default class FilmsListPresenter {
  #filmsContainer = null;
  #filmListContainerElement = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new CardListView();
  #noFilmsComponent = new NoFilmsView();
  #loadMoreButton = new ButtonShowMoreView();
  #topRatedListComponent = new TopRatedListView();
  #mostCommentedListComponent = new MostCommentedListView();
  #sortComponent = new FiltersView();
  #filmPresenter = new Map();

  #films = [];
  #renderedFilmCount = CARDS_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #sourcedFilms = [];

  constructor(filmsContainer) {
    this.#filmsContainer = filmsContainer;
    this.#filmListContainerElement = this.#filmsListComponent.element.querySelector('.films-list__container');
  }

  init = (films) => {
    this.#films = [...films];
    this.#sourcedFilms = [...films];
    this.#renderSort();
    render(this.#filmsContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    if (!films.length) {
      this.#renderNoFilms();
      return;
    }
    render(this.#filmsComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);
    this.#renderFilmsList();
    // this.#renderTopRatedList();
    // this.#renderMostCommentedList();
  }

  #renderFilm = (container, film) => {
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(this.#filmListContainerElement, film));
  }

  #renderFilmsList = () => {
    this.#renderFilms(0, Math.min(this.#films.length, CARDS_COUNT_PER_STEP));
    if (this.#films.length > CARDS_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = CARDS_COUNT_PER_STEP;
    remove(this.#loadMoreButton);
  }

  #renderNoFilms = () => {
    render(this.#filmsContainer, this.#noFilmsComponent, RenderPosition.BEFOREEND);
  }

  #renderLoadMoreButton = () => {
    let renderedTaskCount = CARDS_COUNT_PER_STEP;
    render(this.#filmsComponent, this.#loadMoreButton, RenderPosition.BEFOREEND);

    this.#loadMoreButton.setClickHandler(() => {
      this.#films
        .slice(renderedTaskCount, renderedTaskCount + CARDS_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilm(this.#filmListContainerElement, film));

      renderedTaskCount += CARDS_COUNT_PER_STEP;

      if (renderedTaskCount >= this.#films.length) {
        remove(this.#loadMoreButton);
      }
    });
  }

  #sortRatingFilms = () => this.#films.sort((a, b) => b.rating - a.rating).slice(0, CARDS_COUNT_MIN);

  #sortCommentsFilms = () => this.#films.sort((a, b) => b.comments.length - a.comments.length).slice(0, CARDS_COUNT_MIN);

  #renderTopRatedList = () => {
    render(this.#filmsComponent, this.#topRatedListComponent, RenderPosition.BEFOREEND);
    const topRatedContainerElement = this.#topRatedListComponent.element.querySelector('.films-list__container');
    const arr = this.#sortRatingFilms();

    for (let i = 0; i < arr.length; i++) {
      this.#renderFilm(topRatedContainerElement, arr[i]);
    }
  }

  #renderMostCommentedList = () => {
    render(this.#filmsComponent, this.#mostCommentedListComponent, RenderPosition.BEFOREEND);
    const topRatedContainerElement = this.#mostCommentedListComponent.element.querySelector('.films-list__container');
    const arr = this.#sortCommentsFilms();

    for (let i = 0; i < arr.length; i++) {
      this.#renderFilm(topRatedContainerElement, arr[i]);
    }
  }

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#films.sort((a, b) => b.year - a.year);
        break;
      case SortType.RATING:
        this.#films.sort((a, b) => b.rating - a.rating);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
    }

    this.#currentSortType = sortType;
  }


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmsList();
    this.#renderFilmsList();
  }

  #renderSort = () => {
    render(this.#filmsContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }
}
