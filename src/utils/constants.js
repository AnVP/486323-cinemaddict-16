const AUTHORIZATION = 'Basic ljsflsjflshfl';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const EMOJIES = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const Key = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  ESC: 'Esc'
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const ButtonStatus = {
  WATCHLIST: 'watchlist',
  WATCHED: 'watched',
  FAVORITE: 'favorite'
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  CLOSE_POPUP: 'CLOSE_POPUP',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ADD_WATCHED: 'ADD_WATCHED',
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const MenuItem = {
  FILMS: 'FILMS',
  STATISTICS: 'STATISTICS',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export {
  Key,
  EMOJIES,
  SortType,
  ButtonStatus,
  UserAction,
  UpdateType,
  FilterType,
  MenuItem,
  AUTHORIZATION,
  END_POINT,
  Mode,
  State
};
