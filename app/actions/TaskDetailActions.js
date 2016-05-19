import alt from '../alt';
import {taskService} from '../services';

class TaskDetailActions {
  constructor() {
    this.generateActions(
      'getTaskSuccess'
    );
  }
  
  getTaskDetail(id) {
    taskService.getTaskDetail(id)
    .then(data => {
        this.actions.getTaskSuccess(data);
      });
  }
}

export default alt.createActions(TaskDetailActions);