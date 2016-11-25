import { get } from './commonService';

const resourceUrl = '/api/users';

let userSerivce = {
  getUser(id) {
    return get(resourceUrl, id);
  },

  currentUser: null,

  async getCurrentUser() {
    if (this.currentUser)
      return this.currentUser;

    this.currentUser = await this.getUser('current');
    return this.currentUser;
  }
};
userSerivce.getCurrentUser();

export default userSerivce;