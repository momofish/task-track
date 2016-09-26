import {get} from './commonService';
import moment from 'moment';

const resourceUrl = '/api/workload';

export default {
  getWorkSheet(mode, date) {
    return get(resourceUrl, `${mode}/${moment(date).format('YYYY-MM-DD')}`);
  }
}