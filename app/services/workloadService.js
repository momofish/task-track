import {get, post} from './commonService';
import moment from 'moment';

const resourceUrl = '/api/workload';

export default {
  getWorkSheet(mode, date) {
    return get(resourceUrl, `${mode}/${moment(date).format('YYYY-MM-DD')}`);
  },

  submitWorkSheet(mode, date, workloads) {
    return post(`${resourceUrl}/${mode}/${moment(date).format('YYYY-MM-DD')}`, { workloads });
  },

  getTodos(category) {
    return get(resourceUrl, `todos/${category || ''}`);
  },

  approve(approves, agree, opinion) {
    return post(`${resourceUrl}/todos/approve`, { approves, agree, opinion });
  }
}