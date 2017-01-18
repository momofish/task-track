import { get, put } from './commonService';
import moment from 'moment';

const resourceUrl = '/api/questions';

export default {
  getQuestions(category, filter) {
    return get(`${resourceUrl}/${category}`);
  }
}