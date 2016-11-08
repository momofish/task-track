import { get } from './commonService';

const resourceUrl = '/api/users';

let userSerivce = {
  getUser(id) {
    return get(resourceUrl, id);
  },

  currentUser: null
};

  (async () => {
    userSerivce.currentUser = await userSerivce.getUser('current');
  })();

export default userSerivce;