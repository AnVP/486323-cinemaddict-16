import AbstractView from './abstract-view.js';

const createMostCommentedListTemplate =() => (
  `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container"></div>
    </section>`
);

export default class MostCommentedListView extends AbstractView {
  get template() {
    return createMostCommentedListTemplate();
  }
}
