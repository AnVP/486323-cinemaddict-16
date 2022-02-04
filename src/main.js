import {remove, render, RenderPosition} from './utils/render.js';
import ProfileView from './view/profile-view';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import StatisticsView from './view/statistics-view';
import {AUTHORIZATION, END_POINT, MenuItem} from './utils/constants';
import ApiService from './api-service';

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, filterModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      remove(statisticsComponent);
      filterPresenter.init(handleSiteMenuClick, MenuItem.FILMS);
      filterPresenter.setMenuClickHandler();
      if (!siteMainElement.querySelector('.films')) {
        filmsListPresenter.init();
      }
      break;
    case MenuItem.STATISTICS:
      filterPresenter.init(handleSiteMenuClick, MenuItem.STATISTICS);
      filterPresenter.setMenuClickHandler();
      filmsListPresenter.destroy();
      statisticsComponent = new StatisticsView(filmsModel.films);
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

filterPresenter.init(handleSiteMenuClick, MenuItem.FILMS);
filmsListPresenter.init();
filmsModel.init().finally(() => {
  render(siteHeaderElement, new ProfileView(filmsModel.films), RenderPosition.BEFOREEND);
  filterPresenter.setMenuClickHandler();
});
