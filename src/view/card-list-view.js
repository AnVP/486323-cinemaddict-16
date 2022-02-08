import AbstractView from './abstract-view.js';

const createCardListTemplate =() => (
  `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
  </section>`
);

class CardListView extends AbstractView {
  get template() {
    return createCardListTemplate();
  }
}

export default CardListView;
