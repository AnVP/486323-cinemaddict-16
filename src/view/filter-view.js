import {addUpperCaseFirst} from '../utils/util';
import {FilterType, MenuItem} from '../utils/constants';
import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType, menuItem) => {
  const {type, name, count} = filter;
  return (`<a href="#${type}" class="main-navigation__item ${type === currentFilterType && menuItem === MenuItem.FILMS ? 'main-navigation__item--active' : ''}" data-filter="${type}">${addUpperCaseFirst(name)} ${type === FilterType.ALL ? '' : `<span class="main-navigation__item-count">${count}</span></a>`} `
  );
};

const createFilterTemplate = (filters, currentFilterType, menuItem) => {
  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType, menuItem))
    .join('');
  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional ${menuItem === MenuItem.STATISTICS ? 'main-navigation__additional--active' : ''}">Stats</a>
  </nav>`
  );
};

class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #menuItem = null;

  constructor(filters, currentFilterType, menuItem) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#menuItem = menuItem;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter, this.#menuItem);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.querySelector('.main-navigation__items').addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.dataset.filter) {
      this._callback.filterTypeChange(evt.target.dataset.filter);
    }
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.classList.contains('main-navigation__additional')) {
      this._callback.menuClick(MenuItem.STATISTICS);
    } else if (evt.target.dataset.filter) {
      this._callback.menuClick(MenuItem.FILMS);
    }
    this._callback.menuClick(evt.target.value);
  }
}

export default FilterView;
