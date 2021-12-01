import {renderTemplate, RenderPosition} from './render.js';
import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createButtonShowMoreTemplate} from './view/button-show-more-view';
import {createCardListTemplate} from './view/card-list-view';
import {createCardTemplate} from './view/card-view';
import {createFilmsTemplate} from './view/films-view';
import {createFiltersTemplate} from './view/filters-view';
import {createInfoTemplate} from './view/info-view';
import {createProfileTemplate} from './view/profile-view';

const CARDS_COUNT = 5;

const siteHeaderElement = document.querySelector('.header');
renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFiltersTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteMainElement, createFilmsTemplate(), RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films');
renderTemplate(filmsElement, createCardListTemplate(), RenderPosition.BEFOREEND);

const cardListElement = filmsElement.querySelector('.films-list');
const cardContainerElement = cardListElement.querySelector('.films-list__container');

for (let i = 0; i < CARDS_COUNT; i++) {
  renderTemplate(cardContainerElement, createCardTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(cardListElement, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);

const siteFooterTemplate = document.querySelector('.footer');
renderTemplate(siteFooterTemplate, createInfoTemplate(), RenderPosition.AFTEREND);
