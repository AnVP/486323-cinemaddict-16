import AbstractView from './abstract-view.js';

const createLoadingTemplate = () => '<h2 class="films-list__title">Loading...</h2>';

class LoadingView extends AbstractView {
  get template() {
    return createLoadingTemplate();
  }
}

export default LoadingView;
