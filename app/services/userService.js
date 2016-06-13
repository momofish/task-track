import {get} from './commonService';

const resourceUrl = '/api/users';

export default {
  getUser(id) {
    return get(resourceUrl, id);
  }
}