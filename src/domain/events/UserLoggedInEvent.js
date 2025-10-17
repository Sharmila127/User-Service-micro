export default class UserLoggedInEvent {
  constructor({ userId, email, at }) {
    this.type = 'user.logged_in';
    this.payload = { userId, email, at: at || new Date().toISOString() };
  }
}
