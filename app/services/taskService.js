const resourceUrl = '/api/tasks';

export default {
  getMyTasks(category, filter) {
    return new Promise((resolve, reject) =>
      $.ajax({ url: `${resourceUrl}/${category}/${filter}`, success: resolve, error: reject })
    );
  },
  
  getTaskDetail(id) {
    return new Promise((resolve, reject) =>
      $.ajax({ url: `${resourceUrl}/${id}`, success: resolve, error: reject })
    );
  },

  addTask(task) {
    return new Promise((resolve, reject) =>
      $.ajax({ url: resourceUrl, type: 'PUT', data: task, success: resolve, error: reject })
    );
  },
  
  updateTask(task) {
    return new Promise((resolve, reject) =>
      $.ajax({ url: resourceUrl, type: 'POST', data: task, success: resolve, error: reject })
    );
  }
}