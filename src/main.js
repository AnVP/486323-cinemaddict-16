import {render, RenderPosition} from './render.js';
import SiteMenuView from './view/site-menu-view.js';
import ButtonShowMoreView from './view/button-show-more-view';
import CardListView from './view/card-list-view';
import CardView from './view/card-view';
import FilmsView from './view/films-view';
import FiltersView from './view/filters-view';
import InfoView from './view/info-view';
import ProfileView from './view/profile-view';
import TopRatedListView from './view/top-rated-list';
import MostCommentedListView from './view/most-commented-list';
import NoTaskView from './view/no-films-view';
import {generateFilm} from './mock/film';
import {generateFilter} from './mock/filter';

const CARDS_COUNT = 20;
const CARDS_COUNT_PER_STEP = 5;
const CARDS_COUNT_MIN = 2;

const films = Array.from({length: CARDS_COUNT}, generateFilm);
const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new ProfileView().element, RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
render(siteMainElement, new SiteMenuView(filters).element, RenderPosition.BEFOREEND);
render(siteMainElement, new FiltersView().element, RenderPosition.BEFOREEND);

render(siteMainElement, new FilmsView().element, RenderPosition.BEFOREEND);

if (films.length) {
  const filmsElement = siteMainElement.querySelector('.films');
  render(filmsElement, new CardListView().element, RenderPosition.BEFOREEND);

  const cardListElement = filmsElement.querySelector('.films-list');
  const cardContainerElement = cardListElement.querySelector('.films-list__container');

  const renderFilm = (container, film) => {
    const cardComponent = new CardView(film);
    const siteFooterTemplate = document.querySelector('.footer');
    const infoComponent = new InfoView(generateFilm());
    const removePopup = () => {
      infoComponent.element.remove();
    };
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        removePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    cardComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
      render(siteFooterTemplate, infoComponent.element, RenderPosition.AFTEREND);
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', onEscKeyDown);
    });
    infoComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      removePopup();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(container, cardComponent.element, RenderPosition.BEFOREEND);
  };

  for (let i = 0; i < Math.min(films.length, CARDS_COUNT_PER_STEP); i++) {
    renderFilm(cardContainerElement, films[i]);
  }

  if (films.length > CARDS_COUNT_PER_STEP) {
    let renderedTaskCount = CARDS_COUNT_PER_STEP;
    const loadMoreButton = new ButtonShowMoreView();
    render(cardListElement, loadMoreButton.element, RenderPosition.BEFOREEND);

    loadMoreButton.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      films
        .slice(renderedTaskCount, renderedTaskCount + CARDS_COUNT_PER_STEP)
        .forEach((film) => renderFilm(cardContainerElement, film));

      renderedTaskCount += CARDS_COUNT_PER_STEP;

      if (renderedTaskCount >= films.length) {
        loadMoreButton.element.remove();
        loadMoreButton.removeElement();
      }
    });
  }

  render(filmsElement, new TopRatedListView().element, RenderPosition.BEFOREEND);
  const topRatedListElement = filmsElement.querySelector('.films-list--extra');
  const topRatedContainerElement = topRatedListElement.querySelector('.films-list__container');

  for (let i = 0; i < CARDS_COUNT_MIN; i++) {
    renderFilm(topRatedContainerElement, films[i]);
  }

  render(filmsElement, new MostCommentedListView().element, RenderPosition.BEFOREEND);
  const mostCommentedListElement = filmsElement.querySelector('.films-list--extra:last-of-type');
  const mostCommentedContainerElement = mostCommentedListElement.querySelector('.films-list__container');

  for (let i = 0; i < CARDS_COUNT_MIN; i++) {
    renderFilm(mostCommentedContainerElement, films[i]);
  }
} else {
  render(siteMainElement, new NoTaskView().element, RenderPosition.BEFOREEND);
}
