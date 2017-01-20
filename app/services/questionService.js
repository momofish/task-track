import { get, put } from './apiService';
import moment from 'moment';

const resourceUrl = '/api/questions';

export default {
  getQuestions(category, filter) {
    return get(`${resourceUrl}/${category}`);
  }
}