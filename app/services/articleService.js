import {get, put} from './commonService';
import moment from 'moment';

const resourceUrl = '/api/articles';

export default {
  getByKey(key) {
    return get(`${resourceUrl}/~${key}`);
  },

  addComment(key, comment) {
    return put(`${resourceUrl}/~${key}/comments`, comment);
  }
}