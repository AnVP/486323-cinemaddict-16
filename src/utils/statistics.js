import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const StatisticFilterType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

export const TitleRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export const RankRating = {
  NOVICE: {
    MIN: 1,
    MAX: 10
  },
  FAN: {
    MIN: 11,
    MAX: 20
  },
  MOVIE_BUFF: 21,
};

const TIME_SEC = 60;

const StatsTime = {
  TODAY: dayjs().toDate(),
  WEEK: dayjs().subtract(1, 'week').toDate(),
  MONTH: dayjs().subtract(1, 'month').toDate(),
  YEAR: dayjs().subtract(1, 'year').toDate(),
};

export const filterStatistic = {
  [StatisticFilterType.ALL]: (films) => films.filter((film) => film),
  [StatisticFilterType.TODAY]: (films) => films.filter((film) => dayjs(film.watchedDate).isSame(StatsTime.TODAY, 'day')),
  [StatisticFilterType.WEEK]: (films) => films.filter((film) => dayjs(film.watchedDate).isBetween(StatsTime.WEEK, StatsTime.TODAY)),
  [StatisticFilterType.MONTH]: (films) => films.filter((film) => dayjs(film.watchedDate).isBetween(StatsTime.MONTH, StatsTime.TODAY)),
  [StatisticFilterType.YEAR]: (films) => films.filter((film) => dayjs(film.watchedDate).isBetween(StatsTime.YEAR, StatsTime.TODAY)),
};

export const getTotalDuration = (films) => films.map((film) => film.duration).reduce((a, b) => a + b, 0);

export const durationFormat = (min) => ({
  hour: Math.trunc(min / TIME_SEC),
  min: min % TIME_SEC,
});

export const getGenres = (films) => {
  const genres = {};
  films.map((film) => {
    film.genre.forEach((genre) => {
      if (genre in genres) {
        genres[genre]++;
        return;
      }
      genres[genre] = 1;
    });
  });
  return genres;
};

export const getTopGenre = (films) => {
  if (films.length === 0) {
    return '';
  }
  const genres = getGenres(films);
  const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0][0];
  return topGenre;
};

export const getRank = (films) => {
  let title = '';
  const count = films.length;
  if (!films.length) {
    return title;
  }
  if (count >= RankRating.NOVICE.MIN && count <= RankRating.NOVICE.MAX) {
    title = TitleRank.NOVICE;
  } else if (count >= RankRating.FAN.MIN && count <= RankRating.FAN.MAX) {
    title = TitleRank.FAN;
  } else if (count >= RankRating.MOVIE_BUFF) {
    title = TitleRank.MOVIE_BUFF;
  }
  return title;
};
