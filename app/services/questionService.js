import { get, save } from './apiService';
import moment from 'moment';

const resourceUrl = '/api/questions';

export default {
  getQuestions(category, filter, pageNo) {
    return get(`${resourceUrl}/${category}/${filter || 'index'}/${pageNo || ''}`);
  },

  saveQuestion(question) {
    return save(resourceUrl, question);
  }
}