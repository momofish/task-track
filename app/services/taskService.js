import {get, put, post, remove} from './commonService';

const resourceUrl = '/api/tasks';

export default {
  getTasks(category, filter) {
    return get(resourceUrl, `${category}/${filter}`);
  },

  getTask(id) {
    return get(resourceUrl, id);
  },

  addTask(task) {
    return put(resourceUrl, task);
  },

  updateTask(task) {
    return post(resourceUrl, task);
  },
  
  deleteTask(id) {
    return remove(resourceUrl, id);
  }
}