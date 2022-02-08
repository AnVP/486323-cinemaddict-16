import AbstractView from './abstract-view.js';

const createFilmsTemplate =() => '<section class="films"></section>';

class FilmsView extends AbstractView {
  get template() {
    return createFilmsTemplate();
  }
}

export default FilmsView;
