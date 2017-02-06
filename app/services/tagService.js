import moment from 'moment';

import { get, save, put } from './apiService';

const resourceUrl = '/api/tags';

export default {
  getTags(category, filter = null) {
    return get(`${resourceUrl}/${category}/${filter}`);
  },
}