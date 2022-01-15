import {render, RenderPosition} from './utils/render.js';
import SiteMenuView from './view/site-menu-view.js';
import ProfileView from './view/profile-view';
import {generateFilm} from './mock/film';
import {generateFilter} from './mock/filter';
import FilmsListPresenter from './presenter/films-list-presenter';

const CARDS_COUNT = 20;

const films = Array.from({length: CARDS_COUNT}, generateFilm);
const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
render(siteMainElement, new SiteMenuView(filters), RenderPosition.BEFOREEND);
// render(siteMainElement, new FiltersView(), RenderPosition.BEFOREEND);

const filmsListPresenter = new FilmsListPresenter(siteMainElement);
filmsListPresenter.init(films);
