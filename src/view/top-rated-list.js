import {createElement} from '../render';

const createTopRatedListTemplate =() => (
  `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container"></div>
    </section>`
);

export default class TopRatedListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createTopRatedListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
