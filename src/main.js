import {remove, render, RenderPosition} from './utils/render.js';
import ProfileView from './view/profile-view';
import {generateFilm} from './mock/film';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import StatisticsView from './view/statistics-view';
import {MenuItem} from './utils/constants';

const CARDS_COUNT = 20;

const films = Array.from({length: CARDS_COUNT}, generateFilm);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new ProfileView(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, filterModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      remove(statisticsComponent);
      filterPresenter.init(handleSiteMenuClick, MenuItem.FILMS);
      if (!siteMainElement.querySelector('.films')) {
        filmsListPresenter.init();
      }
      break;
    case MenuItem.STATISTICS:
      filterPresenter.init(handleSiteMenuClick, MenuItem.STATISTICS);
      filmsListPresenter.destroy();
      statisticsComponent = new StatisticsView(filmsModel.films);
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

filterPresenter.init(handleSiteMenuClick, MenuItem.FILMS);
filmsListPresenter.init();
