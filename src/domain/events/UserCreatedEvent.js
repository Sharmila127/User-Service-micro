export default class UserCreatedEvent {
  constructor({ userId, email, name, createdAt }) {
    this.type = 'user.created';
    this.payload = { userId, email, name, createdAt };
  }
}
