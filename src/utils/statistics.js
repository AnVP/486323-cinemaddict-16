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
  hour: Math.trunc(min / 60),
  min: min % 60,
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
