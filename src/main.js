import {remove, render, RenderPosition} from './utils/render.js';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import StatisticsView from './view/statistics-view';
import {AUTHORIZATION, END_POINT, MenuItem} from './utils/constants';
import ApiService from './api-service';
import FooterStatisticsView from './view/footer-statistics-view';
import RankView from './view/rank-view';

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, filterModel, siteHeaderElement);

let statisticsComponent = null;
let rank = null;
let rankComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS: {
      remove(statisticsComponent);
      remove(rankComponent);
      filmsListPresenter.destroy();
      filterPresenter.init(handleSiteMenuClick, MenuItem.FILMS);
      filterPresenter.setMenuClickHandler();
      if (!siteMainElement.querySelector('.films')) {
        filmsListPresenter.init();
      }
      break;
    }
    case MenuItem.STATISTICS: {
      rank = filmsModel.films.filter((film) => film.isWatched);
      filterPresenter.init(handleSiteMenuClick, MenuItem.STATISTICS);
      filterPresenter.setMenuClickHandler();
      filmsListPresenter.destroy();
      remove(rankComponent);
      statisticsComponent = new StatisticsView(filmsModel.films);
      rankComponent = new RankView(rank);
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      render(siteHeaderElement, rankComponent, RenderPosition.BEFOREEND);
      break;
    }
  }
};

filterPresenter.init(handleSiteMenuClick, MenuItem.FILMS);
filmsListPresenter.init();
filmsModel.init().finally(() => {
  filterPresenter.setMenuClickHandler();
  render(siteFooterElement, new FooterStatisticsView(filmsModel.films.length), RenderPosition.BEFOREEND);
});
