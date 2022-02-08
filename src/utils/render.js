import AbstractView from '../view/abstract-view.js';

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const render = (container, element, place) => {
  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (place) {
    case RenderPosition.BEFOREBEGIN: {
      parent.before(child);
      break;
    }
    case RenderPosition.AFTERBEGIN: {
      parent.prepend(child);
      break;
    }
    case RenderPosition.BEFOREEND: {
      parent.append(child);
      break;
    }
    case RenderPosition.AFTEREND: {
      parent.after(child);
      break;
    }
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
};

export {
  RenderPosition,
  render,
  createElement,
  remove
};
