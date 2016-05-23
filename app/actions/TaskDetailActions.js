import alt from '../alt';
import {taskService} from '../services';

class TaskDetailActions {
  constructor() {
    this.generateActions(
      'getTaskDetailSuccess',
      'updateTaskDetailSuccess'
    );
  }

  getTaskDetail(id) {
    taskService.getTaskDetail(id)
      .then(task => {
        this.actions.getTaskDetailSuccess(task);
      });
  }

  updateTaskDetail(task, taskPopulated) {
    taskService.updateTask(task)
      .then(() => this.actions.updateTaskDetailSuccess(taskPopulated));
  }
}

export default alt.createActions(TaskDetailActions);