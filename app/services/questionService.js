import { get, save } from './apiService';
import moment from 'moment';

const resourceUrl = '/api/questions';

export default {
  getQuestion(id) {
    return get(`${resourceUrl}/${id}`);
  },

  getQuestions(category, filter, pageNo) {
    return get(`${resourceUrl}/${category}/${filter || 'index'}/${pageNo || ''}`);
  },

  saveQuestion(question) {
    return save(resourceUrl, question);
  }
}