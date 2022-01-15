import AbstractView from '../view/abstract-view';

const getRandomNumber = (number1, number2) => {
  if (number1 < 0 || number2 < 0) {
    throw new Error('переданные числа должны быть больше или равны 0');
  }
  const min = Math.min(number1, number2);
  const max = Math.max(number1, number2);
  const range = max + 1 - min;
  return Math.floor(Math.random() * range + min);
};

const getRandomArrayElement = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

const getRandomText = (array, min, max, str = '') => {
  const messageLength = getRandomNumber(min, max);
  const message = [];
  for (let index = 0; index < messageLength; index++) {
    message.push(getRandomArrayElement(array));
  }
  return message.join(str);
};

const createTemplateFromArray = (array, cb) => array.map((item) => cb(item)).join('');

function addUpperCaseFirst(str) {
  return str[0].toUpperCase() + str.slice(1);
}

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

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [...items.slice(0, index), update, ...items.slice(index + 1)];
};

export {
  getRandomNumber,
  getRandomArrayElement,
  getRandomText,
  createTemplateFromArray,
  addUpperCaseFirst,
  replace,
  updateItem
};
