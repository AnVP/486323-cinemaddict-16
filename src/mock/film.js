import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {
  TITLES,
  DESCRIPTIONS,
  ORIGIN_TITLES,
  POSTERS,
  DURATIONS,
  COUNTRY,
  PEOPLE,
  GENRES,
  COMMENTS_TEXT,
  COMMENTS_NAMES,
  EMOJIES,
  AGE
} from '../utils/constants';
import {getRandomNumber, getRandomArrayElement, getRandomText} from '../utils/util';

const description = DESCRIPTIONS.split('.').filter((index) => index !=='');

const generateDate = () => {
  const maxDaysGap = 365;
  const daysGap = getRandomNumber(0, maxDaysGap);

  return dayjs().add(-daysGap, 'day').format('YYYY/MM/DD HH:mm');
};

const generateComment = () => ({
  id: nanoid(),
  text: getRandomArrayElement(COMMENTS_TEXT),
  emoji: getRandomArrayElement(EMOJIES),
  author: getRandomArrayElement(COMMENTS_NAMES),
  date: generateDate(),
});

const generateCommentList = () => {
  const commentsLength = getRandomNumber(0, 3);
  const commentsArray = [];
  for (let i = 0; i < commentsLength; i++) {
    commentsArray.push(generateComment());
  }
  return commentsArray;
};

const generateGenres = (genre) => {
  const genresArray = [];
  for (let i = 0; i <= getRandomNumber(0, 3); i++) {
    genresArray.push(genre[i]);
  }
  return genresArray;
};

export const generateFilm = () => (
  {
    id: nanoid(),
    poster: getRandomArrayElement(POSTERS),
    title: getRandomArrayElement(TITLES),
    origin: getRandomArrayElement(ORIGIN_TITLES),
    description: getRandomText(description, 1, 5, '.'),
    comments: generateCommentList(),
    rating: `${getRandomNumber(0, 9)}.${getRandomNumber(0, 9)}`,
    year: getRandomNumber(1920, 1970),
    duration: getRandomArrayElement(DURATIONS),
    age: getRandomArrayElement(AGE),
    genre: generateGenres(GENRES),
    director: getRandomArrayElement(PEOPLE),
    writers: getRandomText(PEOPLE, 1, 3, ', '),
    actors: getRandomText(PEOPLE, 1, 3, ', '),
    country: getRandomArrayElement(COUNTRY),
    isAddToWatchList: Boolean(getRandomNumber(0, 1)),
    isWatched: Boolean(getRandomNumber(0, 1)),
    isFavorite: Boolean(getRandomNumber(0, 1)),
  });

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortDateUp = (elA, elB) => {
  const weight = getWeightForNullDate(elA.dueDate, elB.dueDate);

  return weight ?? dayjs(elA.dueDate).diff(dayjs(elB.dueDate));
};
