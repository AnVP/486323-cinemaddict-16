import * as dayjs from 'dayjs';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;
  #filmId = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments(filmId) {
    return this.#load({ url: `comments/${filmId}` })
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptFilmToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  addComment = async (filmId, comment) => {
    const response = await this.#load({
      url: `/comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptCommentToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  deleteComment = async (comment) => {
    const response = await this.#load({
      url: `/comments/${comment}`,
      method: Method.DELETE,
    });

    return response;
  }


  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptFilmToServer = (film) => {
    const adaptedFilm = {...film,
      'film_info': {
        'actors': film.actors,
        'age_rating': film.age,
        'alternative_title': film.origin,
        'description': film.description,
        'director': film.director,
        'genre': film.genre,
        'poster': film.poster,
        'release': {
          'date': dayjs(film.year).toISOString(),
          'release_country': film.country
        },
        'runtime': film.duration,
        'title': film.title,
        'total_rating': film.rating,
        'writers': film.writers,
      },
      'user_details': {
        'already_watched': film.isWatched,
        'favorite': film.isFavorite,
        'watching_date': film.watchedDate,
        'watchlist': film.isAddToWatchList
      },
    };

    delete adaptedFilm.actors;
    delete adaptedFilm.age;
    delete adaptedFilm.origin;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.genre;
    delete adaptedFilm.poster;
    delete adaptedFilm.year;
    delete adaptedFilm.country;
    delete adaptedFilm.duration;
    delete adaptedFilm.title;
    delete adaptedFilm.rating;
    delete adaptedFilm.writers;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.watchedDate;
    delete adaptedFilm.isAddToWatchList;

    return adaptedFilm;
  }

  #adaptCommentToServer = (newComment) => {
    const adaptedComment = {...newComment,
      'comment': newComment.text,
      'emotion': newComment.emoji
    };

    delete adaptedComment.text;
    delete adaptedComment.emoji;

    return adaptedComment;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
