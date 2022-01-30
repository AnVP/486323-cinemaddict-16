import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart-view';
import {
  durationFormat,
  filterStatistic,
  getGenres,
  getTopGenre,
  getTotalDuration,
  StatisticFilterType
} from '../utils/statistics';

const BAR_HEIGHT = 50;

const renderChart = (statisticCtx, films) => {
  statisticCtx.height = BAR_HEIGHT * 5;

  const genres = [];
  const genresCounts = [];

  Object.entries(getGenres(films))
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, count]) => {
      genres.push(name);
      genresCounts.push(count);
    });

  return  new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genres,
      datasets: [{
        data: genresCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatFilterTemplate = (filter, currentFilterType) => {
  const {type, name} = filter;
  return `
  <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${type === currentFilterType ? 'checked' : ''}>
      <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`;
};

const createStatisticsTemplate = (films, watchedFilms, filters, currentFilterType) => {
  const createFilterTemplate = filters.map((item) => createStatFilterTemplate(item, currentFilterType)).join('');

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${createFilterTemplate}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilms.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${durationFormat(getTotalDuration(films)).hour} <span class="statistic__item-description">h</span> ${durationFormat(getTotalDuration(films)).min} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${getTopGenre(films)}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class StatisticsView extends SmartView {
  #chart = null;
  #films = null;
  #watchedFilms = null;
  #currentFilter = null;
  #filteredFilms = null;

  constructor(films) {
    super();

    this.#films = films;
    this.#watchedFilms = this.#films.filter((film) => film.isWatched);
    this.#currentFilter = StatisticFilterType.ALL;
    this.#filteredFilms = filterStatistic[this.#currentFilter][this.#watchedFilms];

    this.setClickFiltersHandler();
    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate(this.#films, this.#watchedFilms, this.filters, this.#currentFilter);
  }

  get filters() {
    return [
      {
        type: StatisticFilterType.ALL,
        name: 'All time',
      },
      {
        type: StatisticFilterType.TODAY,
        name: 'Today',
      },
      {
        type: StatisticFilterType.WEEK,
        name: 'Week',
      },
      {
        type: StatisticFilterType.MONTH,
        name: 'Month',
      },
      {
        type: StatisticFilterType.YEAR,
        name: 'Year',
      },
    ];
  }

  restoreHandlers = () => {
    this.setClickFiltersHandler();
    this.#setCharts();
  }

  setClickFiltersHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.statistic__filters').addEventListener('change', this.#clickFiltersHandler);
  }

  #clickFiltersHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.name === 'statistic-filter') {
      this.#currentFilter = evt.target.value;
      this.#filteredFilms = filterStatistic[this.#currentFilter][this.#watchedFilms];
      this.updateElement();
    }
  }

  #setCharts = () => {
    if (this.#chart !== null) {
      this.#chart = null;
    }
    const statisticChartContainer = this.element.querySelector('.statistic__chart');
    this.#chart = renderChart(statisticChartContainer, this.#films);
  }
}
