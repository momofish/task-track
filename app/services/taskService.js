const resourceUrl = '/api/tasks';

export default {
  getMyTasks(category, filter) {
    return new Promise((resolve, reject) =>
      $.ajax({
        url: `${resourceUrl}/${category}/${filter}`, contentType: "application/json",
        success: resolve, error: reject
      })
    );
  },

  getTaskDetail(id) {
    return new Promise((resolve, reject) =>
      $.ajax({
        url: `${resourceUrl}/${id}`, contentType: "application/json",
        success: resolve, error: reject
      })
    );
  },

  addTask(task) {
    return new Promise((resolve, reject) =>
      $.ajax({
        url: resourceUrl, type: 'PUT', contentType: "application/json",
        data: JSON.stringify(task), success: resolve, error: reject
      })
    );
  },

  updateTask(task) {
    return new Promise((resolve, reject) =>
      $.ajax({
        url: resourceUrl, type: 'POST', contentType: "application/json",
        data: JSON.stringify(task), success: resolve, error: reject
      })
    );
  }
}