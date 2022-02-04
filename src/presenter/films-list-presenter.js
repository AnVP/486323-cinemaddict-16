import FilmsView from '../view/films-view';
import CardListView from '../view/card-list-view';
import NoFilmsView from '../view/no-films-view';
import {remove, render, RenderPosition} from '../utils/render';
import ButtonShowMoreView from '../view/button-show-more-view';
import TopRatedListView from '../view/top-rated-list';
import MostCommentedListView from '../view/most-commented-list';
import FilmPresenter from './film-presenter';
import SortView from '../view/sort-view';
import {AUTHORIZATION, END_POINT, FilterType, SortType, UpdateType, UserAction} from '../utils/constants';
import {filter} from '../utils/filter';
import {sortComments, sortDate, sortRating} from '../utils/util';
import LoadingView from '../view/loading-view';
import ApiService from '../api-service';
import CommentsModel from '../model/comments-model';

const CARDS_COUNT_PER_STEP = 5;
const CARDS_COUNT_MIN = 2;

export default class FilmsListPresenter {
  #filmsContainer = null;
  #filmListContainerElement = null;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new CardListView();
  #noFilmsComponent = null;
  #loadMoreButton = null;
  #topRatedListComponent = new TopRatedListView();
  #mostCommentedListComponent = new MostCommentedListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #filmPresenter = new Map();

  #renderedFilmCount = CARDS_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  #filmsModel = null;
  #filterModel = null;
  #api = null;
  #commentsModel = null;

  constructor(filmsContainer, filmsModel, filterModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmListContainerElement = this.#filmsListComponent.element.querySelector('.films-list__container');

    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#api = new ApiService(END_POINT, AUTHORIZATION);

    this.#commentsModel = new CommentsModel(this.#api);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortDate);
      case SortType.RATING:
        return filteredFilms.sort(sortRating);
    }
    return filteredFilms;
  }

  init = () => {
    this.#renderFilmsList();
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #renderFilm = (container, film) => {
    const filmPresenter = new FilmPresenter(container, this.#handleViewAction,  this.#filterType);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(this.#filmListContainerElement, film));
  }

  #renderFilmsList = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const films = this.films;
    const filmsCount = films.length;
    if (filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }
    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }
    this.#renderSort();
    render(this.#filmsContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);

    this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)));
    if (filmsCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
    // this.#renderTopRatedList();
    // this.#renderMostCommentedList();
  }

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noFilmsComponent);
    remove(this.#loadMoreButton);
    remove(this.#loadingComponent);
    // remove(this.#topRatedListComponent);
    // remove(this.#mostCommentedListComponent);

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = CARDS_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderNoFilms = () => {
    this.#noFilmsComponent = new NoFilmsView(this.#filterType);
    render(this.#filmsContainer, this.#noFilmsComponent, RenderPosition.BEFOREEND);
  }

  #renderLoading = () => {
    render(this.#filmsContainer, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #renderLoadMoreButton = () => {
    this.#loadMoreButton = new ButtonShowMoreView();
    render(this.#filmsComponent, this.#loadMoreButton, RenderPosition.BEFOREEND);

    this.#loadMoreButton.setClickHandler(() => {
      const filmsCount = this.films.length;
      const newRenderedFilmCount = Math.min(filmsCount, this.#renderedFilmCount + CARDS_COUNT_PER_STEP);
      const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

      this.#renderFilms(films);
      this.#renderedFilmCount = newRenderedFilmCount;

      if (this.#renderedFilmCount >= filmsCount) {
        remove(this.#loadMoreButton);
      }
    });
  }

  #renderTopRatedList = () => {
    const sortFilms = this.films.filter((film) => film.rating.length > 0).sort(sortRating).slice(0, CARDS_COUNT_MIN);
    render(this.#filmsComponent, this.#topRatedListComponent, RenderPosition.BEFOREEND);
    const topRatedContainerElement = this.#topRatedListComponent.element.querySelector('.films-list__container');
    if (!sortFilms.length) {
      return;
    }
    sortFilms.forEach((film) => this.#renderFilm(topRatedContainerElement, film));
  }

  #renderMostCommentedList = () => {
    const sortFilms = this.films
      .filter((film) => film.comments.length > 0).sort(sortComments).slice(0, CARDS_COUNT_MIN);
    render(this.#filmsComponent, this.#mostCommentedListComponent, RenderPosition.BEFOREEND);
    const topRatedContainerElement = this.#mostCommentedListComponent.element.querySelector('.films-list__container');
    if (!sortFilms.length) {
      return;
    }
    sortFilms.forEach((film) => this.#renderFilm(topRatedContainerElement, film));
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.CLOSE_POPUP:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderFilmsList();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmsList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilmsList();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderFilmsList();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#filmsContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  destroy = () => {
    this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
    remove(this.#filmsComponent);
    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }
}
