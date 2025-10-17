import UserModel from '../models/UserModel.js';
export default class UserRepository {
  async create(payload) {
    const user = new UserModel(payload);
    await user.save();
    return user;
  }
  async findByEmail(email) {
    return UserModel.findOne({ email }).exec();
  }
  async findById(id) {
    return UserModel.findById(id).exec();
  }
}
