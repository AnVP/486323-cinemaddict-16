import AbstractView from './abstract-view.js';

const createProfileTemplate = () => (
  `<section class="header__profile profile">
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileView extends AbstractView {
  get template() {
    return createProfileTemplate();
  }
}
