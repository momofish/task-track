import alt from '../alt';

class TaskDetailActions {
  constructor() {
    this.generateActions(
      'getTaskSuccess'
    );
  }
  
  getTaskDetail(id) {
    $.ajax({url: '/api/tasks/' + id})
      .done(data => {
        this.actions.getTaskSuccess(data);
      });
  }
}

export default alt.createActions(TaskDetailActions);