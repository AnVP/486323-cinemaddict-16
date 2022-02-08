import AbstractView from './abstract-view.js';

const createFooterStatisticsTemplate =(count) => (
  `<section class="footer__statistics">
    <p>${count} movies inside</p>
  </section>`
);

class FooterStatisticsView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#count);
  }
}

export default FooterStatisticsView;
