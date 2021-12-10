import {renderTemplate, RenderPosition} from './render.js';
import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createButtonShowMoreTemplate} from './view/button-show-more-view';
import {createCardListTemplate} from './view/card-list-view';
import {createCardTemplate} from './view/card-view';
import {createFilmsTemplate} from './view/films-view';
import {createFiltersTemplate} from './view/filters-view';
import {createInfoTemplate} from './view/info-view';
import {createProfileTemplate} from './view/profile-view';
import {createTopRatedListTemplate} from './view/top-rated-list';
import {createMostCommentedListTemplate} from './view/most-commented-list';
import {generateFilm} from './mock/film';
import {generateFilter} from './mock/filter';

const CARDS_COUNT = 25;
const CARDS_COUNT_PER_STEP = 5;
const CARDS_COUNT_MIN = 2;

const films = Array.from({length: CARDS_COUNT}, generateFilm);
const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
renderTemplate(siteMainElement, createSiteMenuTemplate(filters), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFiltersTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteMainElement, createFilmsTemplate(), RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films');
renderTemplate(filmsElement, createCardListTemplate(), RenderPosition.BEFOREEND);

const cardListElement = filmsElement.querySelector('.films-list');
const cardContainerElement = cardListElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, CARDS_COUNT_PER_STEP); i++) {
  renderTemplate(cardContainerElement, createCardTemplate(films[i]), RenderPosition.BEFOREEND);
}

if (films.length > CARDS_COUNT_PER_STEP) {
  let renderedTaskCount = CARDS_COUNT_PER_STEP;

  renderTemplate(cardListElement, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);

  const loadMoreButton = cardListElement.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedTaskCount, renderedTaskCount + CARDS_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(cardContainerElement, createCardTemplate(film), RenderPosition.BEFOREEND));

    renderedTaskCount += CARDS_COUNT_PER_STEP;

    if (renderedTaskCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

renderTemplate(filmsElement, createTopRatedListTemplate(), RenderPosition.BEFOREEND);
const topRatedListElement = filmsElement.querySelector('.films-list--extra');
const topRatedContainerElement = topRatedListElement.querySelector('.films-list__container');

for (let i = 0; i < CARDS_COUNT_MIN; i++) {
  renderTemplate(topRatedContainerElement, createCardTemplate(films[i]), RenderPosition.BEFOREEND);
}

renderTemplate(filmsElement, createMostCommentedListTemplate(), RenderPosition.BEFOREEND);
const mostCommentedListElement = filmsElement.querySelector('.films-list--extra:last-of-type');
const mostCommentedContainerElement = mostCommentedListElement.querySelector('.films-list__container');

for (let i = 0; i < CARDS_COUNT_MIN; i++) {
  renderTemplate(mostCommentedContainerElement, createCardTemplate(films[i]), RenderPosition.BEFOREEND);
}
const siteFooterTemplate = document.querySelector('.footer');
renderTemplate(siteFooterTemplate, createInfoTemplate(generateFilm()), RenderPosition.AFTEREND);
