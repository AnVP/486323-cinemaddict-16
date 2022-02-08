import AbstractObservable from '../utils/abstract-observable.js';

class CommentsModel extends AbstractObservable {
  #comments = new Map;
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (filmId) => {
    try {
      const comments = await this.#apiService.getComments(filmId);
      this.#comments = comments.map(this.#adaptToClient);
    } catch(err) {
      this.#comments = [];
    }
  }

  addComment = async (actionType, filmId, update) => {
    try {
      const response = await this.#apiService.addComment(filmId, update);
      this.#comments = response.comments.map(this.#adaptToClient);
      this._notify(actionType, response);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (actionType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(actionType, update);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment,
      'text': comment.comment,
      'emoji': comment.emotion,
    };

    delete adaptedComment.comment;
    delete adaptedComment.emotion;
    return adaptedComment;
  }
}

export default CommentsModel;
