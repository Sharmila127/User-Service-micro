export default class UserLoggedOutEvent {
  constructor({ userId, at }) {
    this.type = 'user.logged_out';
    this.payload = { userId, at: at || new Date().toISOString() };
  }
}
