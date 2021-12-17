import {createElement} from '../render';

const createMostCommentedListTemplate =() => (
  `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container"></div>
    </section>`
);

export default class MostCommentedListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMostCommentedListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
