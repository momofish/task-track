import {get, put, post} from './commonService';

const resourceUrl = '/api/tasks';

export default {
  getTasks(category, filter) {
    return get(resourceUrl, `${category}/${filter}`);
  },

  getTaskDetail(id) {
    return get(resourceUrl, id);
  },

  addTask(task) {
    return put(resourceUrl, task);
  },

  updateTask(task) {
    return post(resourceUrl, task);
  }
}