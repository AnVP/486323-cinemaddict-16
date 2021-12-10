export const createCardTemplate =(film) => {
  const addToWatchClassName = film.isAddToWatchList
    ? 'film-card__controls-item--active'
    : '';
  const watchedClassName = film.isWatched
    ? 'film-card__controls-item--active'
    : '';
  const favoriteClassName = film.isFavorite
    ? 'film-card__controls-item--active'
    : '';
  return `<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${film.title}</h3>
            <p class="film-card__rating">${film.rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${film.year}</span>
              <span class="film-card__duration">${film.duration}</span>
              <span class="film-card__genre">${film.genre.slice(0, 1)}</span>
            </p>
            <img src="./images/posters/${film.poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${film.description}</p>
            <span class="film-card__comments">${film.comments.length} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addToWatchClassName}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
          </div>
        </article>`;
};
