import alt from '../alt';

class MyTaskActions {
  constructor() {
    this.generateActions(
      'getMyTasksSuccess',
      'addTaskSuccess',
      'addTaskFail'
    );
  }
  
  getMyTasks() {
    $.ajax({url: '/api/tasks/my'})
      .done(data => {
        this.actions.getMyTasksSuccess(data);
      });
  }
  
  addTask(task, form) {
    $.ajax({type: 'PUT', url: '/api/tasks', data: task}).done(() => {
      this.actions.addTaskSuccess();
      this.actions.getMyTasks();
    }).fail(jqXhr => {
      this.actions.addTaskFail({jqXhr, form});
    });
  }
}

export default alt.createActions(MyTaskActions);