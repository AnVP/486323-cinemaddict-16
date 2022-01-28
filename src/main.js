import {render, RenderPosition} from './utils/render.js';
import FilterView from './view/filter-view.js';
import ProfileView from './view/profile-view';
import {generateFilm} from './mock/film';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilmPresenter from './presenter/film-presenter';
import FilterPresenter from './presenter/filter-presenter';

const CARDS_COUNT = 20;

const films = Array.from({length: CARDS_COUNT}, generateFilm);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

filterPresenter.init();
// render(siteMainElement, new FiltersView(), RenderPosition.BEFOREEND);

const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, filterModel);
filmsListPresenter.init();
