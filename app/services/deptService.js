import {get} from './apiService';

const resourceUrl = '/api/teams';

export default {
  getMyDepts() {
    return get(resourceUrl, 'my');
  },
  
  getDept(id) {
    return get(resourceUrl, id);
  }
}