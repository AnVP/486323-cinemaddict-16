import AbstractView from '../view/abstract-view';

const createTemplateFromArray = (data, cb) => data.map((item) => cb(item)).join('');

const addUpperCaseFirst = (str) => str[0].toUpperCase() + str.slice(1);

const replace = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    throw new Error('Cannot replace unexisting elements');
  }

  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Parent element does not exist');
  }

  parent.replaceChild(newChild, oldChild);
};

const sortRating = (filmA, filmB) => filmB.rating - filmA.rating;
const sortDate = (filmA, filmB) => filmB.year - filmA.year;

export {
  createTemplateFromArray,
  addUpperCaseFirst,
  replace,
  sortRating,
  sortDate
};
