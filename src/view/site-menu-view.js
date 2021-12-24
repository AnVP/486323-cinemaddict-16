import {createTemplateFromArray, addUpperCaseFirst} from '../utils/util';
import AbstractView from './abstract-view.js';

const createSiteMenuItemTemplate = (filter) => (
  `
<a href="#${filter.name}" class="main-navigation__item">${addUpperCaseFirst(filter.name)} <span class="main-navigation__item-count">${filter.count}</span></a>`
);

const createSiteMenuTemplate = (filters) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${createTemplateFromArray(filters, createSiteMenuItemTemplate)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class SiteMenuView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createSiteMenuTemplate(this.#filters);
  }
}
