import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const TIME_SEC = 60;

const StatisticFilterType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

const TitleRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

const RankRating = {
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

const StatsTime = {
  TODAY: dayjs().toDate(),
  WEEK: dayjs().subtract(1, 'week').toDate(),
  MONTH: dayjs().subtract(1, 'month').toDate(),
  YEAR: dayjs().subtract(1, 'year').toDate(),
};

const filterStatistic = {
  [StatisticFilterType.ALL]: (films) => films.filter((film) => film),
  [StatisticFilterType.TODAY]: (films) => films.filter((film) => dayjs(film.watchedDate).isSame(StatsTime.TODAY, 'day')),
  [StatisticFilterType.WEEK]: (films) => films.filter((film) => dayjs(film.watchedDate).isBetween(StatsTime.WEEK, StatsTime.TODAY)),
  [StatisticFilterType.MONTH]: (films) => films.filter((film) => dayjs(film.watchedDate).isBetween(StatsTime.MONTH, StatsTime.TODAY)),
  [StatisticFilterType.YEAR]: (films) => films.filter((film) => dayjs(film.watchedDate).isBetween(StatsTime.YEAR, StatsTime.TODAY)),
};

const getTotalDuration = (films) => films.map((film) => film.duration).reduce((a, b) => a + b, 0);

const durationFormat = (min) => ({
  hour: Math.trunc(min / TIME_SEC),
  min: min % TIME_SEC,
});

const getGenres = (films) => {
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

const getTopGenre = (films) => {
  if (films.length === 0) {
    return '';
  }
  const genres = getGenres(films);
  const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0][0];
  return topGenre;
};

const getRank = (films) => {
  let title = '';
  const count = films.length;
  if (!films.length) {
    return title;
  }
  switch (true) {
    case (count >= RankRating.NOVICE.MIN && count <= RankRating.NOVICE.MAX): {
      title = TitleRank.NOVICE;
      break;
    }
    case (count >= RankRating.FAN.MIN && count <= RankRating.FAN.MAX): {
      title = TitleRank.FAN;
      break;
    }
    case (count >= RankRating.MOVIE_BUFF): {
      title = TitleRank.MOVIE_BUFF;
      break;
    }
  }
  return title;
};

export {
  StatisticFilterType,
  TitleRank,
  RankRating,
  filterStatistic,
  getTotalDuration,
  durationFormat,
  getGenres,
  getTopGenre,
  getRank
};
