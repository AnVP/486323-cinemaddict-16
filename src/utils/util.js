import AbstractView from '../view/abstract-view';

export const createTemplateFromArray = (array, cb) => array.map((item) => cb(item)).join('');

export const addUpperCaseFirst = (str) => str[0].toUpperCase() + str.slice(1);

export const replace = (newElement, oldElement) => {
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

export const sortRating = (filmA, filmB) => filmB.rating - filmA.rating;
export const sortComments = (filmA, filmB) => filmB.comments.length - filmA.comments.length;
export const sortDate = (filmA, filmB) => filmB.year - filmA.year;
